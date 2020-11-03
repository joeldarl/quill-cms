const mongoose = require('mongoose');
const pages = mongoose.model('pages');
const showdown = require('showdown');
const moment = require('moment');

exports.create = (req, res, next) => {
    const page = req.body;

    if (!page.title) {
        return res.status(422).json({
            errors: {
                title: 'is required',
            },
        });
    }

    if (!page.body) {
        return res.status(422).json({
            errors: {
                text: 'is required',
            },
        });
    }

    const newPage = new pages(page);

    return newPage.save().then(() => {
        req.flash('info', 'Page created.');
        res.redirect('/admin/pages')
    });
};

exports.read = (req, res, next) => {
    return pages.find().then((all) => {
        if(!all) {
            return res.sendStatus(400);
        }
        else {
            res.render('admin/pages/read', {pages: all, title: 'Pages', moment: moment})
        }
    });
};

exports.edit = async (req, res, next) => {
    try {
        const page = await pages.findOne({ _id: req.params.id });
        res.render('admin/pages/edit', {page, title: 'Edit Page'});
    } catch {
        res.status(404);
        res.send({error: "Page doesn't exist!"});
    }
};

exports.update = (req, res, next) => {
    return pages.findOne({ _id: req.params.id }).then((page) => {
        const pageUpdated = req.body;

        if(!page) {
            return res.sendStatus(400);
        }
        else {
            page.title = pageUpdated.title;
            page.url = pageUpdated.url;
            page.body = pageUpdated.body;
            page.save();
            req.flash('info', 'Page updated.');
            res.redirect('/admin/pages');
        }
    });
};

exports.delete = (req, res, next) => {
    return pages.deleteOne(req.body.id).then((page) => {
        if(!page) {
            return res.sendStatus(400);
        }
        else {
            req.flash('info', 'Page deleted.');
            res.redirect('/admin/pages');
        }
    });
};