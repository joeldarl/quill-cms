const mongoose = require('mongoose');
const navItems = mongoose.model('nav-items');
const showdown = require('showdown');
const moment = require('moment');

exports.create = (req, res, next) => {
    const navItem = req.body;

    if (!navItem.title) {
        return res.status(422).json({
            errors: {
                title: 'is required',
            },
        });
    }

    if (!navItem.url) {
        return res.status(422).json({
            errors: {
                url: 'is required',
            },
        });
    }

    const newNavItem = new navItems(navItem);

    return newNavItem.save().then(() => {
        req.flash('info', 'Navigation item created.');
        res.redirect('/admin/navigation')
    });
};

exports.read = (req, res, next) => {
    return navItems.find().then((all) => {
        if(!all) {
            return res.sendStatus(400);
        }
        else {
            res.render('admin/navigation/read', {navItems: all, title: 'Navigation', moment: moment})
        }
    });
};

exports.edit = async (req, res, next) => {
    try {
        const navItem = await navItems.findOne({ _id: req.params.id });
        res.render('admin/navigation/edit', {navItem, title: 'Edit Page'});
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