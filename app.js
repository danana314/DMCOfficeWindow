var express = require('express')
  	,cookieParser = require('cookie-parser')
  	,bodyParser = require('body-parser')
  	,session = require('express-session')
  	,routes = require('./routes/routehandler');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({ secret: 'dmc'}));
app.use(express.static(__dirname + '/public'));

app.get('/', routes.login);
app.post('/checkin', routes.checkIn);
app.get('/main', routes.main)

var port = 8080;
app.listen(port, function() {
  console.log('server listening on port ' + port);
});