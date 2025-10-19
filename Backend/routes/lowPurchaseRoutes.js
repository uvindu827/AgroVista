import express from 'express';
import { getLowPurchaseCourses } from '../controllers/lowPurchaseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Inspector can view low-purchase courses
router.get('/', protect, getLowPurchaseCourses);

export default router;
