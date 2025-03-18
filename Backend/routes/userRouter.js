import express from "express";
import {
  deleteUser,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);

userRouter.post("/login", loginUser);

userRouter.put("/:key", updateUser);

userRouter.delete("/:key", deleteUser);

export default userRouter;
