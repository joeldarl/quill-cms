const router = require('express').Router();
const auth = require('../../config/auth');
const blog = require('../../controllers/admin/blog');

router.get('/create', auth.required, function (req, res, next) {
  res.render('admin/createArticle', {title: 'Create Article'});
});
router.get('/edit/:id', auth.required, blog.edit);
router.post('/create', auth.required, blog.create);
router.post('/update/:id', auth.required, blog.update);
router.get('/', auth.required, blog.read);
router.get('/delete/:id', auth.required, blog.delete);

module.exports = router;