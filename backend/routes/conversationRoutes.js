import express from "express";
import Joi from "joi";
import {
  newConversation,
  getConversations,
  deleteConversation,
} from "../controllers/conversationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { generalLimiter } from "../middleware/rateLimiter.js"; // Use a more relaxed limiter
import { validateBody, validateParams } from "../middleware/validate.js";
import { newConversationSchema } from "../validation/schema.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

const convoIdParam = Joi.object({
  conversationId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid conversation id" }),
});

// Create new conversation (protected, general rate-limited, validated)
router.post(
  "/",
  protect,
  generalLimiter,
  validateBody(newConversationSchema),
  asyncHandler(newConversation)
);

// List conversations (protected, general rate-limited)
router.get("/", protect, generalLimiter, asyncHandler(getConversations));

// Delete conversation (protected, general rate-limited, validate param)
router.delete(
  "/:conversationId",
  protect,
  generalLimiter,
  validateParams(convoIdParam),
  asyncHandler(deleteConversation)
);

export default router;