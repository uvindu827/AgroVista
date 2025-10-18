import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import biRoutes from "./routes/biRoutes.js";
import cartRouter from "./routes/cCartRoutes.js";
import userRouter from "./routes/userRouter.js";
import nfRouter from "./routes/nfRoutes.js";
import cOrderRoutes from "./routes/cOrderRoutes.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";  // ✅ Add this line
import morgan from "morgan";          // ✅ Also missing import
import cookieParser from "cookie-parser"; // ✅ Also missing import

import staffRouter from "./routes/staffRoutes.js";
import productRouter from "./routes/productRouter.js";
import inquiryRouter from "./routes/inquiryRouter.js";

import stripeRoutes from "./routes/stripeRoutes.js";
dotenv.config();

const app = express();

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS with credentials and correct origin
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true,
}));

app.use(morgan("dev"));
app.use(cookieParser());

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Stripe webhook route MUST come BEFORE express.json() middleware
// It needs raw body for signature verification
app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeRoutes
);

// JSON body parser for other routes
app.use(express.json({
  verify: (req, res, buf) => {
    // Keep rawBody for webhook for extra safety (if needed)
    if (req.originalUrl.startsWith("/api/stripe/webhook")) {
      req.rawBody = buf.toString();
    }
  }
}));

// JWT token extraction middleware for all routes except webhook
app.use((req, res, next) => {
  // Don't extract for webhook route (it already got raw body)
  if (req.originalUrl.startsWith("/api/stripe/webhook")) {
    return next();
  }

  const authHeader = req.header("Authorization") || req.header("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // You can populate user in a real app
    } catch (err) {
      // Token invalid or expired — just continue, routes can protect if needed
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
});

// Mount your routes
app.use("/api/users", userRouter);
app.use("/api/newsFeed", nfRouter);
app.use("/api/inventory", biRoutes);
app.use("/api/staff", staffRouter);
app.use("/api/products",productRouter);
app.use("/api/inquiries",inquiryRouter);
app.use('/api/cart', cartRouter);
app.use("/api/orders", cOrderRoutes);  // Mount routes on /api/orders


app.listen(3000, () => {
  console.log("Server is runing on port 3000");
});

