const mongoose = require('mongoose');

const { Schema } = mongoose;

const NavItemsSchema = new Schema({
    title: String,
    url: String,
    order: Number
});

mongoose.model('nav-items', NavItemsSchema);