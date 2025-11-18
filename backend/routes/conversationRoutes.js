import express from "express";
import Joi from "joi";
import {
  newConversation,
  getConversations,
  deleteConversation,
} from "../controllers/conversationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateParams } from "../middleware/validate.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

const idParamSchema = Joi.object({
  conversationId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid conversation id" }),
});

// Create conversation (protected, rate-limited)
router.post("/", protect, authLimiter, asyncHandler(newConversation));

// List conversations for current user (protected, rate-limited)
router.get("/", protect, authLimiter, asyncHandler(getConversations));

// Delete a conversation (protected, rate-limited, validated param)
router.delete(
  "/:conversationId",
  protect,
  authLimiter,
  validateParams(idParamSchema),
  asyncHandler(deleteConversation)
);

export default router;