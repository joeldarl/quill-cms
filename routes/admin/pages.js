const router = require('express').Router();
const auth = require('../../auth/auth');
const pages = require('../../controllers/admin/pages');

// Pages routes
router.get('/', auth.required, pages.read);

router.get('/create', auth.required, function (req, res) {
  res.render('admin/pages/create', {title: 'Create Article'});
});
router.post('/create', auth.required, pages.create);
router.get('/edit/:id', auth.required, pages.edit);
router.post('/update/:id', auth.required, pages.update);
router.get('/delete/:id', auth.required, pages.delete);

module.exports = router;