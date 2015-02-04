var express = require('express');
var app = express();

app.use('/thegoodword', function (request, response) {
	response.write("TO HELL WITH GEORGIA!!!");
	response.end();
});

app.use(express.static('public'));

app.listen(3000, function () {
	console.log("Site is served on port 3000");
});