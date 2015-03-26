var express = require('express');
var fs = require('fs')

module.exports = function(resumeData) {
	var router = express.Router();
	var id_counters = {};    // Used to generate object ids

	var writeData = function(data) {
	    fs.writeFile('data/rest.json', JSON.stringify(resumeData, null, 4));
	}

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

	// Routes to resume sections
    Object.keys(resumeData).forEach(function(section) {

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
            writeData();

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
        			writeData();
        		}
        	});

        	res.end();
        });

        // Delete subsection
        router.delete('/' + section + '/:id', function(req, res) {

            resumeData[section] = resumeData[section].filter(function (subsection) {
                return subsection._id != req.params.id;
            });
            writeData();

            res.end();
        })
    });
	
	return router;
}