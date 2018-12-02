var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require("cookie-session");
var logger = require('morgan');
var session = require('cookie-session');
var bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var abcRouter = require('./routes/abc');
var loginRouter = require('./routes/login');
var menuRouter = require('./routes/menu');
var registerRouter = require('./routes/register');
var mainRouter = require('./routes/main');
var authmenuRouter = require('./routes/authmenu');
var createRouter = require('./routes/create');
var selfRouter = require('./routes/self');
var editRouter = require('./routes/edit');
var rateRouter = require('./routes/rate');



var app = express();
var SECRETKEY1 = "I want to pass COMPS381F";
var SECRETKEY2 = "Keep this to yourself";
var users = new Array(
	{name: 'developer', password: 'developer'},
	{name: 'guest', password: 'guest'}
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(
  cookieSession({
    name: "session",
    authenticated: false,
    keys:[SECRETKEY1, SECRETKEY2] }
));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/abc', abcRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/menu', menuRouter);
app.use('/main', mainRouter);
app.use('/authmenu', authmenuRouter);
app.use('/create',createRouter);
app.use('/self',selfRouter);
app.use('/edit',editRouter);
app.use('/rate',rateRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
