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
const config = require('./config/config.json');

// Mongoose setup
mongoose.connect(config.databaseUri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('debug', false);
require('./models/users');
require('./models/articles');
require('./auth/passport');

mongoose.promise = global.Promise;

// Front of site routes
var blogRouter = require('./routes/blog');
var aboutRouter = require('./routes/about');

// Admin routes
var apiIndexRouter = require('./routes/admin/index');
var apiBlogRouter = require('./routes/admin/articles');
var apiUploadsRouter = require('./routes/admin/uploads');

var app = express();

// View engine setup
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
app.use('/admin/uploads', apiUploadsRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
