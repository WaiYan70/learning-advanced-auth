import { userModel } from "../models/user.model.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      userData: {
        name: user.name,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
