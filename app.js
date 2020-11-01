var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var crypto = require('crypto');
var flash = require('express-flash');
var sassMiddleware = require('node-sass-middleware');
var mongoose = require('mongoose');
const multer = require('multer');
const arg = require('arg');
const config = require('./config/config.json');

// mongoose setup
mongoose.connect(config.databaseUri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('debug', false);
require('./models/users');
require('./models/articles');
require('./auth/passport');

mongoose.promise = global.Promise;

// arguements
const args = arg({
    // types
    '--help':     Boolean,
    '--version':  Boolean,
    '--register': Boolean,
 
    // aliases
    '-r':         '--register',   
});

if(args['--register'] == true) {
  require('./register-cli.js').registerPrompt();
}

var blogRouter = require('./routes/blog');
var apiBlogRouter = require('./routes/admin/articles');
var apiIndexRouter = require('./routes/admin/index');
var aboutRouter = require('./routes/about');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ 
  secret: crypto.randomBytes(48).toString('hex'), 
  cookie: { maxAge: 60000 }, 
  resave: false, 
  saveUninitialized: false 
}));
app.use(cookieParser());
app.use(flash());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', blogRouter);
app.use('/admin', apiIndexRouter);
app.use('/admin/articles', apiBlogRouter);
app.use('/about', aboutRouter);

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
