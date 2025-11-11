import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// Create or return existing conversation
export const newConversation = async (req, res) => {
  const senderId = req.user.id; // from authMiddleware
  const { receiverId } = req.body;

  if (!receiverId) {
    return res.status(400).json({ message: "Receiver ID is required." });
  }

  // --- FIX: Prevent self-conversation ---
  if (senderId === receiverId) {
    return res.status(400).json({ message: "You cannot create a conversation with yourself." });
  }

  try {
    // Check if a conversation already exists between these two users
    const existingConvo = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    }).populate("members", "name profilePic");

    if (existingConvo) {
      return res.status(200).json(existingConvo);
    }

    // If not, create a new one
    const newConvo = new Conversation({
      members: [senderId, receiverId],
    });

    const savedConvo = await newConvo.save();
    const populatedConvo = await Conversation.findById(savedConvo._id).populate(
      "members",
      "name profilePic"
    );

    res.status(201).json(populatedConvo);
  } catch (error) {
    console.error("Error in newConversation:", error);
    res.status(500).json({ message: "Server error while creating conversation." });
  }
};

// Get Conversations for a user
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.user.id] },
    })
      .populate("members", "name profilePic")
      .sort({ updatedAt: -1 });

    // --- FIX: Filter out any potential self-conversations from the results ---
    const validConversations = conversations.filter(c => {
        const otherMembers = c.members.filter(m => m._id.toString() !== req.user.id);
        return otherMembers.length > 0;
    });

    // Add last message to each conversation
    const conversationsWithLastMessage = await Promise.all(
      validConversations.map(async (convo) => {
        const lastMessage = await Message.findOne({
          conversationId: convo._id,
        }).sort({ createdAt: -1 });
        return {
          ...convo.toObject(),
          lastMessage: lastMessage ? lastMessage.text : "No messages yet",
          lastMessageTimestamp: lastMessage ? lastMessage.createdAt : convo.updatedAt,
        };
      })
    );

    // Sort again by the actual last message timestamp
    conversationsWithLastMessage.sort((a, b) => 
        new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp)
    );

    res.status(200).json(conversationsWithLastMessage);
  } catch (error) {
    console.error("Error in getConversations:", error);
    res.status(500).json({ message: "Server error while fetching conversations." });
  }
};