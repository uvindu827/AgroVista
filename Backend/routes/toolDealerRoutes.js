import express from 'express';
import * as toolDealerController from '../controllers/toolDealerController.js';

const router = express.Router();
router.post('/', toolDealerController.createToolDealer);
router.get('/', toolDealerController.getToolDealers);
router.get('/:id', toolDealerController.getToolDealerById);
router.put('/:id', toolDealerController.updateToolDealer);
router.delete('/:id', toolDealerController.deleteToolDealer);

export default router;