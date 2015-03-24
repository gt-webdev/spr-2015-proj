var express = require('express');

module.exports = function(resumeData) {
	var router = express.Router();

	var readData = function(cb) {
	    cb(null, resumeData);
	}

	var writeData = function(data) {
	    //fs.writeFile('data/rest.json', JSON.stringify(data));
	}

	// Route to full resume
	router.get('/', function(req, res) {
	    readData(function(err, data) {
	        if (err) {
	            res.end();
	            return console.log(err);
	        }
	        res.send(data);
	        res.end();
	    });
	});

	// Routes to resume sections
	readData(function(err, data) {
	    Object.keys(data).forEach(function(section) {
	        console.log(section);
	        router.get('/' + section, function(req, res) {
	            readData(function(err, data) {
	                if (err) {
	                    res.end();
	                    return console.log(err);
	                }

	                res.send(data[section]);
	                res.end();
	            });
	        });

	        router.post('/' + section, function(req, res) {
	            if (!req.body) return req.sendStatus(400);

	            var newObject = req.body;
	            newObject._id = resumeData[section].length;
	            resumeData[section].push(newObject);
	            writeData();

	            res.end();
	        });

	        router.post('/' + section + '/:id', function(req, res) {
	            if (!req.params.id) return req.sendStatus(400);
	            
	            var updatedItem = resumeData[section][req.params.id];
	            for(key in req.query) {
	            	var val = req.query[key];
	            	updatedItem[key] = val;
	            }
	            resumeData[section][req.params.id] = updatedItem;
	            writeData(resumeData);

	            res.end();
	        });

	        router.delete('/' + section + '/:id', function(req, res) {
	            if (!req.params.id) return req.sendStatus(400);

	            resumeData[section] = resumeData[section].filter(function (subsection) {
	                return subsection._id != req.params.id;
	            });
	            writeData();

	            res.end();
	        })
	    });
	});
	
	return router;
}