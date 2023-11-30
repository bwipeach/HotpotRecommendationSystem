const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cart: { type: Object, required: true },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);
