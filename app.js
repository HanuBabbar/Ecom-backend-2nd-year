const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ecom-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data


// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

app.get('/', async (req, res) => {
  try {
    // Assuming you have a User model
    const users = await User.find({});
    res.render('index', { users });
  } catch (err) {
    console.error(err);
    res.render('index', { users: [] });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));