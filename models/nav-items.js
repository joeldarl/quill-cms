const mongoose = require('mongoose');

const { Schema } = mongoose;

const NavItemsSchema = new Schema({
    title: String,
    url: String
});

mongoose.model('nav-items', NavItemsSchema);