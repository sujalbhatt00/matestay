import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

// Add a new message with premium check
export const addMessage = async (req, res) => {
  const { conversationId, text } = req.body;
  const senderId = req.user.id;

  try {
    const sender = await User.findById(senderId);
    
    // ✅ UPDATED: Check if user has premium (includes admins who auto-get premium)
    if (!sender.isPremium) {
      const messageCount = await Message.countDocuments({
        conversationId,
        senderId,
      });

      if (messageCount >= 10) {
        return res.status(403).json({ 
          message: "Message limit reached. Upgrade to premium to send unlimited messages.",
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

    const userMessageCount = messages.filter(m => m.senderId.toString() === userId).length;

    res.status(200).json({
      messages,
      userMessageCount,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get unread message count for a user
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      members: userId,
    });

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

    const conversations = await Conversation.find({
      members: userId,
    }).populate("members", "name profilePic");

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