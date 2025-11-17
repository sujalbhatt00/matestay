import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import mongoose from 'mongoose'; // Import mongoose

const DAILY_MESSAGE_LIMIT = 15; // Set new limit

// Add a new message with daily premium check
export const addMessage = async (req, res) => {
  const { conversationId, text } = req.body;
  const senderId = req.user.id;

  try {
    const sender = await User.findById(senderId);
    
    if (!sender.isPremium) {
      await sender.checkAndResetDailyCount(); // Check/reset daily count

      if (sender.dailyMessageCount >= DAILY_MESSAGE_LIMIT) {
        return res.status(403).json({ 
          message: "Daily message limit reached. Upgrade to premium for unlimited messages.",
          limitReached: true,
        });
      }
    }

    const newMessage = new Message({
      conversationId,
      senderId,
      text,
      readBy: [senderId],
    });

    const savedMessage = await newMessage.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: Date.now(),
    });

    if (!sender.isPremium) {
      sender.dailyMessageCount += 1;
      await sender.save();
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const messages = await Message.find({
      conversationId,
    });

    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: userId },
        readBy: { $ne: userId },
      },
      {
        $addToSet: { readBy: userId },
      }
    );

    const user = await User.findById(userId);
    if (user) {
      await user.checkAndResetDailyCount();
      const userMessageCount = user.dailyMessageCount; 
      res.status(200).json({
        messages,
        userMessageCount, 
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }

  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --- NEW FUNCTION: Clear all messages in a chat ---
export const clearChat = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      members: { $in: [userId] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found or you are not a member." });
    }

    await Message.deleteMany({ conversationId: conversationId });
    
    await conversation.updateOne({ updatedAt: Date.now() });

    res.status(200).json({ message: "Chat cleared successfully." });

  } catch (error) {
     console.error("Error clearing chat:", error);
     res.status(500).json({ message: "Server error" });
  }
};
// --- END NEW FUNCTION ---

// Get unread message count for a user
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({ members: userId });
    const conversationIds = conversations.map(c => c._id);

    const unreadCount = await Message.countDocuments({
      conversationId: { $in: conversationIds },
      senderId: { $ne: userId },
      readBy: { $ne: userId },
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get unread messages by conversation
export const getUnreadMessagesByConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({ members: userId })
      .populate("members", "name profilePic");

    const unreadByConversation = await Promise.all(
      conversations.map(async (convo) => {
        const unreadCount = await Message.countDocuments({
          conversationId: convo._id,
          senderId: { $ne: userId },
          readBy: { $ne: userId },
        });
        const lastUnreadMessage = await Message.findOne({
          conversationId: convo._id,
          senderId: { $ne: userId },
          readBy: { $ne: userId },
        }).sort({ createdAt: -1 });

        return {
          conversationId: convo._id,
          conversation: convo,
          unreadCount,
          lastUnreadMessage,
        };
      })
    );

    const filteredUnread = unreadByConversation.filter(item => item.unreadCount > 0);
    res.json(filteredUnread);
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};