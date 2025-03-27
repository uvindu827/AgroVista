import cOrder from '../models/cOrderModel.js';
import Cart from '../models/cCartModel.js';

// Function to check if a date is within the last 3 months
const isValidDate = (date) => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const orderDate = new Date(date);
  return orderDate >= threeMonthsAgo && orderDate <= new Date();
};

export const createOrderFromCart = async (req, res) => {
  try {
    const { customerName, customerAddress, customerContactNumber, customerEmail, paymentOption, cartId, orderDate } = req.body;

    // Validate the orderDate to be within the last 3 months
    if (!orderDate || !isValidDate(orderDate)) {
      return res.status(400).json({ message: 'Order date must be within the last 3 months and not in the future.' });
    }

    // Create the new order
    const newOrder = new cOrder({
      customerName,
      customerAddress,
      customerContactNumber,
      customerEmail,  // Add email to the order
      paymentOption,
      cartId,
      totalAmount: 0, // Placeholder for now
      orderDate: new Date(orderDate),
    });

    // Find the cart by cartId and populate the product details
    const cart = await Cart.findById(cartId).populate('products.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Calculate the total amount from the cart
    const totalAmount = cart.products.reduce((acc, product) => acc + product.totalPrice, 0);

    // Set the total amount in the order
    newOrder.totalAmount = totalAmount;

    // Save the new order to the database
    await newOrder.save();

    // **Do not delete the cart** after placing the order
    // Optionally, you can update the cart's status or flag it as "ordered"
    // cart.status = 'ordered'; 
    // await cart.save();

    // Respond with the new order details
    return res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
