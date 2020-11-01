const router = require('express').Router();
const auth = require('../../auth/auth');
const users = require('../../controllers/users');
const multer = require('multer');

// SET STORAGE
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

router.get('/login', auth.optional, function (req, res, next){
    res.render('admin/login');
});
router.get('/register', auth.optional, function (req, res, next){
    res.render('admin/register');
});
router.post('/login', auth.optional, users.login);
router.get('/upload', auth.required, users.getUploads);
router.post('/upload', auth.required, upload.single('file'), users.upload);
router.post('/create', auth.required, users.create);
//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, users.current);

module.exports = router;