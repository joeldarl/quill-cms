const mongoose = require('mongoose');
const pages = mongoose.model('pages');
const navigation = mongoose.model('nav-items');
const showdown = require('showdown');
const config = require('../config/config.json');

exports.read = async (req, res) => {
    var navItems = await navigation.find().sort('order');

    try {
        const page = await pages.findOne({ url: req.originalUrl });
        if(!page) {
            throw 'Page not found.';
        }

        var converter = new showdown.Converter();
        page.body= converter.makeHtml(page.body);
        
        res.render('pages', {page, title: config.title, navigation: navItems});
    } catch (err) {
        res.sendStatus(404);
    }
};