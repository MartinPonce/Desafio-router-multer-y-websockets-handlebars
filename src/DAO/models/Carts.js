const mongoose = require('mongoose');

/*const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  products: {
    type: [String],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});*/
const cartSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
