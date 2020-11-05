const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const users = mongoose.model('users');
const path = require('path');
const fs = require('fs');
const secret = require('../../config/secret.json');

exports.login = (req, res, next) => {
    const user = req.body;

    if(!user.email) {
        req.flash('info', 'Email is required');
        return res.redirect('/admin/login');
    }

    if(!user.password) {
        req.flash('info', 'Password is required');
        return res.redirect('/admin/login');
    }

    passport.authenticate('login', {session: false, failureFlash: true}, function(err, user, info) {
        if (err) { return next(err); }

        // If no user is returned, authentication has failed
        if (!user) {
            req.flash('info', info.message);
            return res.redirect('/admin/login');
        }

        // Success
        user.token = user.generateJWT();

        // The cookie expires after 8 hours
        res.cookie('auth', user.token, {expires: new Date(Date.now() + 8 * 3600000)});
        req.flash('info', info.message);
        return res.redirect('/admin');
    })(req, res, next);
};

exports.logout = (req, res, next) => {
    res.clearCookie('auth');
    return res.redirect('/admin/login');
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
        .then(() => {
            req.flash('info', 'User created');
            res.redirect('/admin/users');
        });
};

exports.read = (req, res) => {
    return users.find().then((all) => {
        if(!all) {
            return res.sendStatus(400);
        }
        else {
            return res.render('admin/users/read', {users: all, title: 'Users'})
        }
    });
};

exports.delete = (req, res) => {
    if(!req.cookies.auth)
    {
        return res.sendStatus(400);
    }

    let user = jwt.decode(req.cookies.auth, secret.secret);

    if (user.id == req.params.id) {
        req.flash('info', 'You cannot delete the user you are logged in as');
        return res.redirect('/admin/users');
    }

    return users.deleteOne({_id: req.params.id}).then((user) => {
        if(!user) {
            return res.sendStatus(400);
        }
        else {
            req.flash('info', 'User deleted');
            return res.redirect('/admin/users');
        }
    });
}

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