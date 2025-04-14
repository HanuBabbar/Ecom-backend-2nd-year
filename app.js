const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();


const userRoutes = require('./routes/users'); // path may vary
app.use('/users', userRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/ecom-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Dummy route to load frontend
app.get('/', (req, res) => {
  const users = [
    { _id: 1, name: "Hanu", email: "hanu@email.com" },
    { _id: 2, name: "Mahi", email: "mahi@email.com" },
    // add more dummy users if needed
  ];

  res.render('index', { users }); // ✅ pass the users to the template
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
