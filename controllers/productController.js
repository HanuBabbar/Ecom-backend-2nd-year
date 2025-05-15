const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from MongoDB
        res.render('pages/products', { products }); // Pass products to the EJS template
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Failed to load products');
    }
};

exports.getCart = (req, res) => {
  res.render('pages/cart'); // Render the cart.ejs file
};

exports.renderProductsPage = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from MongoDB
        res.render('pages/products', { products }); // Pass products to the EJS template
    } catch (error) {
        res.status(500).send('Failed to load products');
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user && (req.user._id || req.user.id); // Use _id for userId if available

        console.log('Request User:', req.user);
        console.log('Request Body:', req.body);
        console.log('Request User ID:', userId, '(_id:', req.user && req.user._id, ', id:', req.user && req.user.id, ')');

        if (!userId) {
            console.error('User not authenticated');
            return res.status(401).json({ error: 'User not authenticated' });
        }

        if (!productId) {
            console.error('Product ID not provided');
            return res.status(400).json({ error: 'Product ID is required' });
        }

        // Validate productId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.error('Invalid productId format:', productId);
            return res.status(400).json({ error: 'Invalid productId format' });
        }

        const user = await User.findById(userId);
        console.log('User Retrieved from DB:', user);

        if (!user) {
            console.error('User not found in database');
            return res.status(404).json({ error: 'User not found in database' });
        }

        console.log('Product ID:', productId);
        console.log('User Cart Before Update:', user.cart);

        // Validate productId
        const product = await Product.findById(productId);
        if (!product) {
            console.error('Product not found in database for productId:', productId);
            return res.status(404).json({ error: 'Product not found in database' });
        }

        console.log('Product Retrieved from DB:', product);

        // Add product to cart
        console.log('Attempting to add product to cart:', { productId });
        console.log('Cart Before Push:', user.cart);

        const existingProduct = user.cart.find(item => item.product.toString() === productId);
        if (existingProduct) {
            console.log('Product already in cart, incrementing quantity');
            existingProduct.quantity += 1;
        } else {
            console.log('Product not in cart, adding new product');
            user.cart.push({ product: productId, quantity: 1 });
        }

        console.log('Cart After Push:', user.cart);

        // Save updated user cart
        try {
            const saveResult = await user.save();
            console.log('Save Result:', saveResult);
            console.log('Cart updated successfully:', user.cart);
        } catch (saveError) {
            console.error('Error saving user cart:', saveError);
            if (saveError.name === 'ValidationError') {
                console.error('Validation Error Details:', saveError.errors);
            }
            console.error('Save Error Stack:', saveError.stack);
            return res.status(500).json({ error: 'Failed to save updated cart' });
        }

        res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
};
