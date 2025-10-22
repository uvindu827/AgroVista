const express = require('express');
const router = express.Router();
const toolDealerController = require('../controllers/toolDealerController');

router.post('/', toolDealerController.createToolDealer);
router.get('/', toolDealerController.getToolDealers);
router.get('/:id', toolDealerController.getToolDealerById);
router.put('/:id', toolDealerController.updateToolDealer);
router.delete('/:id', toolDealerController.deleteToolDealer);

module.exports = router;