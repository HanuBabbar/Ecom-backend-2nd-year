const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'your_secret_key';

// Middleware to verify JWT token
exports.verifyToken = async (req, res, next) => {
  try {
    let token = req.cookies.authToken;
    // Also check Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.userId);

    console.log('Auth Token:', token);
    console.log('Decoded Token:', decoded);
    console.log('User Retrieved:', req.user);

    if (!req.user) {
      console.error('User not found for decoded userId:', decoded.userId);
      return res.status(401).send('Invalid token.');
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.error('JWT Error:', error.message);
    } else if (error.name === 'TokenExpiredError') {
      console.error('JWT Expired:', error.message);
    } else {
      console.error('Error verifying token:', error);
    }
    res.status(401).send('Invalid token.');
  }
};
