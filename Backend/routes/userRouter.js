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
  getUsersByRole
} from "../controllers/userController.js";

const userRouter = express.Router();

// Log the initialization of the router
console.log("Initializing user router");

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
userRouter.get("/getUsersByRole/:role", getUsersByRole); // Define this before the catch-all '/'
userRouter.get("/", getUser); // Catch-all route comes last

export default userRouter;