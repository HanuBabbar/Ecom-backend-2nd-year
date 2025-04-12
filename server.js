require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');  // Ensure correct path
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());+

// Debugging: Check if routes are loaded
console.log("Registering Routes...");

// Route Registration
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Debugging: Log registered routes
console.log("Registered Routes:");
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send("E-commerce API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
