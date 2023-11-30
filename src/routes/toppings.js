const express = require('express');
const router = express.Router();

const toppingController = require('../app/controllers/toppingController');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const ROLE_LIST = require('../app/models/Role_list');

router.get(
    '/create',
    verifyToken,
    verifyRole(ROLE_LIST.Admin),
    toppingController.create
);
router.post('/store', toppingController.store);
router.get('/:id/edit',verifyToken,verifyRole(ROLE_LIST.Admin), toppingController.edit);
router.put('/:id', toppingController.update);
router.get('/:slug', verifyToken, toppingController.show);
router.post('/handle-form-actions', toppingController.handleFormActions);
router.post('/handle-trash-actions', toppingController.handleTrashActions);
router.patch('/:id/restore', toppingController.restore);
router.delete('/:id', toppingController.delete);
router.delete('/:id/force', toppingController.forceDelete);
module.exports = router;
