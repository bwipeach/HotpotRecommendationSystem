const homeRouter = require('./home');
const hotpotRouter = require('./hotpots');
const warehouseRouter = require('./warehouse');
const toppingRouter = require('./toppings');
const cartRouter = require('./cart');
const menuRouter = require('./menu');
const userRouter = require('./user');
const orderRouter = require('./order');
route = (app) => {
    app.use('/hotpots', hotpotRouter);
    app.use('/warehouse', warehouseRouter);
    app.use('/toppings', toppingRouter);
    app.use('/menu', menuRouter);
    app.use('/cart', cartRouter);
    app.use('/', homeRouter);
    app.use('/user', userRouter);
    app.use('/order', orderRouter);
    app.post('/search', (req, res) => {
        console.log(req.body);
        res.send('');
    });
};
module.exports = route;
