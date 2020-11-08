const mongoose = require('mongoose');
const postTypes = mongoose.model('post-types');
const moment = require('moment');

const fieldTypes = [
    {
        "name":"text",
        "template":"text"
    },
    {
        "name":"textarea",
        "template":"text"
    }
]

exports.createView = async (req, res) => {
    res.render('admin/post-types/create', {title: 'Create Article', fieldTypes : fieldTypes});
}

exports.create = async (req, res) => {
    const postType = req.body;

    if (!postType.title) {
        return res.status(422).json({
            errors: {
                title: 'is required',
            },
        });
    }

    if (!postType.url) {
        return res.status(422).json({
            errors: {
                url: 'is required',
            },
        });
    }

    const newPostType = new postTypes(postType);

    return newPostType.save().then(() => {
        req.flash('info', 'Post type created.');
        res.redirect('/admin/post-types')
    });
};

exports.read = (req, res) => {
    return postTypes.find().then((all) => {
        if(!all) {
            return res.sendStatus(400);
        }
        else {
            res.render('admin/post-types/read', {postTypes: all, title: 'Post Types', moment: moment})
        }
    });
};

exports.edit = async (req, res) => {
    try {
        const postType = await postTypes.findOne({ _id: req.params.id });
        res.render('admin/post-types/edit', {postType, title: 'Edit Page'});
    } catch {
        res.status(404);
        res.send({error: "post-types item doesn't exist!"});
    }
};

exports.update = (req, res) => {
    return postTypes.findOne({ _id: req.params.id }).then((postType) => {
        const postTypeUpdated = req.body;

        if(!postType) {
            return res.sendStatus(400);
        }
        else {
            postType.title = postTypeUpdated.title;
            postType.fields = postTypeUpdated.fields;
            postType.url = postTypeUpdated.url;
            postType.save();
            req.flash('info', 'Post type updated');
            res.redirect('/admin/post-types');
        }
    });
};

exports.delete = (req, res) => {
    return postTypes.deleteOne({_id: req.params.id}).then((postType) => {
        if(!postType) {
            return res.sendStatus(400);
        }
        else {
            req.flash('info', 'Post type deleted');
            res.redirect('/admin/post-types');
        }
    });
};