// ...existing code...
import express from "express";
import Joi from "joi";
import {
  createReview,
  getUserReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { createReviewSchema, updateReviewSchema } from "../validation/schema.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

const idParamSchema = Joi.object({
  reviewId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().message("Invalid review id"),
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().message("Invalid user id"),
});

// Create review (protected, rate-limited, validated)
router.post("/", protect, authLimiter, validateBody(createReviewSchema), asyncHandler(createReview));

// Get reviews for a user (public but validate param)
router.get("/user/:userId", validateParams(Joi.object({ userId: idParamSchema.extract('userId') || Joi.string().regex(/^[0-9a-fA-F]{24}$/) })), asyncHandler(getUserReviews));

// Update review (protected, rate-limited, validated)
router.put("/:reviewId", protect, authLimiter, validateParams(Joi.object({ reviewId: idParamSchema.extract('reviewId') || Joi.string().regex(/^[0-9a-fA-F]{24}$/) })), validateBody(updateReviewSchema), asyncHandler(updateReview));

// Delete review (protected, rate-limited)
router.delete("/:reviewId", protect, authLimiter, validateParams(Joi.object({ reviewId: idParamSchema.extract('reviewId') || Joi.string().regex(/^[0-9a-fA-F]{24}$/) })), asyncHandler(deleteReview));

export default router;
