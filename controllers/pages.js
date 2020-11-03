const mongoose = require('mongoose');
const pages = mongoose.model('pages');
const navigation = mongoose.model('nav-items');
const showdown = require('showdown');
const moment = require('moment');
var url = require('url');
const config = require('../config/config.json');

exports.read = async (req, res, next) => {
    var navItems = await navigation.find();

    try {
        const page = await pages.findOne({ url: req.originalUrl });
        res.render('pages', {page, title: config.title, navigation: navItems});
    } catch {
        res.status(404);
        res.send({error: "Page doesn't exist!"});
    }
};