// controllers/stripeWebhook.js
import Stripe from 'stripe';
import Order from '../models/orderModel.js';
import UserRegisteredCourse from '../models/UserRegisteredCourse.js';

const stripe = new Stripe("your_stripe_secret_key_here");

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = "your_stripe_webhook_secret_here";

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const courseIds = JSON.parse(session.metadata.courseIds || '[]');

    try {
      const order = await Order.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: 'paid' },
        { new: true }
      );

      for (const courseId of courseIds) {
        await UserRegisteredCourse.create({
          userId,
          courseId,
          orderId: order._id,
        });
      }

      console.log("✅ Courses registered for user:", userId);
    } catch (err) {
      console.error("Error registering courses:", err);
    }
  }

  res.status(200).send();
};
