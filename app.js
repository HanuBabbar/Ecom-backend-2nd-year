const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

const methodOverride = require('method-override');

const orderRoutes = require('./routes/orderRoutes');

const exphbs = require('express-handlebars');

app.use(express.json()); // to parse JSON body


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('home', { products });
  } catch (err) {
    res.status(500).send('Server error');
  }
});



// Connect to MongoDB
mongoose.connect("mongodb+srv://hanubabbar:hanu4321@ecom.gjo0uz5.mongodb.net/ecom-db?retryWrites=true&w=majority&appName=Ecom", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.use(methodOverride('_method'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//url encoded
app.use(express.urlencoded({ extended: true }));
// Routes
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  
  res.render('index', { users: [] });
});

// Home Page
app.get('/', (req, res) => {
  res.render('home', { title: 'Home Page' });
});

// Products Page
app.get('/products', async (req, res) => {
  const Product = require('./models/product'); // adjust path if needed
  const products = await Product.find({});
  res.render('products', { products });
});

// Register Page
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const User = require('/CU/4th Semester/Backend Project/Ecom-backend-2nd-year/models/user.js'); // adjust path
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.redirect('/dashboard'); // or wherever you want to take them
});

// Login Page
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const User = require('/CU/4th Semester/Backend Project/Ecom-backend-2nd-year/models/user.js');
  const { username, password } = req.body;
  const user = await User.findOne({ username, password }); // add proper auth logic later
  if (user) {
    res.redirect('/dashboard');
  } else {
    res.send('Login failed');
  }
});

// Dashboard Page
app.get('/dashboard', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login'); // Redirect to login if the user isn't authenticated
  }

  try {
    const user = req.user; // The authenticated user
    const orders = await Order.find({ userId: user._id }); // Get the orders associated with the user

    res.render('dashboard', { user, orders }); // Render the dashboard page with user data and orders
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const loggingMiddleware = (req, res, next) => {
  console.log(`Request method: ${req.method}, Request URL: ${req.url}`);
  next();
};

app.use(loggingMiddleware); // Apply logging middleware globally

const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied');
  // Here, you can verify the token (e.g., using JWT)
  // For simplicity, we'll assume token exists and is valid.
  req.user = { id: 1 }; // Mock user object
  next();
};

app.use('/api/products', authenticate); // Protect product routes

const productRoutes = require('./routes/productRoutes');
app.use('/', productRoutes);



// Use your route
app.use('/api', orderRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
