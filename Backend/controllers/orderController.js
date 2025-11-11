import Order from "../models/order.js";
import Product from "../models/product.js";
import { isItFarmer, isItBuyer } from "./userController.js";
import Notification from "../models/notification.js";

export async function createOrder(req, res) {
  try {
  if (process.env.NODE_ENV !== 'production') console.log("Incoming order data:", req.body);

    // Generate new orderId
    const latestOrder = await Order.find().sort({ orderId: -1 }).limit(1);
    let orderId = "ORD0001";

    if (latestOrder.length > 0) {
      const numberString = latestOrder[0].orderId.replace("ORD", "");
      const number = parseInt(numberString);
      const newNumber = (number + 1).toString().padStart(4, "0");
      orderId = "ORD" + newNumber;
    }

    const newOrderData = req.body;
    const newProductArray = [];
    let totalAmount = 0;

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const itemKey = newOrderData.orderedItems[i].key;
      const product = await Product.findOne({ key: itemKey });

      if (!product) {
        return res.status(404).json({
          message: `Product with key ${itemKey} not found`,
        });
      }

      const quantity = parseInt(newOrderData.orderedItems[i].qty) || 0;

      newProductArray.push({
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image[0],
      });

      totalAmount += product.price * quantity;
    }

    // Assign final order details
    newOrderData.orderedItems = newProductArray;
    newOrderData.orderId = orderId;
    newOrderData.email = req.user.email;
    newOrderData.status = "Pending";
    newOrderData.totalAmount = totalAmount;
    newOrderData.date = new Date();

    // Handle buyerInfo
    const buyerInfo = newOrderData.buyerInfo || {};
    newOrderData.name = `${buyerInfo.firstName || ""} ${buyerInfo.lastName || ""}`.trim();
    newOrderData.phone = buyerInfo.phone || "";
    if (!newOrderData.address || newOrderData.address.trim() === "") {
      return res.status(400).json({ message: "Address is required" });
    }

    const order = new Order(newOrderData);
    const savedOrder = await order.save();

    res.json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function getOrders(req, res) {
  try {
    let orders = [];

    if (isItBuyer(req)) {
      orders = await Order.find({ email: req.user.email });
    } else if (isItFarmer(req)) {
      orders = await Order.find({});
    } else {
      return res.status(401).json({ message: "Please login to view orders" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function getQuote(req, res) {
  try {
    const newOrderData = req.body;
    const newProductArray = [];

    let total = 0;
    let labeledTotal = 0;

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const key = newOrderData.orderedItems[i].key;
      const qty = parseInt(newOrderData.orderedItems[i].qty) || 0;

      const product = await Product.findOne({ key });

      if (!product) {
        return res.status(404).json({
          message: `Product with Key ${key} not found`,
        });
      }

      labeledTotal += product.price * qty;
      total += product.price * qty;

      newProductArray.push({
        name: product.name,
        price: product.price,
        labeledPrice: product.price,
        quantity: qty,
        image: product.image[0],
      });
    }

    res.json({
      orderedItems: newProductArray,
      total,
      labeledTotal,
    });
  } catch (error) {
    console.error("Get quote error:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function updateOrder(req, res) {
  if (!isItFarmer(req)) {
    return res.status(403).json({
      message: "Only farmers can update orders",
    });
  }

  try {
    const orderId = req.params.orderId;
    const { notes, status } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { notes, status },
      { new: true }
    );

    // Send notification to buyer
    if (status === "Accepted" || status === "Declined") {
      const message = `Your order ${orderId} has been ${status.toLowerCase()} by the farmer.`;
      const notification = new Notification({
        recipientEmail: order.email,
        message,
      });
      await notification.save();
    }

    res.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ message: error.message });
  }
}
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Course from "../models/Coursemodel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const userId = req.user._id;
  try {
    const cart = await Cart.findOne({ user: userId }).populate("courses");
    if (!cart || cart.courses.length === 0)
      return res.status(400).json({ error: "Cart is empty." });

    const lineItems = cart.courses.map(course => ({
      price_data: {
        currency: "lkr",
        product_data: { name: course.title },
        unit_amount: Math.round(course.price * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/my-courses?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/cart?canceled=true`,
      metadata: {
        userId: userId.toString(),
        courseIds: JSON.stringify(cart.courses.map(c => c._id)),
      },
    });

    await Order.create({
      userId,
      courseIds: cart.courses.map(c => c._id),
      stripeSessionId: session.id,
      status: "pending",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session error:", error.message);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
};
