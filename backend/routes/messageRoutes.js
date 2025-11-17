import express from "express";
import { 
  addMessage, 
  getMessages, 
  getUnreadCount, 
  getUnreadMessagesByConversation,
  clearChat
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addMessage);
router.get("/:conversationId", protect, getMessages);

router.get("/unread/count", protect, getUnreadCount);
router.get("/unread/by-conversation", protect, getUnreadMessagesByConversation);

router.delete("/:conversationId/clear", protect, clearChat);

export default router;