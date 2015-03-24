// Import express and the server configuration file
var express = require('express');
var bodyParser = require('body-parser')
var config = require('./config');
var fs = require('fs')
var mongodb = require('mongodb');
var server = new mongodb.Server('127.0.0.1', 27017, {});
var client = new mongodb.Db('test', server, {w:1});
var resumeData = JSON.parse(fs.readFileSync("data/rest.json", "utf8"));

// Create the express app
var app = express();
var router = express.Router();

// use ejs as view engine
app.set('view engine', 'ejs')

//parses request body and populates request.body
app.use( bodyParser.json() );

// Other routes (middleware)
app.use('/thegoodword', function(req, res) {
	res.write("TO HELL WITH GEORGIA!!!");
	res.end();
})

// REST API
function setupRestApi() {
    var readData = function(cb) {
        cb(null, resumeData);
    }

    var writeData = function(data) {
        //fs.writeFile('data/rest.json', JSON.stringify(data));
    }
    // var readData = function(cb) {
    //     client.collection('myresumes', function(err, collection) {
    //         if (err) throw err;
    //         collection.findOne(function(err,result) {
    //             cb(err, result);
    //         });
    //     });
    // };

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
        });
    });
}

setupRestApi();

app.use('/api', router);

app.use('/resume', function(req, res){
    resumeData.sections = ['Education', 'Skills', 'Experience', 'Projects', 'Leadership', 'Honors'];
    res.render('resume', {
        data: resumeData
    });
    res.end();

    delete resumeData.sections;

    // client.open(function(err) {
    //   if (err) throw err;

    //   client.collection('myresumes', function(err, collection) {
    //     if (err) throw err;
    //     console.log('We are now able to perform queries.');
    //     collection.findOne(function(err,result) {
    //         result.sections = ['Education', 'Skills', 'Experience', 'Projects', 'Leadership', 'Honors'];
    //         res.render('resume', {
    //             data: result
    //         });
    //         res.end();
    //     })

    //   });
    // });
    
    
});

// Use the static file server middleware
app.use(express.static(config.public_dir));

// Start listening to requests
var server = app.listen(config.server_port, function() {
	var host = server.address().address;

	console.log("Server running at http://%s:%s", host,	config.server_port);
});