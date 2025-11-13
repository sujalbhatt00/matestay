import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔵 Auth middleware: Verifying token");
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔵 Auth middleware: Token decoded, user ID:", decoded.id);

      // Check if user still exists in database
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        console.log("❌ Auth middleware: User not found in database:", decoded.id);
        return res.status(404).json({ 
          message: "User not found. Account may have been deleted.",
          userDeleted: true 
        });
      }

      console.log("✅ Auth middleware: User found:", user.email);
      req.user = { id: user._id, isAdmin: user.isAdmin };
      next();
    } catch (error) {
      console.error("❌ Auth middleware error:", error.message);
      return res.status(401).json({ 
        message: "Not authorized, token failed",
        error: error.message 
      });
    }
  } else {
    console.log("❌ Auth middleware: No token provided");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};