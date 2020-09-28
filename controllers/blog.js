var express = require('express');
const mongoose = require('mongoose');
const articles = mongoose.model('articles');
const showdown = require('showdown');
const moment = require('moment');

exports.read = (req, res, next) => {
    return articles.find().then((all) => {
        if(!all) {
            return res.sendStatus(400);
        }
        else {
            var converter = new showdown.Converter();
            Object.keys(all).forEach(function(article){
                all[article].body= converter.makeHtml(all[article].body);
            });
            res.render('blog', {title: 'Blog', articles: all, moment: moment})
        }
    });
};

// TODO: Add pagination.