const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});
 
// Add a new product (Admin Only)
router.post('/', async (req, res) => {
    try {
        const { name, price, description, category, stock, image } = req.body;

        const newProduct = new Product({ name, price, description, category, stock, image });
        await newProduct.save();

        res.status(201).json({ msg: "Product added successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.get('/test', (req, res) => {
    res.json({ msg: "User routes are working!" });
});

module.exports = router;
