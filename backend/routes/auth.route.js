import express from "express";
import {
  register,
  login,
  logout,
  sendVerifyOTP,
  verifyEmail,
} from "../controllers/auth.controller.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

userRouter.post("/send-verify-otp", userAuth, sendVerifyOTP);
userRouter.post("/verify-email", userAuth, verifyEmail);

export default userRouter;
