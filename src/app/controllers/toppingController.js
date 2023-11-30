const Topping = require('../models/Topping');
const User = require('../models/User');
const { mongooseToObject } = require('../../util/mongoose');
const { Promise } = require('mongoose');
const Recommend = require('./recommend');
class toppingController {
    //[GET] /toppings/:slug
    show(req, res, next) {
        const nameList = [];
        Promise.all([
            Topping.findOne({ slug: req.params.slug }),
            User.findById(req.user._id),
            Topping.find(
                {
                    $text: { $search: `\"Viên\"` }
                },
                { score: { $meta: 'textScore' } }
            )
        ])
            .then(([topping, user, searchName]) => {
                searchName.forEach((nameHP) => {
                    const titleHotpot = {
                        number: Recommend.computeSimilarity(
                            nameHP.name,
                            topping.name
                        ),
                        name: nameHP.name,
                        description: nameHP.description,
                        price: nameHP.price,
                        slug: nameHP.slug,
                        image: nameHP.image
                    };
                    nameList.push(titleHotpot);
                });

                // Sắp xếp danh sách theo số tương đồng giảm dần
                nameList.sort((a, b) => b.number - a.number);
                // Giới hạn chỉ lấy 3 sản phẩm
                const limitedProductList = nameList.slice(1, 4);
                res.render('topping/show', {
                    topping: mongooseToObject(topping),
                    user: mongooseToObject(user),
                    nameList: limitedProductList
                });
            })
            .catch(next);
    }
    //[GET] /toppings/create
    create(req, res, next) {
        User.findById(req.user._id)
            .then((user) => {
                res.render('topping/create', {
                    user: mongooseToObject(user)
                });
            })
            .catch(next);
    }
    //[POST] /toppings/store
    store(req, res, next) {
        const topping = new Topping(req.body);
        topping.save().then(() => res.redirect('/warehouse/stored/hotpots'));
    }

    //[GET] /toppings/:id/edit
    edit(req, res, next) {
        Promise.all([
            Topping.findById(req.params.id),
            User.findById(req.user._id)
        ])
            .then(([topping, user]) => {
                res.render('topping/edit', {
                    topping: mongooseToObject(topping),
                    user: mongooseToObject(user)
                });
            })
            .catch(next);
    }
    //[PUT] /toppings/:id
    update(req, res, next) {
        Topping.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/warehouse/stored/hotpots'))
            .catch(next);
    }

    //[DELETE] /toppings/:id
    delete(req, res, next) {
        Topping.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[DELETE] /toppings/:id/force
    forceDelete(req, res, next) {
        Topping.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[PATCH] /toppings/:id/restore
    restore(req, res, next) {
        Topping.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[POST] /toppings/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Topping.delete({ _id: { $in: req.body.toppingIds } }) //handle array
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Invalid' });
        }
    }
    //[POST] /toppings/handle-form-actions
    handleTrashActions(req, res, next) {
        switch (req.body.action) {
            case 'restore':
                Topping.restore({ _id: { $in: req.body.toppingIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'delete':
                Topping.deleteMany({ _id: { $in: req.body.toppingIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Invalid' });
        }
    }
}
module.exports = new toppingController();
