// create a seed file that connects with db and insert some random data
const product = require('./models/product');

const mongoose = require('mongoose');
const Product = require('./models/product');
mongoose.connect('mongodb://localhost:27017/farmStand')
    .then(() => {
        console.log("Mongo Connection Open!");
    })
    .catch(err => {
        console.log("Oh No! Mongo Connection Error!!");
        console.log(err);
    })

// ======= test single data insertion =======
// const p = new Product({
//     name: 'Ruby Grapefruit',
//     price: 1.99,
//     categories: 'fruit'
// })

// p.save().then(p => {
//     console.log(p);
// })
//     .catch(err => {
//         console.log(err);
//     })

// ======= insert a set of random data =======
const seedProducts = [
    {
        name: 'Fairy Eggplant',
        price: 1.00,
        categories: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        categories: 'fruit'
    },
    {
        name: 'Organic Mini Seedless Watermelon',
        price: 3.99,
        categories: 'fruit'
    },
    {
        name: 'Organic Celery',
        price: 1.50,
        categories: 'vegetable'
    },
    {
        name: 'Chocolate Whole Milk',
        price: 2.69,
        categories: 'dairy'
    }
]

Product.insertMany(seedProducts)
    .then(res => {
        console.log(res);
    })
    .catch(e => {
        console.log(e);
    })