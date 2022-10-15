// database connection should be done in index.js file
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
app.use(methodOverride('_method')); // then we can override method in ejs to invoke the query method on url

// include the exported model in models folder: product acts like an entity
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

app.set('view engine', 'ejs');
app.set('veiws', path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));  //a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.

//pass a list to ejs to make a loop for <options>
const categories = ['fruit', 'vegetable', 'dairy'];

//============= Restful API CRUD Methods ====================
/**
 * Product Index
 * 
 * BONUS: FILTERING BY CATEGORY
 * show products by category
 * design format: /products?category=dairy
 * above is easier than: /products/category/dairy
 */
app.get('/products', async (req, res) => {
    const { category } = req.query; //category is from path query: /products?category=
    if (category) {
        //find the products where the category is the same
        /**if in db, the category is the name, we can directly use category, but if the query word and db collection is different, 
        we have to use {collection: queryName}*/
        const products = await Product.find({ categories: category });
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({}); //return Promise obj
        //console.log(products);
        //res.send('All products will be here!');

        //pass {products} as second param for render, it will be printed on terminal
        //also products should be the same name with ejs template on html
        res.render('products/index', { products, category: 'ALL' }); //we can set category to string content to dispay on model
    }

})

/**
 * Create new products: get request then post response
 * path new must be defined before the path with patterns: 
 * '/products/new' must be before '/products/:id'
 */
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
})
app.post('/products', async (req, res) => {
    //console.log(req.body); //req.body is the data from the form
    const newProduct = new Product(req.body); //usually need input senitizing for cybersecurity concern, here we ignored.
    await newProduct.save(); //save to db, this method await until newProduct instance has been created.
    //console.log(newProduct);
    //res.send('making your product');
    res.redirect(`/products/${newProduct._id}`)
})

/**
 * Show product details by findById
 */
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;  // pass id from url
    const foundProduct = await Product.findById(id); //pass requesting id to findById()

    //console.log(foundProduct);
    //res.send('details page!');
    res.render('products/show', { foundProduct });
})

/**
 * Edit product by id
 * GET first, then PUT
 */
// go into edit page, that shows old values
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;  // pass id from url
    //the reference on edit.ejs show match with this foundProduct instance defined inside mapping, other ejs file follows the same rule
    const foundProduct = await Product.findById(id); //pass requesting id to findById()
    res.render('products/edit', { foundProduct, categories });
})
app.put('/products/:id', async (req, res) => {
    //console.log(req.body); 
    //res.send('PUT your product');

    const { id } = req.params;
    //await this method complete, then run another line, instead run other lines while its busy to fetch the data
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidator: true, new: true });
    res.redirect(`/products/${product._id}`); // we can use id here, but only when the id is valid, so _id is better
})

/**
 * Delete product by id
 * Use delete()
 */
app.delete('/products/:id', async (req, res) => { // delete takes time, so need to use await
    //console.log('delete');
    const { id } = req.params; // req.params is from the path-- :id
    const deletedProduct = await Product.findByIdAndDelete(id); //return the item list after remove the item
    //console.log(deletedProduct); //print all existing items
    res.redirect('/products');
})


app.listen('3000', () => {
    console.log("App is listening on port 3000!");
})