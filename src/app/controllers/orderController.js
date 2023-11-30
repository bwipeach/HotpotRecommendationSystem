const Order = require('../models/Order');
const {
    mongooseToObject,
    mutipleMongooseToObject
} = require('../../util/mongoose');
const Cart = require('../models/Cart');
const User = require('../models/User');
class orderController {
    //[GET] order/booking
    booking(req, res, next) {
        Promise.all([
            Cart.findOne({ _id: req.user._id }),
            User.findById(req.user._id)
        ])
            .then(([carts, user]) => {
                res.render('cart/booking', {
                    carts: carts.toObject(),
                    user: mongooseToObject(user),
                    cart: carts.items.length
                });
            })
            .catch(next);
    }
    //[POST] cart/placeOrder
    async placeOrder(req, res, next) {
        // try {
        //     if (req.session.cart.totalQty) {
        //         const order = new Order({
        //             user: req.user,
        //             cart: req.session.cart.items,
        //             address: req.body.address,
        //             phone: req.body.phone
        //         });

        //         for (var id in req.session.cart.items) {
        //             const product = await Products.findOne({ _id: item.id });
        //             if (product) {
        //                 product.buyCounts += parseInt(item.quantity);
        //                 await product.save();
        //             }
        //         }

        //         await order.save();

        //         req.flash('success', 'Thanh toán thành công!');
        //         req.session.cart = null;
        //         req.user.cart = {};
        //         await req.user.save();

        //         res.redirect('/cart/product');
        //     } else {
        //         req.flash('error', 'Giỏ hàng rỗng!');
        //         res.redirect('/cart/product');
        //     }
        // } catch (error) {
        //     req.flash('error', 'Đã xảy ra lỗi khi xử lý đặt hàng.');
        //     res.redirect('/cart/product');
        // }
        res.redirect('/');
    }
}
module.exports = new orderController();
