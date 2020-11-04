const mongoose = require('mongoose');
const articles = mongoose.model('articles');
const showdown = require('showdown');
const moment = require('moment');

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
    return newArticle.save().then(() => {
        req.flash('info', 'Article created.');
        res.redirect('/admin/articles')
    });
};

exports.read = (req, res, next) => {
    return articles.find().then((all) => {
        if(!all) {
            return res.sendStatus(400);
        }
        else {
            res.render('admin/articles/read', {articles: all, title: 'Articles', moment: moment})
        }
    });
};

exports.edit = async (req, res, next) => {
    try {
        const article = await articles.findOne({ _id: req.params.id });
        res.render('admin/articles/edit', {article, title: 'Edit Article'});
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
            req.flash('info', 'Article updated.');
            res.redirect('/admin/articles');
        }
    });
};

exports.delete = (req, res, next) => {
    return articles.deleteOne({_id: req.params.id}).then((article) => {
        if(!article) {
            return res.sendStatus(400);
        }
        else {
            req.flash('info', 'Article deleted.');
            res.redirect('/admin/articles');
        }
    });
};