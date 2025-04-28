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
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // sending welcome email
    try {
      const mailOptions = {
        from: process.env.SENDER_EMAIL, // Fallback if env var not set
        to: email,
        subject: "Welcome to Our Platform",
        text: `Hello ${name}, welcome to our platform! Your account has been created successfully.`,
        html: `<h1>Welcome ${name}!</h1><p>Your account has been created successfully.</p>`, // HTML version is good to include
      };

      await transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
    } catch (emailError) {
      // Log email error but don't fail registration
      console.error("Error sending welcome email:", emailError);
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
    res.cookie("auth_token", token, {
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
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.json({ success: false, message: "No auth_token in cookie" });
    }
    // Logout function to clear Cookie
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Log out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
