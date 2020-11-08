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
mongoose.connect(config.databaseUri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true
});
mongoose.set('debug', false);
require('./models/users');
require('./models/articles');
require('./models/pages');
require('./models/post-types');
require('./models/posts');
require('./models/nav-items');
require('./auth/passport');

mongoose.promise = global.Promise;

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

// Admin routes
app.use('/admin', require('./routes/admin/index'));
app.use('/admin/articles', require('./routes/admin/articles'));
app.use('/admin/post-types', require('./routes/admin/post-types'));
app.use('/admin/posts', require('./routes/admin/posts'));
app.use('/admin/uploads', require('./routes/admin/uploads'));
app.use('/admin/pages', require('./routes/admin/pages'));
app.use('/admin/navigation', require('./routes/admin/navigation'));

// Front routes
app.use('/', require('./routes/index'));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env').trim() === 'development' ? err : {};

  // Auth fail redirects to login page
  if(401 == err.status) {
    res.redirect('/admin/login');
    return;
  }

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;