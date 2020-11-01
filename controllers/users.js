const mongoose = require('mongoose');
const passport = require('passport');
const users = mongoose.model('users');
const path = require('path');
var fs = require('fs');

exports.login = (req, res, next) => {
    const user = req.body;

    if(!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if(!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    passport.authenticate('login', {session: false, failureFlash: true}, function(err, user, info) {
        if (err) { return next(err); }

        // If no user is returned, authetication has failed
        if (!user) {
            console.log(info.message);
            req.flash('info', info.message);
            return res.redirect('/admin/login');
        }

        // Success
        user.token = user.generateJWT();

        // The cookie expires after 8 hours
        res.cookie('auth', user.token, {expires: new Date(Date.now() + 8 * 3600000)});
        req.flash('info', info.message);
        res.redirect('/admin');
    })(req, res, next);
};

exports.logout = (req, res, next) => {
    res.clearCookie('auth');
    res.redirect('/admin/login');
};

// Creating a new user
exports.create = (req, res, next) => {
    const user = req.body;

    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    const finalUser = new users(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
        .then(() => res.json({user: finalUser.toAuthJSON()}));
};

exports.current = (req, res, next) => {
    const { payload: { id } } = req;

    return users.findById(id)
        .then((user) => {
            if(!user) {
                return res.sendStatus(400);
            }

            return res.json({ user: user.toAuthJSON() });
        });
};

exports.upload = (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file);
};

exports.getUploads = (req, res, next) => {
    var files = fs.readdirSync('public/uploads');
    console.log(files);
    res.render('admin/upload', {files: files, title: 'Uploads'});
};