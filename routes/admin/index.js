const router = require('express').Router();
const auth = require('../../auth/auth');
const users = require('../../controllers/users');
const multer = require('multer');

router.get('/', auth.required, function (req, res, next){
    res.render('admin/index', {title: 'Dashboard'});
});

// Login routes
router.get('/login', auth.optional, function (req, res, next){
    res.render('admin/login');
});
router.post('/login', auth.optional, users.login);
router.get('/logout', auth.optional, users.logout);

// Register user routes
router.get('/register', auth.required, function (req, res, next){
    res.render('admin/register');
});
router.post('/create', auth.required, users.create);

//GET current user route (for testing)
router.get('/current', auth.required, users.current);

module.exports = router;