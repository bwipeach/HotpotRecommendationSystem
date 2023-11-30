const Hotpot = require('../models/Hotpot');
const { mutipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
const Topping = require('../models/Topping');
const User = require('../models/User')
class warehouseController {
    //[GET] /warehouse/stored/hotpots
    storedHotpots(req, res, next) {
        Promise.all([
            Hotpot.find({}),
            Topping.find({}),
            User.findById(req.user._id),
            Hotpot.countDocumentsDeleted(),
            Topping.countDocumentsDeleted()
            
        ])
            .then(([hotpot, topping, user, deleteCount, deleteToppingCount]) => {
                res.render('warehouse/stored-hotpots', {
                    // deleteCount,
                    // deleteToppingCount,
                    hotpot: mutipleMongooseToObject(hotpot),
                    topping: mutipleMongooseToObject(topping),
                    user: mongooseToObject(user),
                    deleteHp: deleteCount + deleteToppingCount                    
                });
            })
            .catch(next);
    }

    //[GET] /warehouse/trash/hotpots
    trashHotpots(req, res, next) {
        Promise.all([Hotpot.findDeleted({}), Topping.findDeleted({}), User.findById(req.user._id),])
            .then(([hotpot, topping, user]) =>
                res.render('warehouse/trash-hotpots', {
                    hotpot: mutipleMongooseToObject(hotpot),
                    topping: mutipleMongooseToObject(topping),
                    user: mongooseToObject(user)
                })
            )
            .catch(next);
    }
}

module.exports = new warehouseController();
