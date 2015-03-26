// Import express and the server configuration file
var express = require('express');
var bodyParser = require('body-parser');
var restrouter = require('./restrouter');
var config = require('./config');
var fs = require('fs')
var mongodb = require('mongodb');
var server = new mongodb.Server('127.0.0.1', 27017, {});
var client = new mongodb.Db('test', server, {w:1});
var resumeData = JSON.parse(fs.readFileSync("data/rest.json", "utf8"));

// Create the express app
var app = express();

// use ejs as view engine
app.set('view engine', 'ejs')

//parses request body and populates request.body
app.use( bodyParser.json() );

// Other routes (middleware)
app.use('/thegoodword', function(req, res) {
	res.write("TO HELL WITH GEORGIA!!!");
	res.end();
})

app.use('/api', restrouter(resumeData));

app.use('/resume', function(req, res){
    resumeData.sections = ['Education', 'Skills', 'Experience', 'Projects', 'Leadership', 'Honors'];
    res.render('resume', {
        data: resumeData
    });
    res.end();

    delete resumeData.sections;

    // Connecting to Database
    // ----------------------
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