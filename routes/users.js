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

router.get('/:id', async (req, res ) => {
  try{
    const user = await User.findById(req.params.id);

    if(!user){
      return res.status(404).send('User not found');
    }

    res.render('user', { user });
  } catch (err){
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/:id/edit', async (req, res) =>{
  try {
    const user = await User.findById(req.params.id);
    res.render('pages/edit', {user});
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
})

router.put('/:id', async (req, res) => {
  try{
    const {name, email } = req.body;
    await User.findByIdAndUpdate(req.params.id, {name, email});
    res.redirect('/users/'+req.params.id);
  } catch(err) {
    console.error(err);
    res.redirect('/');
  }
})


module.exports = router;
