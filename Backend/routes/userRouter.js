import express from "express";
import {
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);

userRouter.post("/login", loginUser);

userRouter.put("/:key", updateUser);

export default userRouter;
