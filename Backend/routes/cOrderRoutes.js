import express from 'express';
import { createOrderFromCart, getOrderById } from '../controllers/cOrderController.js';


const router = express.Router();

router.post('/placeOrder', createOrderFromCart);
router.get('/:id', getOrderById);


export default router;
