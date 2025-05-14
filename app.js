const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

const methodOverride = require('method-override');
const authController = require('./controllers/authController');
const authRoutes = require('./routes/auth');
const { verifyToken } = require('./middleware/authMiddleware');

// Connect to MongoDB
mongoose.connect("mongodb+srv://hanubabbar:hanu4321@ecom.gjo0uz5.mongodb.net/ecom-db?retryWrites=true&w=majority&appName=Ecom", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.use(methodOverride('_method'));
app.use(cookieParser()); // Middleware to parse cookies

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//url encoded
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);
app.use('/cart', productRoutes);

//landing page
app.get('/', (req, res) => {
  
  res.render('pages/index', { users: [] });
});

// Example of protecting a route
app.get('/protected', verifyToken, (req, res) => {
  res.send(`Welcome, ${req.user.name}`);
});

// Dashboard route
app.get('/dashboard', verifyToken, (req, res) => {
  res.render('pages/dashboard', { user: req.user });
});

//auth routes
app.use('/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
