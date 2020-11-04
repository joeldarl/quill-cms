const mongoose = require('mongoose');

const { Schema } = mongoose;

const PagesSchema = new Schema({
    title: String,
    date: {type: Date, default: Date.now},
    body: String
});

mongoose.model('pages', PagesSchema);