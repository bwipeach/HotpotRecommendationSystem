const Hotpot = require('../models/Hotpot');
const User = require('../models/User');
const Recommend = require('./recommend');
const {
    mongooseToObject,
    mutipleMongooseToObject
} = require('../../util/mongoose');
const { Promise } = require('mongoose');
const titleHotpot = {};
class hotpotController {
    //[GET] /hotpots/:slug
    show(req, res, next) {
        const id = req.params.id;
        // const recommend = new Recommend();
        const nameList = [];
        Promise.all([
            Hotpot.findOne({ slug: req.params.slug }),
            User.findById(req.user._id),

            Hotpot.find(
                {
                    $text: { $search: `\"lẩu\"` }
                },
                { score: { $meta: 'textScore' } }
            )
        ])
            .then(([hotpot, user, searchName]) => {
                searchName.forEach((nameHP) => {
                    const titleHotpot = {
                        number: Recommend.computeSimilarity(
                            nameHP.name,
                            hotpot.name
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

                // console.log(nameList);
                res.render('hotpot/show', {
                    hotpot: mongooseToObject(hotpot),
                    user: mongooseToObject(user),
                    // nameList: nameList
                    nameList: limitedProductList
                });
            })
            .catch(next);
    }
    //[GET] /hotpots/create
    create(req, res, next) {
        User.findById(req.user._id)
            .then((user) => {
                res.render('hotpot/create', {
                    user: mongooseToObject(user)
                });
            })
            .catch(next);
    }
    //[POST] /hotpots/store
    store(req, res, next) {
        const hotpot = new Hotpot(req.body);
        hotpot.save().then(() => res.redirect('/warehouse/stored/hotpots'));
    }

     //[GET] /hotpots/:id/edit
     edit(req, res, next) {
        Promise.all([
            Hotpot.findById(req.params.id),
            User.findById(req.user._id)
        ])
            .then(([hotpot, user]) => {
                res.render('hotpot/edit', {
                    hotpot: mongooseToObject(hotpot),
                    user: mongooseToObject(user)
                });
            })
            .catch(next);
    }
    //[PUT] /hotpots/:id
    update(req, res, next) {
        Hotpot.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/warehouse/stored/hotpots'))
            .catch(next);
    }

    //[DELETE] /hotpots/:id
    delete(req, res, next) {
        Hotpot.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[DELETE] /hotpots/:id/force
    forceDelete(req, res, next) {
        Hotpot.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[PATCH] /hotpots/:id/restore
    restore(req, res, next) {
        Hotpot.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[POST] /hotpots/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Hotpot.delete({ _id: { $in: req.body.hotpotIds } }) //handle array
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Invalid' });
        }
    }
    //[POST] /hotpots/handle-form-actions
    handleTrashActions(req, res, next) {
        switch (req.body.action) {
            case 'restore':
                Hotpot.restore({ _id: { $in: req.body.hotpotIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'delete':
                Hotpot.deleteMany({ _id: { $in: req.body.hotpotIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Invalid' });
        }
    }
}
module.exports = new hotpotController();
