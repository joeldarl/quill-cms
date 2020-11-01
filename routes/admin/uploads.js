const router = require('express').Router();
const auth = require('../../auth/auth');
const uploads = require('../../controllers/admin/uploads');
const multer = require('multer');
const path = require('path');

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

// Multer upload settings
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed.'))
        }
        callback(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
    }
})

// Upload routes
router.get('/', auth.required, uploads.getUploads);
router.post('/', auth.required, upload.single('file'), uploads.upload);

module.exports = router;