import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import mongoose from 'mongoose';

export const newConversation = async (req, res) => {
  const senderId = req.user.id;
  const { receiverId } = req.body;

  if (!receiverId) {
    return res.status(400).json({ message: "Receiver ID is required." });
  }

  if (senderId === receiverId) {
    return res.status(400).json({ message: "You cannot create a conversation with yourself." });
  }

  try {
    let convo = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    })
    .populate("members", "name profilePic")
    .lean();

    if (convo) {
      const lastMessage = await Message.findOne({ conversationId: convo._id }).sort({ createdAt: -1 }).lean();
      convo.lastMessage = lastMessage ? lastMessage.text : "No messages yet";
      convo.lastMessageTimestamp = lastMessage ? lastMessage.createdAt : convo.updatedAt;
      return res.status(200).json(convo);
    }

    const newConvo = new Conversation({
      members: [senderId, receiverId],
    });
    const savedConvo = await newConvo.save();

    let populatedConvo = await Conversation.findById(savedConvo._id)
      .populate("members", "name profilePic")
      .lean();
      
    populatedConvo.lastMessage = "No messages yet";
    populatedConvo.lastMessageTimestamp = populatedConvo.updatedAt;

    res.status(201).json(populatedConvo);
  } catch (error) {
    console.error("Error in newConversation:", error);
    res.status(500).json({ message: "Server error while creating conversation." });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.user.id] },
    })
    .populate("members", "name profilePic")
    .sort({ updatedAt: -1 })
    .lean(); 

    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (convo) => {
        const lastMessage = await Message.findOne({ conversationId: convo._id })
          .sort({ createdAt: -1 })
          .lean();
        
        return {
          ...convo,
          lastMessage: lastMessage ? lastMessage.text : "No messages yet",
          lastMessageTimestamp: lastMessage ? lastMessage.createdAt : convo.updatedAt,
        };
      })
    );

    res.status(200).json(conversationsWithLastMessage);
  } catch (error) {
    console.error("Error in getConversations:", error);
    res.status(500).json({ message: "Server error while fetching conversations." });
  }
};

export const deleteConversation = async (req, res) => {
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

    await Conversation.findByIdAndDelete(conversationId);

    res.status(200).json({ message: "Conversation deleted successfully." });

  } catch (error) {
     console.error("Error deleting conversation:", error);
     res.status(500).json({ message: "Server error" });
  }
};