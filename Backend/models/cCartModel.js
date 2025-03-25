import mongoose from 'mongoose';

// Cart Schema
const cartSchema = new mongoose.Schema(
  {
    customerEmail: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'BuyerInventory',
          required: true,
        },
        productName: { type: String, required: true },
        pricePerKg: { type: Number, required: true },
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

const Cart = mongoose.model('customerCart', cartSchema);
export default Cart;
