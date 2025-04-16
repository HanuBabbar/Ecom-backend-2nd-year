const express = require('express');
const Product = require('../models/productModel');
const router = express.Router();

// Create new product
router.post('/products', async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const newProduct = new Product({ name, price, category });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Serve CSR Page
router.get('/csr', (req, res) => {
    res.render('csrPage');  // Make sure to render the correct .ejs file
});

router.get('/api/products', async (req, res) => {
    // Fetch products from the database (or mock data)
    const products = [
        { name: 'Product 1', price: 10 },
        { name: 'Product 2', price: 20 },
        { name: 'Product 3', price: 30 }
    ];
    res.json(products);  // Send products data as JSON
});


module.exports = router;
