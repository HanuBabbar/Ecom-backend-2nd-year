const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User'); // ✅ Make sure this path is correct

// =====================
// GET all users
// =====================
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.render('index', { users });
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).send("Server Error");
  }
});

// =====================
// GET create form
// =====================
router.get('/create', (req, res) => {
  res.render('pages/create'); // Adjust path if needed
});

// =====================
// POST new user
// =====================
router.post('/create', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// =====================
// GET edit form
// =====================
router.get('/:id/edit', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid user ID');
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.render('pages/edit', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
});

// =====================
// PUT update user
// =====================
router.put('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid user ID');
  }

  try {
    const { name, email } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email });
    res.redirect('/users/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// =====================
// GET single user detail
// =====================
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid user ID');
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.render('user', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// =====================
// Delete User
// =====================
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
