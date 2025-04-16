const mongoose = require('mongoose');

// Define a Schema for an Order
const orderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Link to the Product model
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Link to the User model
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
