import express from 'express';
import {
  createOrUpdateCart,
  getCart,
  removeProductFromCart,
  checkoutCart,
} from '../controllers/cCartController.js';

const router = express.Router();

// Create or update a cart
router.post('/', createOrUpdateCart);

// Get cart by either cart ID or customer email and buyer email
router.get('/:cartId?', getCart);
router.get('/:customerId/:buyerId', getCart);


// Remove product from cart by either cart ID or customer email and buyer email
router.delete('/:cartId/product/:productId', removeProductFromCart);  // By Cart ID
router.delete('/:customerId/:buyerId/product/:productId', removeProductFromCart);  // By Customer & Buyer Id

// Checkout cart
router.post('/checkout', checkoutCart);

export default router;
