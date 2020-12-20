import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';
import { Container } from 'inversify';
import TYPES from './constant/types';
import path from 'path';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
var cookieParser = require('cookie-parser');
var sassMiddleware = require('node-sass-middleware');

// .env
require('dotenv').config();

// Services
import UserService from './services/user';
import PageService from './services/page';
import NavItemService from './services/nav-item';
import PostService from './services/post';
import PostTypeService from './services/post-type';

// Repositories
import UserRepository from './models/user';
import PageRepository from './models/page';
import NavItemRepository from './models/nav-item';
import PostRepository from './models/post';
import PostTypeRepository from './models/post-type'

// Controllers
import './controllers/admin';
import './controllers/user';
import './controllers/page';
import './controllers/nav-item';
import './controllers/post';
import './controllers/post-type';

// Setting up the container
let container = new Container();
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<PageService>(TYPES.PageService).to(PageService);
container.bind<NavItemService>(TYPES.NavItemService).to(NavItemService);
container.bind<PostService>(TYPES.PostService).to(PostService);
container.bind<PostTypeService>(TYPES.PostTypeService).to(PostTypeService);

container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<PageRepository>(TYPES.PageRepository).to(PageRepository);
container.bind<NavItemRepository>(TYPES.NavItemRepository).to(NavItemRepository);
container.bind<PostRepository>(TYPES.PostRepository).to(PostRepository);
container.bind<PostTypeRepository>(TYPES.PostTypeRepository).to(PostTypeRepository);

// Mongoose setup
if(!process.env.DB_HOST){
  throw new Error('No database host specified.');
}

if(!process.env.JWT_SECRET){
  throw new Error('No secret specified.')
}

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true
});
mongoose.set('debug', false);
mongoose.Promise = global.Promise;

// Start the server
let server = new InversifyExpressServer(container);

server.setConfig((app) => {
  // View engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  
  app.use(bodyParser.urlencoded({
    extended: false
  }));

  app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
  }));

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cookieParser());

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Error handler
  app.use(function(err:any, req:any, res:any, next:any) {
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
});

let serverInstance = server.build();
serverInstance.listen(3000);

console.log('Server started on port 3000');