const router = require('express').Router();
var auth = require('../auth/auth');
var blog = require('../controllers/blog');
var pages = require('../controllers/pages');

router.get('/', auth.optional, blog.read);

router.get('/*', auth.optional, pages.read);

module.exports = router;