// Import express and the server configuration file
var express = require('express');
var config = require('./config');
var fs = require('fs')


// Create the express app
var app = express();
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
    
})

// Use the static file server middleware
app.use(express.static(config.public_dir));

// Start listening to requests
var server = app.listen(config.server_port, function() {
	var host = server.address().address;

	console.log("Server running at http://%s:%s", host,	config.server_port);
});