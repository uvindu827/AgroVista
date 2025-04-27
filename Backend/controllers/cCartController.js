import Cart from '../models/cCartModel.js';
import BuyerInventory from '../models/biModel.js';



// Create or update a cart
export const createOrUpdateCart = async (req, res) => {
  try {
    const { customerId, buyerId, products } = req.body;

    let totalAmount = 0;
    const updatedProducts = [];

    for (let product of products) {
      const inventoryItem = await BuyerInventory.findById(product.productId);

      if (!inventoryItem) {
        return res.status(404).json({ error: `Product not found: ${product.productId}` });
      }

      const totalPrice = product.quantity * inventoryItem.price;
      updatedProducts.push({
        productId: inventoryItem._id,
        productName: inventoryItem.productName,
        pricePerKg: inventoryItem.price,
        quantity: product.quantity,
        totalPrice,
      });

      totalAmount += totalPrice;
    }

    const cart = await Cart.findOneAndUpdate(
      { customerId, buyerId },
      { customerId, buyerId, products: updatedProducts, totalAmount },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get cart by cart ID or customer email and buyer email
export const getCart = async (req, res) => {
    try {
      const { cartId, customerId, buyerId } = req.params;
  
      let cart;
      if (cartId) {
        cart = await Cart.findById(cartId).populate('products.productId');
      } else if (customerId && buyerId) {
        const decodedCustomerId = decodeURIComponent(customerId);
        const decodedBuyerId = decodeURIComponent(buyerId);
        cart = await Cart.findOne({
          customerId: decodedCustomerId,
          buyerId: decodedBuyerId
        }).populate('products.productId');
      }
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      res.status(200).json(cart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

  // Remove product from cart by cart ID or customer email and buyer email
  export const removeProductFromCart = async (req, res) => {
    try {
      const { cartId, customerId, buyerId, productId } = req.params;
  
      let cart;
      if (cartId) {
        cart = await Cart.findById(cartId);
      } else if (customerId && buyerId) {
        const decodedCustomerId = decodeURIComponent(customerId);
        const decodedBuyerId = decodeURIComponent(buyerId);
        cart = await Cart.findOne({ customerId: decodedCustomerId, buyerId: decodedBuyerId });
      }
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      const productIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );
  
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found in cart' });
      }
  
      cart.products.splice(productIndex, 1);
      cart.totalAmount = cart.products.reduce((sum, product) => sum + product.totalPrice, 0);
      await cart.save();
  
      res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

  export const checkoutCart = async (req, res) => {
    try {
      const { customerId, buyerId } = req.body; // Changed from buyerId
      const cart = await Cart.findOne({ customerId, buyerId });
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      // Perform checkout logic (e.g., order creation, payment processing)
      res.status(200).json({ message: 'Checkout successful', cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };

  
  