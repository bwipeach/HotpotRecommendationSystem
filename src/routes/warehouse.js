const express = require('express');
const router = express.Router();

const warehouseController = require('../app/controllers/warehouseController');
const verifyToken = require('../middlewares/verifyToken');


router.get('/stored/hotpots', verifyToken, warehouseController.storedHotpots);
router.get('/trash/hotpots', verifyToken, warehouseController.trashHotpots);

module.exports = router;
