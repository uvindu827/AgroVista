import express from 'express';
import { createOrderFromCart } from '../controllers/cOrderController.js'; // Import controller

const router = express.Router();

// Route to place an order from the cart
router.post('/placeOrder', createOrderFromCart);  // Ensure it's set correctly

export default router;
