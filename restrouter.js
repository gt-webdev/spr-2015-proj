var express = require('express');
var fs = require('fs');

// Used to generate object ids
var id_counters = {};

function writeData(resumeData) {
    fs.writeFile('data/rest.json', JSON.stringify(resumeData, null, 4));
}

function addProfileEndpoints(router, resumeData) {
	router.get('/Profile', function(req, res) {
		res.send(resumeData.Profile);
		res.end();
	});

	router.put('/Profile', function(req, res) {
		if (!req.body) return req.sendStatus(400);

    	var profileChanges = req.body;

		Object.keys(profileChanges).forEach(function (key) {
			resumeData.Profile[key] = profileChanges[key];
		});

		res.send(resumeData.Profile);
		writeData(resumeData);

    	res.end();
	});
}

function addSectionsEndpoints(router, resumeData, sections) {
	sections.forEach(function(section) {

    	// Get section
        router.get('/' + section, function(req, res) {
            res.send(resumeData[section]);
            res.end();
        });

        // Get subsection
        router.get('/' + section + '/:id', function(req, res) {
        	var id = req.params.id;

        	resumeData[section].forEach(function(subsection) {
        		if (subsection._id == id) {
        			res.send(subsection);
        		}
        	});

        	res.end();
        });

        // Insert subsection
        router.post('/' + section, function(req, res) {
            if (!req.body) return req.sendStatus(400);

            var newObject = req.body;
            newObject._id = id_counters[section]++;
            resumeData[section].push(newObject);
            res.send(newObject);
            writeData(resumeData);

            res.end();
        });

        // Update subsection
        router.put('/' + section + '/:id', function(req, res) {
        	if (!req.body) return req.sendStatus(400);

        	var id = req.params.id;
        	var object = req.body;

        	resumeData[section].forEach(function(subsection) {
        		if (subsection._id == id) {
        			Object.keys(object).forEach(function (key) {
        				subsection[key] = object[key];
        			});

        			res.send(subsection);
        			writeData(resumeData);
        		}
        	});

        	res.end();
        });

        // Delete subsection
        router.delete('/' + section + '/:id', function(req, res) {

            resumeData[section] = resumeData[section].filter(function (subsection) {
                return subsection._id != req.params.id;
            });
            writeData(resumeData);

            res.end();
        })
    });
}

function addSkillsSectionEndpoint(router, resumeData) {
	var section = 'Skills';

	// Get Skillsets
    router.get('/' + section, function(req, res) {
        res.send(resumeData[section]);
        res.end();
    });

    // Get a particular skillset
    router.get('/' + section + '/:skillset', function(req, res) {
    	var skillset;
    	resumeData[section].forEach(function(skill_set) {
    		if (skill_set.title == req.params.skillset) {
    			skillset = skill_set;
    		}
    	});

    	if (!skillset) return res.sendStatus(404);	// Skillset was not found

    	res.send(skillset.items);
    	res.end();
    });

    // Get a particular skill
    router.get('/' + section + '/:skillset/:id', function(req, res) {
    	var skillset;
    	resumeData[section].forEach(function(skill_set) {
    		if (skill_set.title == req.params.skillset) {
    			skillset = skill_set;
    		}
    	});

    	if (!skillset) return res.sendStatus(404);	// Skillset was not found

    	skillset.items.forEach(function(skill) {
    		if (skill._id == req.params.id) {
    			res.send(skill);
    		}
    	});

    	res.end();
    });

    //Insert a skill into a skillset
    router.post('/' + section + '/:skillset', function(req, res) {
    	if (!req.body) return res.sendStatus(400);

    	var skillset;
    	resumeData[section].forEach(function(skill_set) {
    		if (skill_set.title == req.params.skillset) {
    			skillset = skill_set;
    		}
    	});

    	if (!skillset) return res.sendStatus(404);	// Skillset was not found

    	var newSkill = req.body;
        newSkill._id = id_counters[section][skillset.title]++;
        skillset.items.push(newSkill);

        res.send(newSkill);
        writeData(resumeData);

        res.end();
    });

    // Update a skill
    router.put('/' + section + '/:skillset/:id', function(req, res) {
    	if (!req.body) return res.sendStatus(400);

    	var skillChanges = req.body;

    	var skillset;
    	resumeData[section].forEach(function(skill_set) {
    		if (skill_set.title == req.params.skillset) {
    			skillset = skill_set;
    		}
    	});

    	if (!skillset) return res.sendStatus(404);	// Skillset was not found

    	skillset.items.forEach(function(skill) {
    		if (skill._id == req.params.id) {
    			Object.keys(skillChanges).forEach(function (key) {
    				skill[key] = skillChanges[key];
    			});

    			res.send(skill);
    			writeData(resumeData);
    		}
    	});

    	res.end();
    });

    // Remove a skill
    router.delete('/' + section + '/:skillset/:id', function(req, res) {
    	var skillset;
    	resumeData[section].forEach(function(skill_set) {
    		if (skill_set.title == req.params.skillset) {
    			skillset = skill_set;
    		}
    	});

    	if (!skillset) return res.sendStatus(404);	// Skillset was not found

    	skillset.items = skillset.items.filter(function(skill) {
    		return skill._id != req.params.id;
    	});

    	writeData(resumeData);
    	
    	res.end();
    });
}

module.exports = function(resumeData) {
	var router = express.Router();

	// Initialize id_counters with the 1 + maxId used in each array.
	Object.keys(resumeData).forEach(function(section) {
		var maxId = function(objects) {
			if (Object.prototype.toString.call(objects) === '[object Array]') {
				return objects.reduce(function(previous, object) {
					return ( previous > object._id ? previous : object._id );
				});
			} else {
				return objects._id;
			}
		};

		if (section == "Skills") {
			id_counters[section] = {};
			resumeData[section].forEach(function(skillset) {
				id_counters[section][skillset.title] = 1 + maxId(skillset.items);
			});
		} else {
			id_counters[section] = 1 + maxId(resumeData[section]);
		}
	});

	// Route to full resume
	router.get('/', function(req, res) {
        res.send(resumeData);
        res.end();
	});

	// Routes to profile information (name, email, accounts, ...)
	addProfileEndpoints(router, resumeData);

	// Routes to resume section, not including the skills section
	addSectionsEndpoints(router,
		resumeData,
		Object.keys(resumeData)
			.filter(function(section) {
				return section != 'Profile' && section != 'Skills';
			}));

	// Routes to resume skills section
    addSkillsSectionEndpoint(router, resumeData);
	
	return router;
}