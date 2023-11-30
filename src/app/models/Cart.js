const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        _id: { type: String, default: '' },
        items: [
            {
                id: { type: String, default: '' },
                image: { type: String, default: '' },
                name: { type: String, default: '' },
                price: { type: Number, default: 0 },
                quantity: { type: Number, default: 0 }
            }
        ],
        total: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('Cart', cartSchema);
