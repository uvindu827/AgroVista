import Course from "../models/Coursemodel.js";
import Stripe from "stripe";
import Order from "../models/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ========================
// Stripe webhook to confirm payment and register course
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = Stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const courseIds = JSON.parse(session.metadata.courseIds);
    const orderId = session.metadata.orderId;

    // Mark order as paid
    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });

    // Register course(s) to user
    const user = await import('../models/user.js').then(m => m.default.findById(userId));
    if (user) {
      for (const courseId of courseIds) {
        if (!user.purchased.includes(courseId)) {
          user.purchased.push(courseId);
        }
        if (!user.registeredCourses.includes(courseId)) {
          user.registeredCourses.push(courseId);
        }
      }
      await user.save();
    }
  }
  res.status(200).json({ received: true });
};
// Create Stripe checkout
// ========================
export const createCourseCheckoutSession = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course || course.deleted) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Allow payment for any course

    // Create order with pending status
    const order = await Order.create({
      userId,
      courses: [courseId],
      amount: course.coursefee,
      paymentStatus: "pending",
    });

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: Math.round(course.coursefee * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/course/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/course/cancel`,
      metadata: {
        userId,
        courseIds: JSON.stringify([courseId]),
        orderId: order._id.toString(),
      },
    });

    // Save Stripe session ID to order
    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ========================
// Low purchase alert logic
// ========================
export const getLowPurchaseCourses = async (req, res) => {
  try {
    const threshold = 3;
    const lowCourses = await Course.find({ deleted: false })
      .populate("coordinator", "name email")
      .lean();

    const result = lowCourses
      .map((c) => ({
        ...c,
        registeredCount: c.registeredUsers ? c.registeredUsers.length : 0,
      }))
      .filter((c) => c.registeredCount < threshold);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================
// CRUD and other functions
// ========================
export const createCourse = async (req, res) => {
  try {
    const { title, description, startingdate, enddate, coursefee, coordinator } = req.body;

    if (!title || !description || !coursefee || !startingdate || !enddate || !coordinator) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const imageUrl = req.file ? req.file.path : "";

    const newCourse = new Course({
      title,
      description,
      startingdate,
      enddate,
      coursefee: Number(coursefee),
      coordinator,
      imageUrl,
      createdBy: req.user._id,
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) updateData.imageUrl = req.file.path;
    if (updateData.coursefee) updateData.coursefee = Number(updateData.coursefee);

    const updated = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: "Course not found" });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    course.deleted = true;
    await course.save();
    res.json({ message: "Course deleted (soft)" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const restoreCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    course.deleted = false;
    await course.save();
    res.json({ message: "Course restored successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ deleted: false })
      .populate("createdBy", "name email")
      .populate("coordinator", "name email");
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("coordinator", "name email");
    if (!course || course.deleted)
      return res.status(404).json({ error: "Course not found" });

    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getPaidCourses = async (req, res) => {
  try {
    const courses = await Course.find({ deleted: false, coursefee: { $gt: 0 } })
      .populate("createdBy", "name email")
      .populate("coordinator", "name email");
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const registerUserToCourse = async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course || course.deleted)
      return res.status(404).json({ error: "Course not found" });

    if (course.registeredUsers.includes(userId)) {
      return res.status(400).json({ message: "User already registered" });
    }

    course.registeredUsers.push(userId);
    await course.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getRegisteredCoursesForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const courses = await Course.find({ registeredUsers: userId, deleted: false })
      .populate("createdBy", "name email")
      .populate("coordinator", "name email");
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
