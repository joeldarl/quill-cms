const router = require('express').Router();
const auth = require('../../auth/auth');
const postTypes = require('../../controllers/admin/post-types');

// post-types routes
router.get('/', auth.required, postTypes.read);

router.get('/create', auth.required, postTypes.createView);
router.post('/create', auth.required, postTypes.create);
router.get('/edit/:id', auth.required, postTypes.edit);
router.post('/update/:id', auth.required, postTypes.update);
router.get('/delete/:id', auth.required, postTypes.delete);

module.exports = router;