import { userModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/mailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    // Before create/register new user, check if that user is already existed or not
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already Existed" });
    }
    // before storing password into database, hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const createNewUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await createNewUser.save();
    // After user created/registered succcessfully, give jwt token with cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // sending welcome email
    try {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to Our H&T Online Shopping!!",
        text: `Hello ${name}, Welcome to our H&T online shopping application! Your Account has been created successfully`,
        html: `<h1>Welcome ${name}</h1><p>Welcome to our H&T online shopping application! Your Account has been created successfully</p>`,
      };
      await transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
    } catch (emailError) {
      console.error(`Error sending welcome email: ${emailError}`);
    }
    return res.json({ success: true, message: "Registered Successful" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and Password are required",
    });
  }
  try {
    // First, find the user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    // if user exist, compare the Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }
    // After user login successful, create and give jwt token with cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, message: "Login Successful" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    // checking condition is for API testing purpose with Postman
    // Checking cookie before hitting logout API endpoint
    const token = req.cookies?.token;
    if (!token) {
      return res.json({ success: false, message: "No auth_token in cookie" });
    }
    // Logout function to clear Cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Log out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Send Verification OTP to User's Email
export const sendVerifyOTP = async (req, res) => {
  try {
    // First, find user and check if user email is verified or not
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.isVerified) {
      return res.json({
        success: false,
        message: "This Account is already verified",
      });
    }
    // setup and save OTP, Token and Token ExpireAt
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verificationOtp = otp;
    user.verificationOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // sending OPT via Email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP, H&T Online Shopping",
      text: `Your OTP is ${otp}, Verify your account using this OTP`,
    };
    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "Verification OTP sent on email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const userId = req.user.id;
  const { otp } = req.body;
  if (!otp) {
    return res.json({
      success: false,
      message: "Missing OTP",
    });
  }
  try {
    // find the userId and check userId, OTP and OTP expiredDate
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User is not found" });
    }
    if (user.verificationOtp === "" || user.verificationOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.verificationOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expire" });
    }
    // save data about isVerified or not, reset otp and otp's expiredDate
    user.isVerified = true;
    user.verificationOtp = "";
    user.verificationOtpExpiresAt = 0;
    await user.save();
    // after saving data, return successful message
    return res.json({ success: true, message: "Email Verify successfully " });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// check the Authenticated API endpoint
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: isAuthenticated });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }
  try {
    // Finding the Email is avaliable or not
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    // if the email is found or avaliable, send otp with given time
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiresAt = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();
    // sending OPT via Email for resetting Password
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP, H&T Online Shopping",
      text: `Your OTP for resetting password is ${otp}. Use this OTP to process with resetting your password`,
    };
    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "Reset Password OTP sent on email",
    });
  } catch {
    return res.json({ success: false, message: error.message });
  }
};

// Reset User Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, Otp and NewPassword are required",
    });
  }
  try {
    // First, find and check the user exist or not
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.resetPasswordOtp === "" || user.resetPasswordOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetPasswordOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }
    // if user exist, hash new Password and insert that data into the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOtp = "";
    user.resetPasswordOtpExpiresAt = 0;
    await user.save();
    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
