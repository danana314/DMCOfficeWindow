var express = require('express')
  	,cookieParser = require('cookie-parser')
  	,session = require('express-session')
  	,routes = require('./routes/routehandler');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser('secret'));
app.use(session());
app.use(express.static(__dirname + '/public'));

app.get('/', routes.index);

var port = 8080;
app.listen(port, function() {
  console.log('server listening on port ' + port);
});