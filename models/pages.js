const mongoose = require('mongoose');

const { Schema } = mongoose;

const PagesSchema = new Schema({
    title: String,
    date: {type: Date, default: Date.now},
    url: {type: String, unique: true},
    body: String
});

mongoose.model('pages', PagesSchema);