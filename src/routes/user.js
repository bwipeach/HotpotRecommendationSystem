const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/userController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/register', userController.register);
router.post('/register1', userController.register1);
router.get('/login', userController.login);
router.post('/login1', userController.login1);
router.get('/logout', userController.logout);
module.exports = router;
