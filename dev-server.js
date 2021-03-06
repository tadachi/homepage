var express         = require('express');
// var bodyParser      = require('body-parser'); // Deprecated in Express 4.x.x
//var methodOverride  = require('method-override');
var router          = express.Router();
var vhost           = require('vhost');
var app             = require('express.io')();


app.http().io();
var port = parseInt(process.env.PORT, 10) || 4000;
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded());

// parse application/json
// app.use(bodyParser.json()); Deprecated in Express 4.x.x

// app.use(methodOverride());
app.listen(port, '127.0.0.1');
//app.enable('trust proxy');

var home = require('express.io')();

home.use('/js', express.static(__dirname + '/view/js'));
home.use('/css', express.static(__dirname + '/view/css'));
home.use('/img', express.static(__dirname + '/view/img'));
home.use('/fonts', express.static(__dirname + '/view/fonts'))
home.use('/pdf', express.static(__dirname + '/view/pdf'));
home.use('/res', express.static(__dirname + '/view/res'));
home.use('/webm', express.static(__dirname + '/view/webm'));

home.set('jsonp callback', true);
/* Testing headers */
// home.use(function (req, res, next) {
    // Website you wish to allow to connect
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");

    // Request methods you wish to allow
    //res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Pass to next layer of middleware
//     next();
// });

var hostname = 'localhost';
app.use(vhost(hostname, home));

home.get('/', function(req, res) {
    res.sendfile(__dirname + '/view/index.html');

    req.io.route('home');

})

/* Outputs the users' ips visiting your website*/
app.io.route('home', function (req) {
    console.log(req.ip);
});

/* Debug */
console.log(__dirname);
console.log(__dirname + '/app/');
console.log('Listening on port: ' + port);
console.log('hostname: ' + hostname + ':' + port);
