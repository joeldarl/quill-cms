var express = require('express');
const mongoose = require('mongoose');
const articles = mongoose.model('articles');
const navigation = mongoose.model('nav-items');
const showdown = require('showdown');
const moment = require('moment');
const config = require('../config/config.json');

exports.read = async (req, res, next) => {
    var navItems = await navigation.find();

    return articles.find().then((all) => {
        if(!all) {
            return res.sendStatus(400);
        }
        else {
            var converter = new showdown.Converter();
            Object.keys(all).forEach(function(article){
                all[article].body= converter.makeHtml(all[article].body);
            });
            res.render('blog', {title: config.title, articles: all, navigation: navItems, moment: moment})
        }
    });
};

// TODO: Add pagination.