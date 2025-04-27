import cOrder from '../models/cOrderModel.js';
import Cart from '../models/cCartModel.js';

const isValidDate = (date) => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const orderDate = new Date(date);
  return orderDate >= threeMonthsAgo && orderDate <= new Date();
};

export const createOrderFromCart = async (req, res) => {
  try {
    const { customerName, customerAddress, customerContactNumber, customerEmail, paymentOption, cartId, orderDate, customerId, buyerId, products } = req.body;

    if (!orderDate || !isValidDate(orderDate)) {
      return res.status(400).json({ message: 'Order date must be within the last 3 months and not in the future.' });
    }

    const newOrder = new cOrder({
      customerId,
      buyerId,
      customerName,
      customerAddress,
      customerContactNumber,
      customerEmail,
      paymentOption,
      cartId,
      totalAmount: 0, 
      orderDate: new Date(orderDate),
      products,
    });

    const cart = await Cart.findById(cartId).populate('products.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const totalAmount = cart.products.reduce((acc, product) => acc + product.totalPrice, 0);
    newOrder.totalAmount = totalAmount;

    await newOrder.save();

    return res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await cOrder.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch order details'
    });
  }
};

// Get all orders of a specific customer
export const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const orders = await cOrder.find({ customerId }).populate('products.productId');
    
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for this customer.'
      });
    }

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders'
    });
  }
};


