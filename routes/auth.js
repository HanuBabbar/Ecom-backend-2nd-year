const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route
router.get('/login', authController.getLogin);

// Signup route
router.get('/signup', authController.getSignup);

// Signup POST route
router.post('/signup', authController.postSignup);

// Login POST route
router.post('/login', authController.postLogin);

module.exports = router;