import express from "express";
import {
  register,
  login,
  logout,
  sendVerifyOTP,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
} from "../controllers/auth.controller.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);

authRouter.get("/is-auth", userAuth, isAuthenticated);

authRouter.post("/send-verify-otp", userAuth, sendVerifyOTP);
authRouter.post("/verify-email", userAuth, verifyEmail);

export default authRouter;
