import User from "../models/User.js";
import Property from "../models/Property.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Review from "../models/Review.js";

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ verified: true });
    const totalProperties = await Property.countDocuments();
    const totalConversations = await Conversation.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalReviews = await Review.countDocuments();

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({
      totalUsers,
      verifiedUsers,
      totalProperties,
      totalConversations,
      totalMessages,
      totalReviews,
      newUsers,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Users
export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete User and All Their Data
export const deleteUserAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Prevent deleting admin accounts
    if (user.isAdmin) {
      return res.status(400).json({ message: "Cannot delete admin accounts" });
    }

    console.log("🧹 Starting cleanup for user:", user.email);

    // Delete user's properties
    await Property.deleteMany({ lister: userId });

    // Find all conversations
    const userConversations = await Conversation.find({ members: userId });
    const conversationIds = userConversations.map(c => c._id);

    // Delete messages
    if (conversationIds.length > 0) {
      await Message.deleteMany({ conversationId: { $in: conversationIds } });
    }

    // Delete conversations
    await Conversation.deleteMany({ _id: { $in: conversationIds } });

    // ✅ Delete reviews written by and about this user
    await Review.deleteMany({ $or: [{ reviewer: userId }, { reviewee: userId }] });
    console.log("✅ Reviews deleted");

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: "User and all associated data deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Properties
export const getAllPropertiesAdmin = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("lister", "name email")
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Property
export const deletePropertyAdmin = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Server error" });
  }
};