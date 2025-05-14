const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = 'your_secret_key';

exports.getLogin = (req, res) => {
  res.render('pages/login');
};

exports.getSignup = (req, res) => {
  res.render('pages/signup');
};

// Handle signup form submission
exports.postSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.redirect('/auth/login'); // Redirect to login page after successful signup
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('An error occurred during signup.');
  }
};

// Handle login form submission
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).send('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Set token as a cookie
    res.cookie('authToken', token, { httpOnly: true });

    // Redirect to dashboard after successful login
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('An error occurred during login.');
  }
};