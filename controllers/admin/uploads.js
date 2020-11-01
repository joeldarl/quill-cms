var fs = require('fs');
const path = require('path');
// const { path } = require('../../app');

exports.upload = (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    req.flash('info', 'Image uploaded successfully.');
    return res.redirect('/admin/uploads');
};

exports.getUploads = (req, res, next) => {
    var files = fs.readdirSync('public/uploads');
    files = files.filter(function (file){
        return ['.png', '.jpg', '.gif', '.jpeg'].includes(path.extname(file).toLowerCase());
    });

    res.render('admin/uploads', {files: files, title: 'Uploads'});
};