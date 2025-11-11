// Script to migrate cart data from array of courses to single course per cart item
// Run this in your backend environment (Node.js, connected to your MongoDB)

import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI || process.env.MONGO_URL || "mongodb+srv://admin:p1D0PGoOd9g1751v@agrovista.8l8dq.mongodb.net/?retryWrites=true&w=majority&appName=AgroVista";
const cartCollection = "carts"; // Adjust if your collection name is different

const cartSchema = new mongoose.Schema({}, { strict: false });
const Cart = mongoose.model("Cart", cartSchema, cartCollection);

async function migrateCartData() {
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  const carts = await Cart.find({ courses: { $exists: true, $not: { $size: 0 } } });
  let migrated = 0;

  for (const cart of carts) {
    const userId = cart.user;
    for (const courseId of cart.courses) {
      // Create new cart item for each course
      await Cart.create({ user: userId, course: courseId });
      migrated++;
    }
    // Remove the old cart document
    await Cart.deleteOne({ _id: cart._id });
  }

  console.log(`Migrated ${migrated} cart items.`);
  mongoose.disconnect();
}

migrateCartData().catch(console.error);
