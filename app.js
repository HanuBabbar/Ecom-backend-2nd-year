const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

const methodOverride = require('method-override');


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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
