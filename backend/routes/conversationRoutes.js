import express from "express";
import Joi from "joi";
import {
  addMessage,
  getMessages,
  getUnreadCount,
  getUnreadMessagesByConversation,
  clearChat,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { addMessageSchema } from "../validation/schema.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

const convoIdParam = Joi.object({
  conversationId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid conversation id" }),
});

// Create message (protected, rate-limited, validated)
router.post(
  "/",
  protect,
  authLimiter,
  validateBody(addMessageSchema),
  asyncHandler(addMessage)
);

// Unread routes (specific routes before dynamic params)
router.get(
  "/unread/count",
  protect,
  authLimiter,
  asyncHandler(getUnreadCount)
);
router.get(
  "/unread/by-conversation",
  protect,
  authLimiter,
  asyncHandler(getUnreadMessagesByConversation)
);

// Clear chat (validate param)
router.delete(
  "/:conversationId/clear",
  protect,
  authLimiter,
  validateParams(convoIdParam),
  asyncHandler(clearChat)
);

// Get messages for a conversation (validate param)
router.get(
  "/:conversationId",
  protect,
  authLimiter,
  validateParams(convoIdParam),
  asyncHandler(getMessages)
);

export default router;