const Hotpot = require('../models/Hotpot');
const Topping = require('../models/Topping');
const User = require('../models/User');
const Cart = require('../models/Cart');
const { mutipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
class menuController {
    //[GET] /menu/hotpots
    hotpot(req, res, next) {
        Promise.all([
            Hotpot.find({}),
            User.findById(req.user._id),
            Cart.findById(req.user.id)
        ])
            .then(([hotpot, user, cart]) => {
                res.render('menu/hotpot', {
                    hotpot: mutipleMongooseToObject(hotpot),
                    user: mongooseToObject(user),
                    cart: cart === null ? 0 : cart.items.length
                });
            })
            .catch(next);
    }
    //[GET] /menu/toppings
    topping(req, res, next) {
        Promise.all([
            Topping.find({}),
            User.findById(req.user._id),
            Cart.findById(req.user.id)
        ])
            .then(([topping, user, cart]) => {
                res.render('menu/topping', {
                    topping: mutipleMongooseToObject(topping),
                    user: mongooseToObject(user),
                    cart: cart === null ? 0 : cart.items.length
                });
            })
            .catch(next);
    }

    //[GET] /search
    // search(req, res){
    //     console.log(req.query.q)
    //     res.render('search')
    // }
}

module.exports = new menuController();
