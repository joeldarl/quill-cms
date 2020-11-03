const mongoose = require('mongoose');
const pages = mongoose.model('pages');
const navigation = mongoose.model('nav-items');
const showdown = require('showdown');
const moment = require('moment');
var url = require('url');
const config = require('../config/config.json');

exports.read = async (req, res) => {
    var navItems = await navigation.find();

    try {
        const page = await pages.findOne({ url: req.originalUrl });
        if(!page) {
            throw 'Page not found.';
        }
        res.render('pages', {page, title: config.title, navigation: navItems});
    } catch (err) {
        res.sendStatus(404);
        // res.render('error', {title: config.title,  error: err });
    }
};