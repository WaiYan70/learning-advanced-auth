import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ success: false, message: "Token not found" });
  }
  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeToken.id) {
      return res.json({ success: false, message: "Token id not found" });
    }
    // Set user ID on req.user object instead of req.body
    req.user = { id: decodeToken.id };
    console.log("req.user: ", req.user);
    console.log("decodeToken.id: ", decodeToken.id);
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export default userAuth;
