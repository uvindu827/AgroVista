import Cart from "../models/cartModel.js";
import Course from "../models/Coursemodel.js";

// Add a course to the cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the course is already in cart
    const existingItem = await Cart.findOne({ user: userId, course: courseId });
    if (existingItem) {
      return res.status(400).json({ message: "Course already in cart" });
    }

    // Add to cart
    const newCartItem = new Cart({
      user: userId,
      course: courseId,
    });

    await newCartItem.save();
    res.status(201).json({ message: "Course added to cart", cartItem: newCartItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all cart items for logged-in user
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.find({ user: userId }).populate("course");
    // Log cart items for debugging
    console.log("Cart items for user:", userId, JSON.stringify(cartItems, null, 2));
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove a course from the cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const cartItem = await Cart.findOneAndDelete({ user: userId, course: courseId });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Course removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
