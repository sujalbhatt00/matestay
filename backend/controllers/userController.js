import cloudinary from 'cloudinary';
import User from "../models/User.js";
import Property from "../models/Property.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- Get Logged-in User's Profile ---
export const getUserProfile = async (req, res) => {
  try {
    console.log("🔵 getUserProfile called for user:", req.user.id);
    
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      console.log("❌ User not found in getUserProfile:", req.user.id);
      return res.status(404).json({ 
        message: "User not found. Account may have been deleted.",
        userDeleted: true 
      });
    }
    
    console.log("✅ User found:", user.email);
    res.json(user);
  } catch (error) {
    console.error("❌ Error in getUserProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --- Update Logged-in User's Profile ---
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log("❌ User not found in updateProfile:", req.user.id);
      return res.status(404).json({ 
        message: "User not found. Account may have been deleted.",
        userDeleted: true 
      });
    }

    const {
      name, phone, gender, age, location,
      budget, occupation, lifestyle, bio, profilePic,
      lookingFor,
    } = req.body;

    // If profile picture is being updated and user has an old one, delete it from Cloudinary
    if (profilePic && profilePic !== user.profilePic && user.profilePic && user.profilePic.includes('cloudinary')) {
      try {
        const publicIdMatch = user.profilePic.match(/\/matestay\/profiles\/([^/.]+)/);
        if (publicIdMatch && publicIdMatch[1]) {
          await cloudinary.v2.uploader.destroy(`matestay/profiles/${publicIdMatch[1]}`);
          console.log("✅ Old profile picture deleted from Cloudinary");
        }
      } catch (cloudinaryError) {
        console.error("⚠️ Failed to delete old image from Cloudinary:", cloudinaryError);
      }
    }

    user.name = name ?? user.name;
    user.gender = gender ?? user.gender;
    user.age = age ?? user.age;
    user.location = location ?? user.location;
    user.budget = budget ?? user.budget;
    user.occupation = occupation ?? user.occupation;
    user.lifestyle = lifestyle ?? user.lifestyle;
    user.profilePic = profilePic ?? user.profilePic;
    user.lookingFor = lookingFor ?? user.lookingFor;

    if (bio !== undefined) {
      user.bio = bio;
    }

    if (phone && phone.trim() !== '') {
      user.phone = phone;
    } else {
      user.phone = undefined;
    }
    
    user.profileSetupComplete = true;

    const updatedUser = await user.save();
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(500).json({ message: "Server error while updating profile." });
  }
};

// --- Get Another User's Public Profile ---
export const getPublicUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching public user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --- Search for Users (Roommates) ---
export const searchUsers = async (req, res) => {
  try {
    const { location, maxBudget, gender, limit } = req.query; 

    const query = {
      profileSetupComplete: true,
      _id: { $ne: req.user.id } 
    };

    // ✅ FIX: Make location optional
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (maxBudget) {
      query.budget = { $lte: Number(maxBudget) };
    }
    if (gender && gender !== 'Any') {
      query.gender = gender;
    }
    
    let userQuery = User.find(query);
    if (limit) {
      userQuery = userQuery.limit(Number(limit));
    }
    
    const users = await userQuery.select("-password"); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- Get Featured Users for Homepage ---
export const getFeaturedUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      { $match: { profileSetupComplete: true } },
      { $sample: { size: 6 } },
      { $project: { password: 0 } }
    ]);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- GET ALL USERS (for Find Roommates page) ---
export const getAllUsers = async (req, res) => {
  try {
    const { gender } = req.query;

    const query = {
      profileSetupComplete: true
      // _id: { $ne: req.user.id } // <-- Removed to include the logged-in user
    };

    if (gender && gender !== 'Any') {
      query.gender = gender;
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --- Delete Cloudinary Image ---
export const deleteCloudinaryImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      return res.status(400).json({ message: "Public ID is required" });
    }

    await cloudinary.uploader.destroy(`matestay/profiles/${publicId}`);
    
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting Cloudinary image:", error);
    res.status(500).json({ message: "Failed to delete image" });
  }
};

// --- Delete User's Own Account ---
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🗑️ Delete account request for user:", userId);
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Prevent admin deletion
    if (user.isAdmin) {
      return res.status(403).json({ message: "Admin accounts cannot be deleted" });
    }

    console.log("🧹 Starting cleanup for user:", user.email);

    // Delete profile picture from Cloudinary
    if (user.profilePic && user.profilePic.includes('cloudinary')) {
      try {
        const publicIdMatch = user.profilePic.match(/\/matestay\/profiles\/([^/.]+)/);
        if (publicIdMatch && publicIdMatch[1]) {
          await cloudinary.v2.uploader.destroy(`matestay/profiles/${publicIdMatch[1]}`);
          console.log("✅ Profile picture deleted from Cloudinary");
        }
      } catch (cloudinaryError) {
        console.error("⚠️ Failed to delete profile picture:", cloudinaryError);
      }
    }

    // Delete user's properties
    const deletedProperties = await Property.deleteMany({ lister: userId });
    console.log(`✅ Deleted ${deletedProperties.deletedCount} properties`);

    // Find all conversations
    const userConversations = await Conversation.find({ members: userId });
    const conversationIds = userConversations.map(c => c._id);
    console.log(`📋 Found ${conversationIds.length} conversations`);

    // Delete messages
    if (conversationIds.length > 0) {
      const deletedMessages = await Message.deleteMany({ conversationId: { $in: conversationIds } });
      console.log(`✅ Deleted ${deletedMessages.deletedCount} messages`);
    }

    // Delete conversations
    const deletedConvos = await Conversation.deleteMany({ _id: { $in: conversationIds } });
    console.log(`✅ Deleted ${deletedConvos.deletedCount} conversations`);

    // Delete user
    await User.findByIdAndDelete(userId);
    console.log("✅ User account deleted successfully");

    res.json({ message: "Account and all associated data deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting account:", error);
    res.status(500).json({ message: "Server error while deleting account" });
  }
};