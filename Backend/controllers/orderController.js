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
