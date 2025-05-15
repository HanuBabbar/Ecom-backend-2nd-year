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
        const userId = req.user && req.user.id; // Ensure user ID is available

        console.log('Request User:', req.user);
        console.log('Request Body:', req.body);
        console.log('Request User ID:', userId);
        console.log('Request Product ID:', productId);

        if (!userId) {
            console.error('User not authenticated');
            return res.status(401).json({ error: 'User not authenticated' });
        }

        if (!productId) {
            console.error('Product ID not provided');
            return res.status(400).json({ error: 'Product ID is required' });
        }

        const user = await User.findById(userId);
        console.log('User Retrieved from DB:', user);

        if (!user) {
            console.error('User not found in database');
            return res.status(404).json({ error: 'User not found in database' });
        }

        const existingProduct = user.cart.find(item => item.product.toString() === productId);
        if (existingProduct) {
            console.log('Product already in cart, incrementing quantity');
            existingProduct.quantity += 1;
        } else {
            console.log('Product not in cart, adding new product');
            user.cart.push({ product: productId });
        }

        await user.save();
        console.log('Cart updated successfully:', user.cart);
        console.log('Product added to cart successfully');
        res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
};
