const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostsSchema = new Schema({
    title: String,
    date: {type: Date, default: Date.now},
    field_data: [Object]
});

mongoose.model('posts', PostsSchema);