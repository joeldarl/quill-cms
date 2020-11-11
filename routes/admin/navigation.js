const router = require('express').Router();
const auth = require('../../auth/auth');
const navigation = require('../../controllers/admin/navigation');

// Pages routes
router.get('/', auth.required, navigation.read);

router.get('/create', auth.required, function (req, res) {
  res.render('admin/navigation/create', {title: 'Create a Navigation Item'});
});
router.post('/create', auth.required, navigation.create);
router.get('/edit/:id', auth.required, navigation.edit);
router.post('/update/:id', auth.required, navigation.update);
router.post('/orderUpdate', auth.required, navigation.orderUpdate)
router.get('/delete/:id', auth.required, navigation.delete);

module.exports = router;