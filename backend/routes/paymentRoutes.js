import express from "express";
import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  checkSubscription,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateBody } from "../middleware/validate.js";
import { createOrderSchema } from "../validation/schema.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

// Create order (protected, rate-limited, validated)
router.post(
  "/create-order",
  protect,
  authLimiter,
  validateBody(createOrderSchema),
  asyncHandler(createOrder)
);

// Verify payment (protected, rate-limited)
router.post("/verify", protect, authLimiter, asyncHandler(verifyPayment));

// History and subscription status (protected, rate-limited)
router.get("/history", protect, authLimiter, asyncHandler(getPaymentHistory));
router.get("/subscription-status", protect, authLimiter, asyncHandler(checkSubscription));

export default router;