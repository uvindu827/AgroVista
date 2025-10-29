import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import biRoutes from "./routes/biRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import userRouter from "./routes/userRouter.js";
import nfRouter from "./routes/nfRoutes.js";
import cOrderRoutes from "./routes/cOrderRoutes.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
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
import diseaseDetectionRoutes from "./routes/diseaseDetectionRoutes.js";
import cropDiseaseRoutes from "./routes/cropDiseaseRoutes.js";
import toolDealerRoutes from "./routes/toolDealerRoutes.js";

dotenv.config();


const app = express();
// Mount low-purchase suggestion route (after app is initialized)
app.use("/api/low-purchase", lowPurchaseRoutes);
app.use("/api/disease-detection", diseaseDetectionRoutes);
// Mount legacy/alternate crop detection route so tools/tests hitting
// /api/detect-crop-disease work (test_detect.mjs expects this).
app.use("/api", cropDiseaseRoutes);

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS with credentials and correct origin
app.use(
  // Configure CORS. Default to the frontend dev server on port 3000 which is the
  // common Create React App dev port. You can override with CLIENT_URL in
  // Backend/.env (for example: CLIENT_URL=http://localhost:3000)
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'production') {
  console.log('CORS allowed origin:', process.env.CLIENT_URL || 'http://localhost:3000');
}

app.use(morgan("dev"));
app.use(cookieParser());

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
      req.user = { id: decoded.userId || decoded._id };
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
app.use("/api/tooldealers", toolDealerRoutes);

// ...existing code...
app.use("/api/orders", cOrderRoutes);

// Also mount userRouter on /api/order for paid-courses endpoint
app.use("/api/order", userRouter);

// Mount course routes
app.use("/api/courses", courseRouter);

// Compatibility endpoint for /api/create-checkout-session (maps to course checkout session)
app.post("/api/create-checkout-session", protect, createCourseCheckoutSession);

// --- MONGOOSE CONNECTION ---
const connectDB = async () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log("Connecting to MongoDB...");
    console.log("MONGO_URI:", process.env.MONGO_URI || process.env.MONGO_URL);
  }
  const mongoURI = process.env.MONGO_URI || process.env.MONGO_URL;
  if (!mongoURI) {
    // Allow running the app without a DB for local testing (e.g. running the detection
    // endpoint and simple integration tests). Log a warning but don't exit.
    console.warn(
      "Warning: MongoDB URI is not defined in .env — skipping DB connection (test mode)"
    );
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (process.env.NODE_ENV !== 'production') {
      console.log(`MongoDB connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // In CI / production we want to fail fast; keep the exit here to surface issues.
    process.exit(1);
  }
};

// Start server after DB connection
const PORT = process.env.PORT || 3000;

// Small health endpoint to help debugging and process managers
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV || 'development',
    port: PORT,
    ml_url: process.env.ML_URL || null,
    client_url: process.env.CLIENT_URL || null,
    time: new Date().toISOString(),
  });
});

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Server is running on port ${PORT}`);
      console.log('ML_URL:', process.env.ML_URL || '(not set)');
      console.log('CLIENT_URL:', process.env.CLIENT_URL || '(not set)');
      console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
    }
  });

  // Graceful shutdown helpers
  const shutdown = (signal) => {
    if (process.env.NODE_ENV !== 'production') console.log(`Received ${signal}. Shutting down server...`);
    server.close(() => {
      if (process.env.NODE_ENV !== 'production') console.log('HTTP server closed. Exiting process.');
      process.exit(0);
    });
    // Force exit after 5s
    setTimeout(() => {
      console.error('Forcing process exit after timeout');
      process.exit(1);
    }, 5000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
});
