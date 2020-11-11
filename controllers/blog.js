const mongoose = require('mongoose');
const articles = mongoose.model('articles');
const navigation = mongoose.model('nav-items');
const showdown = require('showdown');
const moment = require('moment');
const config = require('../config/config.json');

exports.read = async (req, res) => {
    const {page=1, limit=10} = req.query;
    
    var navItems = await navigation.find().sort('order');

    try {
        var articleBatch = await articles.find()
            .limit(limit)
            .skip((page-1) * limit)
            .exec();
        var pageCount = await articles.countDocuments() / limit;
        var converter = new showdown.Converter();
        Object.keys(articleBatch).forEach(function(article){
            articleBatch[article].body= converter.makeHtml(articleBatch[article].body);
        });
        res.render('blog', {
            title: config.title, 
            articles: articleBatch, 
            pageCount: Math.ceil(pageCount), 
            navigation: navItems,
            moment: moment
        })
    }
    catch (err) {
        console.error(err.message);
        return res.sendStatus(400);
    }
};