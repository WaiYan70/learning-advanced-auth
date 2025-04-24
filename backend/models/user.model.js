import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    name: {
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
    verificationToken: {
      type: String,
      default: "",
    },
    verificationTokenExpiresAt: { type: Date },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordExpiresAt: { type: Date },
  },
  { timestamps: true },
);

export const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);
