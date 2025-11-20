import express from "express";
import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  checkSubscription,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { generalLimiter } from "../middleware/rateLimiter.js"; // Use a more relaxed limiter
import { validateBody } from "../middleware/validate.js";
import { createOrderSchema } from "../validation/schema.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

// Create order (protected, general rate-limited, validated)
router.post(
  "/create-order",
  protect,
  generalLimiter,
  validateBody(createOrderSchema),
  asyncHandler(createOrder)
);

// Verify payment (protected, general rate-limited)
router.post("/verify", protect, generalLimiter, asyncHandler(verifyPayment));

// History and subscription status (protected, general rate-limited)
router.get("/history", protect, generalLimiter, asyncHandler(getPaymentHistory));
router.get("/subscription-status", protect, generalLimiter, asyncHandler(checkSubscription));

export default router;