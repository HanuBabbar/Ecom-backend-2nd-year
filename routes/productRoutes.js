const express = require('express');
const Product = require('../models/Product');
const productController = require('../controllers/productController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});


// Temporarily bypass verifyToken for debugging
router.get('/products', productController.getProducts);
router.get('/cart', productController.getCart);

// Add a route to fetch products for the cart page
router.get('/cart-products', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Route to render the products page
router.get('/products-page', productController.renderProductsPage);

// Route to add a product to the cart
router.post('/add-to-cart', verifyToken, productController.addToCart);

router.get('/test', (req, res) => {
    res.json({ msg: "User routes are working!" });
});

module.exports = router;
