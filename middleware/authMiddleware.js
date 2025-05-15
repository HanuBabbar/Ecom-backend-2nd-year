const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'your_secret_key';

// Middleware to verify JWT token
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.userId);

    console.log('Auth Token:', token);
    console.log('Decoded Token:', decoded);
    console.log('User Retrieved:', req.user);

    if (!req.user) {
      return res.status(401).send('Invalid token.');
    }

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).send('Invalid token.');
  }
};
