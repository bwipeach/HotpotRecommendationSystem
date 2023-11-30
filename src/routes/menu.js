const express = require('express');
const router = express.Router();

const menuController = require('../app/controllers/menuController');
const verifyToken = require('../middlewares/verifyToken');

//router.get('/search', homeController.search)
router.get('/hotpot', verifyToken, menuController.hotpot);
router.get('/topping', verifyToken, menuController.topping);

module.exports = router;
