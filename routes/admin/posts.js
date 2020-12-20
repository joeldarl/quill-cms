const router = require('express').Router();
const auth = require('../../auth/auth');
const posts = require('../../controllers/admin/posts');
const postTypesModel = require('../../models/post-types');

// posts routes
router.get('/', auth.required, posts.read);

router.get('/create/:post_type', auth.required, posts.createView);
router.post('/create', auth.required, posts.create);
router.get('/edit/:id', auth.required, posts.edit);
router.post('/update/:id', auth.required, posts.update);
router.get('/delete/:id', auth.required, posts.delete);

module.exports = router;