var express 	= require('express');
var bodyParser 	= require('body-parser');
var methodOverride = require('method-override');
var app 		= express()
var port		= parseInt(process.env.PORT, 10) || 4001;
var fs 			= require('fs');
var path		= require('path');

/*
app.get("/", function(req, res) {
  res.redirect("/index.html");
});
*/

/*
var env = process.env.NODE_ENV || 'dev';
if ('dev' == env {

}
*/

app.listen(port);

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/view'));
app.use(bodyParser());
app.use(methodOverride());
console.log(__dirname);
console.log(__dirname + '/view');


