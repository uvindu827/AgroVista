// Global error handlers to ensure all errors are logged
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// Load .env as early as possible so any modules imported afterwards can read process.env
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });

import biRoutes from "./routes/biRoutes.js";
import cartRouter from "./routes/cCartRoutes.js";
import userRouter from "./routes/userRouter.js";
import nfRouter from "./routes/nfRoutes.js";
import cOrderRoutes from "./routes/cOrderRoutes.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import staffRouter from "./routes/staffRoutes.js";
import productRouter from "./routes/productRouter.js";
import inquiryRouter from "./routes/inquiryRouter.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import { createCourseCheckoutSession } from "./controllers/Coursecontroller.js";
import { protect } from "./middleware/auth.js";
import courseRouter from "./routes/CourseRoute.js";
import aiAssistantRoutes from "./routes/aiAssistantRoutes.js";
import lowPurchaseRoutes from "./routes/lowPurchaseRoutes.js";
// Removed crop disease detection feature and unused routes





const app = express();
// Log incoming requests for easier debugging
app.use((req, res, next) => {
  try {
    console.info(`[HTTP] ${req.method} ${req.originalUrl}`);
  } catch (e) {
    // ignore logging failures
  }
  next();
});
// Mount low-purchase suggestion route (after app is initialized)
app.use("/api/low-purchase", lowPurchaseRoutes);
// Crop disease routes removed

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS with credentials and correct origin
// Allow frontend dev (3000) and backend host (3001) plus configured CLIENT_URL
const allowedOrigins = new Set([
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
].filter(Boolean));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow curl/postman
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
}));

app.use(morgan("dev"));
app.use(cookieParser());

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Simple health endpoint for readiness checks — place before static SPA fallback
// so it always returns JSON rather than being served the frontend index.html.
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    time: new Date().toISOString(),
    version: process.env.npm_package_version || null,
  });
});

// Serve frontend production build if it exists (useful for local testing without running dev server)
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
if (fs.existsSync(frontendBuildPath)) {
  console.log('Serving frontend build from', frontendBuildPath);
  app.use(express.static(frontendBuildPath));

  // For any non-API route, serve index.html (SPA fallback)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Stripe webhook route MUST come BEFORE express.json()
app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeRoutes
);

// JSON body parser for other routes
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.startsWith("/api/stripe/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

// JWT middleware
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/stripe/webhook")) return next();

  const authHeader = req.header("Authorization") || req.header("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
});

// Stripe checkout session endpoint (for compatibility)
app.post("/api/create-checkout-session", protect, createCourseCheckoutSession);

// Compatibility endpoint for /api/create-checkout-session (maps to course checkout session)

// Mount routes
app.use("/api/ai-assistant", aiAssistantRoutes);
app.use("/api/users", userRouter);
app.use("/api/newsFeed", nfRouter);
app.use("/api/inventory", biRoutes);
app.use("/api/staff", staffRouter);
app.use("/api/products", productRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/cart", cartRouter);

// Compatibility endpoint for /api/cart/add (maps to createOrUpdateCart)
import { createOrUpdateCart } from "./controllers/cCartController.js";
app.post("/api/cart/add", createOrUpdateCart);
app.use("/api/orders", cOrderRoutes);

// Also mount userRouter on /api/order for paid-courses endpoint
app.use("/api/order", userRouter);

// Mount course routes
app.use("/api/courses", courseRouter);

// Compatibility endpoint for /api/create-checkout-session (maps to course checkout session)
app.post("/api/create-checkout-session", protect, createCourseCheckoutSession);

// --- MONGOOSE CONNECTION ---
const connectDB = async (mongoURI) => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false;
  }
};

// Start server function
const PORT = process.env.PORT || 5000;
import http from 'http';

const startServer = () => {
  const server = http.createServer(app);

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please free the port or set a different PORT environment variable.`);
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });

  // Bind explicitly to 127.0.0.1 for local development
  console.log('Starting server on port', PORT);
  server.listen(PORT, '127.0.0.1', () => {
    const addr = server.address();
    const host = addr && addr.address ? addr.address : '0.0.0.0';
    const port = addr && addr.port ? addr.port : PORT;
    console.log(`Server is running on ${host}:${port}`);
    console.log('Server is listening and ready for requests');
  });
};

// Always require a successful MongoDB connection before starting the server
const mongoURI = process.env.MONGO_URI || process.env.MONGO_URL;
if (!mongoURI) {
  console.error('MONGO_URI/MONGO_URL not set in environment. Exiting.');
  process.exit(1);
}

console.log('Connecting to MongoDB...');
console.log('MONGO_URI:', mongoURI);
connectDB(mongoURI).then((ok) => {
  if (!ok) {
    console.error('Failed to connect to MongoDB. Exiting.');
    process.exit(1);
  }
  startServer();
});
