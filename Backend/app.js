import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import biRoutes from "./routes/biRoutes.js"; // Buyer Inventory routes
import userRouter from "./routes/userRouter.js";
import nfRouter from "./routes/nfRoutes.js";
import cors from "cors"; // Enable Cross-Origin Resource Sharing
import jwt from "jsonwebtoken";
import path from "path"; // Path utilities


import staffRouter from "./routes/staffRoutes.js";
import productRouter from "./routes/productRouter.js";
import inquiryRouter from "./routes/inquiryRouter.js";

dotenv.config();

const app = express();

app.use(cors()); // Enable CORS for all routes

app.use(bodyParser.json());
app.use((req, res, next) => {
  let token = req.header("Authorization");
  if (token != null) {
    token = token.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (!error) {
        req.user = decoded;
      }
    });
  }
  next();
});

// Serve static files for uploaded images
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

let mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

app.use("/api/users", userRouter);
app.use("/api/newsFeed", nfRouter);
app.use("/api/inventory", biRoutes); // Buyer Inventory API routes
app.use("/api/staff", staffRouter);
app.use("/api/products",productRouter);
app.use("/api/inquiries",inquiryRouter);



app.listen(3000, () => {
  console.log("Server is runing on port 3000");
});
