const router = require('express').Router();
const auth = require('../../auth/auth');
const users = require('../../controllers/admin/users');
const multer = require('multer');

router.get('/', auth.required, function (req, res, next){
    res.render('admin/index', {title: 'Dashboard'});
});

// Login routes
router.get('/login', auth.optional, function (req, res, next){
    res.render('admin/login');
});
router.post('/login', auth.optional, users.login);
router.get('/logout', auth.required, users.logout);

//GET current user route (for testing)
router.get('/current', auth.required, users.current);

// Register user routes
router.get('/register', auth.required, function (req, res, next){
    res.render('admin/register');
});

// User management routes
router.post('/users/create', auth.required, users.create);
router.get('/users', auth.required, users.read);
router.get('/users/delete/:id', auth.required, users.delete);

module.exports = router;