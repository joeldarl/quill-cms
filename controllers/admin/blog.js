var express = require('express');
const mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
const articles = mongoose.model('articles');
const showdown = require('showdown');
const moment = require('moment');
const config = require('../../config/config.json');

exports.create = (req, res, next) => {
    const article = req.body;

    if (!article.title) {
        return res.status(422).json({
            errors: {
                title: 'is required',
            },
        });
    }

    if (!article.body) {
        return res.status(422).json({
            errors: {
                text: 'is required',
            },
        });
    }

    const newArticle = new articles(article);
    return newArticle.save().then(() => res.json(article));
};

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
            res.render('admin/blog', {articles: all, title: config.title, moment: moment})
        }
    });
};

exports.edit = async (req, res, next) => {
    try {
        const article = await articles.findOne({ _id: req.params.id });
        res.render('admin/edit', {article, title: 'Edit Article'});
    } catch {
        res.status(404);
        res.send({ error: "Post doesn't exist!" });
    }
};

exports.update = (req, res, next) => {
    return articles.findOne({ _id: req.params.id }).then((article) => {
        const articleUpdated = req.body;

        if(!article) {
            return res.sendStatus(400);
        }
        else {
            article.title = articleUpdated.title;
            article.body = articleUpdated.body;
            article.save();
            res.redirect('/admin/blog');
        }
    });
};

exports.delete = (req, res, next) => {
    return articles.deleteOne(req.body.id).then((article) => {
        if(!article) {
            return res.sendStatus(400);
        }
        else {
            res.redirect('/admin/blog');
        }
    });
};