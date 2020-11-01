const router = require('express').Router();
const auth = require('../../auth/auth');
const articles = require('../../controllers/admin/articles');

// Articles routes
router.get('/', auth.required, articles.read);

router.get('/create', auth.required, function (req, res, next) {
  res.render('admin/createArticle', {title: 'Create Article'});
});
router.post('/create', auth.required, articles.create);
router.get('/edit/:id', auth.required, articles.edit);
router.post('/update/:id', auth.required, articles.update);
router.get('/delete/:id', auth.required, articles.delete);

module.exports = router;