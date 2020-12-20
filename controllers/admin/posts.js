const mongoose = require('mongoose');
const posts = mongoose.model('posts');
const postTypes = mongoose.model('post-types');
const moment = require('moment');

exports.createView = (req, res) => {
    const fields = postTypes.find({post_type:req.params.post_type});
    res.render('admin/posts/create', {postType: req.params.post_type, fields: fields, title: 'Create Post'})
};

exports.create = (req, res) => {
    const post = req.body;

    if (!post.title) {
        return res.status(422).json({
            errors: {
                title: 'is required',
            },
        });
    }

    const newPost = new posts(post);
    return newPost.save().then(() => {
        req.flash('info', 'Post created');
        res.redirect('/admin/posts')
    });
};

exports.read = (req, res) => {
    return posts.find().then((all) => {
        if(!all) {
            return res.sendStatus(400);
        }
        else {
            res.render('admin/posts/read', {posts: all, title: 'Posts', moment: moment})
        }
    });
};

exports.edit = async (req, res) => {
    try {
        const post = await posts.findOne({ _id: req.params.id });
        res.render('admin/posts/edit', {post, title: 'Edit post'});
    } catch {
        res.status(404);
        res.send({ error: "Post doesn't exist!" });
    }
};

exports.update = (req, res) => {
    return posts.findOne({ _id: req.params.id }).then((post) => {
        const postUpdated = req.body;

        if(!post) {
            return res.sendStatus(400);
        }
        else {
            post.title = postUpdated.title;
            post.body = postUpdated.body;
            post.save();
            req.flash('info', 'Post updated');
            res.redirect('/admin/posts');
        }
    });
};

exports.delete = (req, res) => {
    return posts.deleteOne({_id: req.params.id}).then((post) => {
        if(!post) {
            return res.sendStatus(400);
        }
        else {
            req.flash('info', 'Post deleted');
            res.redirect('/admin/posts');
        }
    });
};