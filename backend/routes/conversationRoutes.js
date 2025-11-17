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

export default router;