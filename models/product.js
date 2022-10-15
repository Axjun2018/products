const mongoose = require('mongoose');
// we don't need connect database here,
// instead, we'll include this file to index.js

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    categories: {
        type: String,
        lowercase: true,  //should match the lowercase enum words
        enum: ['fruit', 'vegetable', 'dairy']
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;