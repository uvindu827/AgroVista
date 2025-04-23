import express from "express";
import {
  blockOrUnblockUser,
  getAllUsers,
  getUser,
  loginUser,
  loginWithGoogle,
  registerUser,
  sendOTP,
  verifyOTP,
  updateUser,
  deleteUser,
  updateProfile,
  deleteAccount,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/all", getAllUsers);

userRouter.put("/block/:email", blockOrUnblockUser);

userRouter.put("/update/:id", updateUser);

userRouter.delete("/delete/:id", deleteUser);

userRouter.put("/profile", updateProfile);

userRouter.delete("/profile", deleteAccount);

userRouter.post("/google", loginWithGoogle);

userRouter.get("/sendOTP", sendOTP);

userRouter.post("/verifyEmail", verifyOTP);

userRouter.get("/", getUser);

export default userRouter;
