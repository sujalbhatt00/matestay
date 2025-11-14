import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    console.log("🔵 Auth middleware: Verifying token");
    
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("❌ Auth middleware: No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔵 Auth middleware: Token decoded, user ID:", decoded.id);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("❌ Auth middleware: User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Auth middleware: User found:", user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


export const protect = verifyToken;