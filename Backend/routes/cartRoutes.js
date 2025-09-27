import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();
router.post("/add", authenticateUser, addToCart);
router.get("/", authenticateUser, getCart);
router.delete("/:courseId", authenticateUser, removeFromCart);
export default router;
