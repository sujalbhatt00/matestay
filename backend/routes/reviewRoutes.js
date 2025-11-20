import express from "express";
import Joi from "joi";
import {
  createReview,
  getUserReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { generalLimiter } from "../middleware/rateLimiter.js"; // Use a more relaxed limiter
import { validateBody, validateParams } from "../middleware/validate.js";
import { createReviewSchema, updateReviewSchema } from "../validation/schema.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

const userIdParamSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid user id" }),
});

const reviewIdParamSchema = Joi.object({
  reviewId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid review id" }),
});

// Create review (protected, general rate-limited, validated)
router.post("/", protect, generalLimiter, validateBody(createReviewSchema), asyncHandler(createReview));

// Get reviews for a user (public but validate param)
router.get("/user/:userId", validateParams(userIdParamSchema), asyncHandler(getUserReviews));

// Update review (protected, general rate-limited, validated)
router.put(
  "/:reviewId",
  protect,
  generalLimiter,
  validateParams(reviewIdParamSchema),
  validateBody(updateReviewSchema),
  asyncHandler(updateReview)
);

// Delete review (protected, general rate-limited)
router.delete(
  "/:reviewId",
  protect,
  generalLimiter,
  validateParams(reviewIdParamSchema),
  asyncHandler(deleteReview)
);

export default router;