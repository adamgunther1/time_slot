var express  = require('express');
var app      = express();                        // create our app w/ express
var mongoose = require('mongoose');              // mongoose for mongodb
var morgan = require('morgan');                  // log requests to the console (express4)
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
require('dotenv').config();


// mongodb configuration =================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_mzb7zzrt:gg91gpi6sd9rgah2dpa81kmp05@ds119044.mlab.com:19044/heroku_mzb7zzrt')

require('./config/passport')(passport); // pass passport for configuration

// set up express application
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser());                                          // get information from html forms
app.use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true }));  // parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cookieParser());                                        // read cookies (needed for auth)


// // required for passport
app.use(session({ secret: 'passportsletyoutravelaroundmoreoftherockwecallearth' }));  // session secret
app.use(passport.initialize());
app.use(passport.session());                                    // persistent login sessions
app.use(flash());                                               // use connnect-flash for flash messages stored in session


// load the routes
require('./app/routes')(app, passport);                         // load our routes and pass in our app and fully configured passport
// require('./app/routes')(app);                         // load our routes and pass in our app


// listen (start app with node server.js) ======================================
app.listen(process.env.PORT || 8080)
console.log(`App listening on port 8080`);