let express = require('express'); 
let app = express(); 
let mongoose = require('mongoose');
//var expressMongoDb = require('express-mongo-db');
var config = require('./config')
var users = require('./server')
var mail = require('./mail')
var course = require('./course.service')
var smsverify = require('./sms.auth')

var jwt = require('./jwt')
var methodOverride = require('method-override')

///app.use(expressMongoDb(config.database.url));
// let mongoose = require('mongoose');
 mongoose.Promise = global.Promise;
 mongoose.connect(config.database.url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
let conn = mongoose.connection;

// Allows cross-origin domains to access this API
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , '*');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Authorization, Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
        next();
  });

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
// var flash = require('express-flash')
// var cookieParser = require('cookie-parser');
// var session = require('express-session');

// app.use(cookieParser('keyboard cat'))
// app.use(session({ 
// 	secret: 'keyboard cat',
// 	resave: false,
// 	saveUninitialized: true,
// 	cookie: { maxAge: 60000 }
// }))
// app.use(flash())

// BodyParser middleware
let bodyParser = require('body-parser');
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Setting up the root route
app.get('/', (req, res) => {
res.send('Welcome to the express server');
});

app.use('/Webserver',users)
app.use('/Webserver',mail)
app.use('/Webserver',jwt)
app.use('/Webserver',course)
app.use('/Webserver',smsverify)
  
var server=app.listen(5050,function() {
console.log('Server started!')
});