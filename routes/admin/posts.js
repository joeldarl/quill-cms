const router = require('express').Router();
const auth = require('../../auth/auth');
const posts = require('../../controllers/admin/posts');

// posts routes
router.get('/', auth.required, posts.read);

router.get('/create', auth.required, function (req, res) {
  res.render('admin/posts/create', {title: 'Create Article'});
});
router.post('/create', auth.required, posts.create);
router.get('/edit/:id', auth.required, posts.edit);
router.post('/update/:id', auth.required, posts.update);
router.get('/delete/:id', auth.required, posts.delete);

module.exports = router;