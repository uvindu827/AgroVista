// routes/userRouter.js
import express from "express";
import { protect } from "../middleware/auth.js";

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
  getUsersByRole,
  getProfile,
  getPaidCourses,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/all", protect, getAllUsers);
userRouter.put("/block/:email", protect, blockOrUnblockUser);
userRouter.put("/update/:id", protect, updateUser);
userRouter.delete("/delete/:id", protect, deleteUser);
userRouter.put("/profile", protect, updateProfile);
userRouter.delete("/profile", protect, deleteAccount);
userRouter.post("/google", loginWithGoogle);
userRouter.get("/sendOTP", protect, sendOTP);
userRouter.post("/verifyEmail", protect, verifyOTP);
userRouter.get("/getUsersByRole/:role", protect, getUsersByRole);
userRouter.get("/", protect, getUser);
userRouter.get("/profile", protect, getProfile);
userRouter.get("/me", protect, getUser);
userRouter.get("/paid-courses", protect, getPaidCourses);

export default userRouter;
