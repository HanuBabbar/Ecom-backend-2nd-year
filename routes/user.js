const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Make sure this path is correct

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.render('index', { users });
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
