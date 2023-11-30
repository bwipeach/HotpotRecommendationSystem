const Cart = require('../models/Cart');
const {
    mongooseToObject,
    mutipleMongooseToObject
} = require('../../util/mongoose');
const Topping = require('../models/Topping');
const Hotpot = require('../models/Hotpot');
const User = require('../models/User');
class cartController {
    //[GET] cart/product
    product(req, res, next) {
        Promise.all([
            Cart.findOne({ _id: req.user._id }),
            User.findById(req.user._id)
        ])
            .then(([carts, user]) => {
                res.render('cart/product', {
                    carts: carts.toObject(),
                    user: mongooseToObject(user),
                    cart: carts.items.length
                });
            })
            .catch(next);
    }
    //[POST] /cart/hotpot/:id
    async addCartHotpot(req, res, next) {
        await Promise.all([
            Cart.findOne({ _id: req.user._id }),
            Hotpot.findOne({ slug: req.params.slug })
        ])
            .then(([cart, hotpot]) => {
                const newItem = {
                    id: hotpot._id,
                    image: hotpot.image,
                    name: hotpot.name,
                    price: hotpot.price,
                    quantity: req.body.quantity
                };
                if (cart) {
                    const existingItem = cart.items.some(
                        (item) => item.id === newItem.id.toString()
                    );
                    if (existingItem) {
                        cart.items.forEach((item) => {
                            if (item.id === newItem.id.toString()) {
                                item.quantity += parseInt(newItem.quantity, 10);
                            }
                        });
                    } else {
                        cart.items.push(newItem);
                    }
                    cart.total += newItem.price * newItem.quantity;
                    cart.save().then(() => {
                        res.redirect('/cart/product');
                    });
                } else {
                    const newCart = new Cart({
                        _id: req.user._id,
                        items: [newItem],
                        total: newItem.price * newItem.quantity
                    });
                    newCart.save().then(() => {
                        res.redirect('/cart/product');
                    });
                }
            })
            .catch(next);
    }

    async addCartTopping(req, res, next) {
        await Promise.all([
            Cart.findOne({ _id: req.user._id }),
            Topping.findOne({ slug: req.params.slug })
        ])
            .then(([cart, topping]) => {
                const newItem = {
                    id: topping._id,
                    image: topping.image,
                    name: topping.name,
                    price: topping.price,
                    quantity: req.body.quantity
                };
                if (cart) {
                    const existingItem = cart.items.some(
                        (item) => item.id === newItem.id.toString()
                    );
                    if (existingItem) {
                        cart.items.forEach((item) => {
                            if (item.id === newItem.id.toString()) {
                                item.quantity += parseInt(newItem.quantity, 10);
                            }
                        });
                    } else {
                        cart.items.push(newItem);
                    }
                    cart.total += newItem.price * newItem.quantity;
                    cart.save().then(() => {
                        res.redirect('/cart/product');
                    });
                } else {
                    const newCart = new Cart({
                        _id: req.user._id,
                        items: [newItem],
                        total: newItem.price * newItem.quantity
                    });
                    newCart.save().then(() => {
                        res.redirect('/cart/product');
                    });
                }
            })
            .catch(next);
    }

    //[PUT]
    async updateCartHotpot(req, res, next) {
        try {
            const [cart, hotpot] = await Promise.all([
                Cart.findOne({ _id: req.user._id }),
                Hotpot.findOne({ slug: req.params.slug })
            ]);

            const newItem = {
                id: hotpot._id,
                image: hotpot.image,
                name: hotpot.name,
                price: hotpot.price,
                quantity: req.body.quantity
            };

            if (cart) {
                const existingItem = cart.items.find(
                    (item) => item.id === newItem.id.toString()
                );

                if (existingItem) {
                    existingItem.quantity = parseInt(newItem.quantity, 10);
                } else {
                    cart.items.push(newItem);
                }

                cart.total = cart.items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );

                await cart.save();
            } else {
                const newCart = new Cart({
                    _id: req.user._id,
                    items: [newItem],
                    total: newItem.price * newItem.quantity
                });

                await newCart.save();
            }

            res.redirect('/cart/product');
        } catch (error) {
            next(error);
        }
    }

    //[DELETE] cart/:id
    async delete(req, res, next) {
        try {
            const cartId = req.user._id;
            const itemId = req.params.id;
            const cart = await Cart.findOne({ _id: cartId });

            if (!cart) {
                return res
                    .status(404)
                    .json({ message: 'Giỏ hàng không tồn tại' });
            }

            const itemIndex = cart.items.findIndex(
                (item) => item.id.toString() === itemId.toString()
            );

            if (itemIndex === -1) {
                return res
                    .status(404)
                    .json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
            }

            const deletedItem = cart.items.splice(itemIndex, 1);
            cart.total -=
                parseInt(deletedItem[0].price, 10) *
                parseInt(deletedItem[0].quantity, 10);

            await cart.save();

            res.redirect('/cart/product');
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new cartController();
