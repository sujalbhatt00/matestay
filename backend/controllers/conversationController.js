import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import mongoose from 'mongoose';

// Create or return existing conversation
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
      // If conversation exists, just add the last message info and return
      const lastMessage = await Message.findOne({ conversationId: convo._id }).sort({ createdAt: -1 }).lean();
      convo.lastMessage = lastMessage ? lastMessage.text : "No messages yet";
      convo.lastMessageTimestamp = lastMessage ? lastMessage.createdAt : convo.updatedAt;
      return res.status(200).json(convo);
    }

    // If it doesn't exist, create a new one
    const newConvo = new Conversation({
      members: [senderId, receiverId],
    });
    const savedConvo = await newConvo.save();

    // Populate the newly created conversation
    let populatedConvo = await Conversation.findById(savedConvo._id)
      .populate("members", "name profilePic")
      .lean();
      
    // Add the last message info to match the format of getConversations
    populatedConvo.lastMessage = "No messages yet";
    populatedConvo.lastMessageTimestamp = populatedConvo.updatedAt;

    res.status(201).json(populatedConvo);
  } catch (error) {
    console.error("Error in newConversation:", error);
    res.status(500).json({ message: "Server error while creating conversation." });
  }
};

// Get Conversations for a user (Simplified and Reliable)
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