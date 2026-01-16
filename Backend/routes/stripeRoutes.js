import express from "express";
import { stripeWebhook } from "../controllers/webhook.js";
import bodyParser from "body-parser";

const router = express.Router();
router.post("/webhook", bodyParser.raw({ type: "application/json" }), stripeWebhook);
export default router;
