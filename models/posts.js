const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostsSchema = new Schema({
    title: String,
    date: {type: Date, default: Date.now},
    post_type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post-types'}],
    field_data: [Object]
});

mongoose.model('posts', PostsSchema);