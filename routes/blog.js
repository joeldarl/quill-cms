var express = require('express');
var router = express.Router();
var auth = require('../auth/auth');
var blog = require('../controllers/blog');

router.get('/', auth.optional, blog.read);

module.exports = router;