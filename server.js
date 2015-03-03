// Import express and the server configuration file
var express = require('express');
var config = require('./config');
var fs = require('fs')
var mongodb = require('mongodb');
var server = new mongodb.Server('127.0.0.1', 27017, {});
var client = new mongodb.Db('temp', server, {w:1});




// Create the express app
var app = express();

// use ejs as view engine
app.set('view engine', 'ejs')

// Other routes (middleware)
app.use('/thegoodword', function(req, res) {
	res.write("TO HELL WITH GEORGIA!!!");
	res.end();
})

app.use('/resume', function(req, res){
    var myData;
    fs.readFile('data/resume.json', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        myData = JSON.parse(data);
        res.render('resume', myData);
        res.end();
    });
    // client.open(function(err) {
    //   if (err) throw err;
    //   client.collection('json', function(err, collection) {
    //     if (err) throw err;
    //     console.log('We are now able to perform queries.');
    //     collection.findOne(function(err,result) {
    //         // console.log(result);
    //         res.render('resume', result);
    //         res.end();
    //     })

    //   });
    // });
    
    
})

// Use the static file server middleware
app.use(express.static(config.public_dir));

// Start listening to requests
var server = app.listen(config.server_port, function() {
	var host = server.address().address;

	console.log("Server running at http://%s:%s", host,	config.server_port);
});