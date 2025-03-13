import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import nfRouter from "./routes/nfRoutes.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

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

let mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

app.use("/api/users", userRouter);
app.use("/api/newsFeed", nfRouter);

app.listen(3000, () => {
  console.log("Server is runing on port 3000");
});
