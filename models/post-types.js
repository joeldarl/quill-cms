const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostTypesSchema = new Schema({
    title: String,
    url: {type : String, unique : true},
    fields: [Object]
});

mongoose.model('post-types', PostTypesSchema);