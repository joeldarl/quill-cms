const router = require('express').Router();
const auth = require('../../auth/auth');
const users = require('../../controllers/users');
const multer = require('multer');

// SET STORAGE for uploads
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
    }
});

var upload = multer({ storage: storage });

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

// Upload routes
router.get('/upload', auth.required, users.getUploads);
router.post('/upload', auth.required, upload.single('file'), users.upload);

//GET current user route (for testing)
router.get('/current', auth.required, users.current);

module.exports = router;