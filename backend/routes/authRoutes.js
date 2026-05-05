import express from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { authLimiter, forgotPasswordLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Email/Password authentication
router.post("/register", authLimiter, asyncHandler(register));
router.post("/login", authLimiter, asyncHandler(login));
router.get("/verify-email", asyncHandler(verifyEmail));
router.post("/resend-verification", authLimiter, asyncHandler(resendVerification));

// Password management
router.post("/forgot-password", forgotPasswordLimiter, asyncHandler(forgotPassword));
router.post("/reset-password/:token", asyncHandler(resetPassword));

// Debug endpoint for testing SendGrid configuration (only in development)
if (process.env.NODE_ENV !== 'production') {
  router.post("/test-email", asyncHandler(async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const { sendVerificationEmail } = await import("../services/emailSendgrid.js");
      await sendVerificationEmail(email, "Test User", `${process.env.CLIENT_URL}/verify-email?token=test123`);
      
      return res.status(200).json({
        message: "Test email sent successfully",
        sentTo: email,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Test email error:", error);
      return res.status(500).json({
        message: "Failed to send test email",
        error: error.message,
        code: error.code,
        status: error.status
      });
    }
  }));

  router.get("/config-status", (req, res) => {
    return res.status(200).json({
      sendgridApiKey: process.env.SENDGRID_API_KEY ? "✅ Configured" : "❌ Not configured",
      emailUser: process.env.EMAIL_USER || "❌ Not configured",
      clientUrl: process.env.CLIENT_URL || "❌ Not configured",
      nodeEnv: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString()
    });
  });
}

export default router;