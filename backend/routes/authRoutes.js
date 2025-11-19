import express from "express";
import {
  register,
  verifyEmail,
  login,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateBody } from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  resendSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validation/schema.js";

const router = express.Router();

// Register (rate-limited, validated)
router.post(
  "/register",
  authLimiter,
  validateBody(registerSchema),
  asyncHandler(register)
);

// Login (rate-limited, validated)
router.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  asyncHandler(login)
);

// Verify email (GET with token query)
router.get("/verify-email", asyncHandler(verifyEmail));

// Resend verification (rate-limited, validated, protected)
router.post(
  "/resend-verification",
  authLimiter,
  protect,
  validateBody(resendSchema),
  asyncHandler(resendVerification)
);

// Forgot password (rate-limited, validated)
router.post(
  "/forgot-password",
  authLimiter,
  validateBody(forgotPasswordSchema),
  asyncHandler(forgotPassword)
);

// Reset password (rate-limited, validated)
router.post(
  "/reset-password/:token",
  authLimiter,
  validateBody(resetPasswordSchema),
  asyncHandler(resetPassword)
);

export default router;