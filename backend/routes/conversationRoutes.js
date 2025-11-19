import express from "express";
import {
  newConversation,
  getConversations,
  deleteConversation
} from "../controllers/conversationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, newConversation);

router.get("/", protect, getConversations);

router.delete("/:conversationId", protect, deleteConversation);

export default router
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

// Validate :conversationId param
const idParamSchema = Joi.object({
  conversationId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().message("Invalid conversation id"),
});

// create new conversation (protected, rate-limited)
router.post("/", protect, authLimiter, asyncHandler(newConversation));

// list conversations (protected, rate-limited)
router.get("/", protect, authLimiter, asyncHandler(getConversations));

// delete conversation (protected, rate-limited, validate param)
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
