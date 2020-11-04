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
        res.send({error: "Navigation item doesn't exist!"});
    }
};

exports.update = (req, res, next) => {
    return navItems.findOne({ _id: req.params.id }).then((navItem) => {
        const navItemUpdated = req.body;

        if(!navItem) {
            return res.sendStatus(400);
        }
        else {
            navItem.title = navItemUpdated.title;
            navItem.url = navItemUpdated.url;
            navItem.body = navItemUpdated.body;
            navItem.save();
            req.flash('info', 'Navigation item updated.');
            res.redirect('/admin/navigation');
        }
    });
};

exports.delete = (req, res, next) => {
    return navItems.deleteOne({_id: req.params.id}).then((navItem) => {
        if(!navItem) {
            return res.sendStatus(400);
        }
        else {
            req.flash('info', 'Navigation item deleted.');
            res.redirect('/admin/navigation');
        }
    });
};