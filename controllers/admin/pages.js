const mongoose = require('mongoose');
const pages = mongoose.model('pages');
const moment = require('moment');

exports.create = async (req, res, next) => {
    const page = req.body;
    const error = [];

    if (!page.title) {
        res.status(422);
        error.push('Title is required');
    }

    if (!page.url) {
        res.status(422);
        error.push('Url is required');
    }

    if (!page.body) {
        res.status(422);
        error.push('Body text is required');
    }

    if(error.length) {
        req.flash('info', error.join(", "))
        return res.redirect('/admin/pages');
    }

    const newPage = new pages(page);

    return newPage.save((err, page) => {
        if(err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                req.flash('info', 'Url already exists!');
            } else {
                req.flash('info', 'Something has gone wrong, cannot save page!');
            }
            return res.redirect('/admin/pages');
        }
        req.flash('info', 'Page created');
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
            req.flash('info', 'Page updated');
            res.redirect('/admin/pages');
        }
    });
};

exports.delete = (req, res, next) => {
    return pages.deleteOne({_id: req.params.id}).then((page) => {
        if(!page) {
            return res.sendStatus(400);
        }
        else {
            req.flash('info', 'Page deleted');
            res.redirect('/admin/pages');
        }
    });
};