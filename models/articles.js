const mongoose = require('mongoose');

const { Schema } = mongoose;

const ArticlesSchema = new Schema({
    title: String,
    date: {type: Date, default: Date.now},
    body: String
});

mongoose.model('articles', ArticlesSchema);