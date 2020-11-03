const fse = require('fs-extra');
const path = require('path');
const glob = require('glob');

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

exports.getUploads = async (req, res, next) => {
    // var files = fse.readdirSync('public/uploads/');

    var files = fromDir('public/uploads');

    files = files.filter(function (file){
        return ['.png', '.jpg', '.gif', '.jpeg'].includes(path.extname(file).toLowerCase());
    });

    for(var i = 0; i < files.length; i++){
        files[i] = files[i].replace("public", "");
    }
    res.render('admin/uploads', {files: files, title: 'Uploads'});
};

function fromDir(startPath){
    if (!fse.existsSync(startPath)){
        return;
    }

    var files = fse.readdirSync(startPath);
    var found = [];

    for(var i = 0; i < files.length; i++){
        var filename = path.join(startPath,files[i]);
        var stat = fse.lstatSync(filename);
        if (stat.isDirectory()){
            found = found.concat(fromDir(filename));
        }
        else {
            found.push(filename);
        };
    };

    return found;
};
