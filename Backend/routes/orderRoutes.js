import express from "express";
import { createCheckoutSession } from "../controllers/orderController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();
router.post("/create-checkout-session", authenticateUser, createCheckoutSession);
export default router;
