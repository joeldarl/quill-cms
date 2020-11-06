const mongoose = require('mongoose');
const navItems = mongoose.model('nav-items');
const showdown = require('showdown');
const moment = require('moment');

exports.create = async (req, res) => {
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

    var count = await navItems.count();
    navItem.order = count + 1;

    return newNavItem.save().then(() => {
        req.flash('info', 'Navigation item created.');
        res.redirect('/admin/navigation')
    });
};

exports.read = (req, res) => {
    return navItems.find().sort('order').then((all) => {
        if(!all) {
            return res.sendStatus(400);
        }
        else {
            res.render('admin/navigation/read', {navItems: all, title: 'Navigation', moment: moment})
        }
    });
};

exports.edit = async (req, res) => {
    try {
        const navItem = await navItems.findOne({ _id: req.params.id });
        res.render('admin/navigation/edit', {navItem, title: 'Edit Page'});
    } catch {
        res.status(404);
        res.send({error: "Navigation item doesn't exist!"});
    }
};

exports.update = (req, res) => {
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
            req.flash('info', 'Navigation item updated');
            res.redirect('/admin/navigation');
        }
    });
};

exports.orderUpdate = async (req, res) => {
    for(i = 0; i < req.body.ids.length; i++) {
        try {
            let navItem = await navItems.findOne({_id: req.body.ids[i]});
            navItem.order = i + 1;
            navItem.save();
        }
        catch (err) {
            return res.send({err: 'Could not save'});
        }
    }
    return res.send({info: 'Saved new order'});
}

exports.delete = (req, res) => {
    return navItems.deleteOne({_id: req.params.id}).then((navItem) => {
        if(!navItem) {
            return res.sendStatus(400);
        }
        else {
            req.flash('info', 'Navigation item deleted');
            res.redirect('/admin/navigation');
        }
    });
};