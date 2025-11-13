import express from "express";
import { 
  addMessage, 
  getMessages, 
  getUnreadCount, 
  getUnreadMessagesByConversation 
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addMessage);
router.get("/:conversationId", protect, getMessages);

//: Routes for unread messages
router.get("/unread/count", protect, getUnreadCount);
router.get("/unread/by-conversation", protect, getUnreadMessagesByConversation);

export default router;