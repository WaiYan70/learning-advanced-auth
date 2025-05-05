import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      require: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    // isAccountedVerified
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Verification OTP
    verificationOtp: {
      type: String,
      default: "",
    },
    verificationOtpExpiresAt: {
      type: Number,
      default: 0,
    },
    // Reset Password via OTP
    resetPasswordOtp: {
      type: String,
      default: "",
    },
    resetPasswordOtpExpiresAt: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const userModel = models.user || model("user", userSchema);
