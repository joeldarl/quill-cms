const router = require('express').Router();
const auth = require('../auth/auth');
const blog = require('../controllers/blog');
const pages = require('../controllers/pages');

router.get('/', auth.optional, blog.read);
router.get('/*', auth.optional, pages.read);

module.exports = router;