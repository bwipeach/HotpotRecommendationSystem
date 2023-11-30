const express = require('express');
const router = express.Router();

const orderController = require('../app/controllers/orderController');
const verifyToken = require('../middlewares/verifyToken');
router.get('/booking', verifyToken, orderController.booking);
router.post('/placeOrder', verifyToken, orderController.placeOrder);
module.exports = router;