import express from "express";
import Joi from "joi";
import {
  newConversation,
  getConversations,
  deleteConversation
} from "../controllers/conversationController.js";
import { protect } from "../middleware/authMiddleware.js";
import authLimiter from "../middleware/authLimiter.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

// Validate :conversationId param
const idParamSchema = Joi.object({
  conversationId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid conversation id"
    }),
});

// CREATE Conversation (protected + rate limited)
router.post("/", protect, authLimiter, asyncHandler(newConversation));

// GET all conversations of logged-in user
router.get("/", protect, authLimiter, asyncHandler(getConversations));

// DELETE conversation (validate ID)
router.delete(
  "/:conversationId",
  protect,
  authLimiter,
  asyncHandler(async (req, res, next) => {
    const { error } = idParamSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    return deleteConversation(req, res, next);
  })
);

export default router;

