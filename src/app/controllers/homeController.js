const Hotpot = require('../models/Hotpot');
const Topping = require('../models/Topping');
const {
    mutipleMongooseToObject,
    mongooseToObject
} = require('../../util/mongoose');
const User = require('../models/User');
const Cart = require('../models/Cart');
class homeController {
    //[GET] /
    home(req, res, next) {
        Promise.all([
            Hotpot.find({}).sort({ createdAt: -1 }).limit(3),
            Topping.find({}).sort({ createdAt: -1 }).limit(3),
            User.findById(req.user._id),
            Cart.findById(req.user.id)

        ])
            .then(([hotpot, topping, user, cart]) => {              
                res.render('home', {
                    hotpot: mutipleMongooseToObject(hotpot),
                    topping: mutipleMongooseToObject(topping),
                    user: mongooseToObject(user),
                    cart: cart === null ? 0 : cart.items.length
                });
            })
            .catch(next);
    }
    // [GET] /search
    search(req, res){
        console.log(req.query.q)
        res.render('search')
    }
}

module.exports = new homeController();
