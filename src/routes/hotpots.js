const express = require('express');
const router = express.Router();

const hotpotController = require('../app/controllers/hotpotController');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const ROLE_LIST = require('../app/models/Role_list');

router.get(
    '/create',
    verifyToken,
    verifyRole(ROLE_LIST.Admin),
    hotpotController.create
);
router.post('/store', hotpotController.store);
router.get('/:id/edit', verifyToken,verifyRole(ROLE_LIST.Admin), hotpotController.edit);
router.put('/:id', hotpotController.update);
router.get('/:slug', verifyToken, hotpotController.show);
router.post('/handle-form-actions', hotpotController.handleFormActions);
router.post('/handle-trash-actions', hotpotController.handleTrashActions);
router.patch('/:id/restore', hotpotController.restore);
router.delete('/:id', hotpotController.delete);
router.delete('/:id/force', hotpotController.forceDelete);
// router.get('/:name', hotpotController.hotpotSimilar);
module.exports = router;
