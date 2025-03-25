import express from "express";
import { blockOrUnblockUser, getAllUsers, getUser, loginUser, loginWithGoogle, registerUser, sendOTP, verifyOTP } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/",registerUser)

userRouter.post("/login",loginUser)

userRouter.get("/all",getAllUsers)

userRouter.put("/block/:email",blockOrUnblockUser)

userRouter.post("/google",loginWithGoogle)

userRouter.get("/sendOTP",sendOTP)

userRouter.post("/verifyEmail",verifyOTP)

userRouter.get("/",getUser)



export default userRouter;