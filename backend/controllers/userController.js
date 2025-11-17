import cloudinary from 'cloudinary';
import User from "../models/User.js";
import Property from "../models/Property.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import bcrypt from "bcryptjs";
import { sendPasswordChangeConfirmationEmail } from "../services/emailSendgrid.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ 
        message: "User not found. Account may have been deleted.",
        userDeleted: true 
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
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

    if (profilePic && profilePic !== user.profilePic && user.profilePic && user.profilePic.includes('cloudinary')) {
      try {
        const publicIdMatch = user.profilePic.match(/\/matestay\/profiles\/([^/.]+)/);
        if (publicIdMatch && publicIdMatch[1]) {
          await cloudinary.v2.uploader.destroy(`matestay/profiles/${publicIdMatch[1]}`);
        }
      } catch (cloudinaryError) {
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
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(500).json({ message: "Server error while updating profile." });
  }
};

export const getPublicUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { location, maxBudget, gender, budget } = req.query;
    const query = { profileSetupComplete: true };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (maxBudget) {
      query.budget = { $lte: Number(maxBudget) };
    } else if (budget) {
      query.budget = { $lte: Number(budget) };
    }
    if (gender && gender !== 'Any') {
      query.gender = gender;
    }

    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getFeaturedUsers = async (req, res) => {
  try {
    const { location } = req.query;
    const match = { profileSetupComplete: true };
    if (location) {
      match.location = { $regex: location, $options: 'i' };
    }
    const users = await User.aggregate([
      { $match: match },
      { $sample: { size: 6 } },
      { $project: { password: 0 } }
    ]);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { gender, location, budget } = req.query;
    const query = { profileSetupComplete: true };

    if (gender && gender !== 'Any') {
      query.gender = gender;
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (budget) {
      query.budget = { $lte: Number(budget) };
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCloudinaryImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ message: "Public ID is required" });
    }
    await cloudinary.uploader.destroy(`matestay/profiles/${publicId}`);
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete image" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isAdmin) {
      return res.status(403).json({ message: "Admin accounts cannot be deleted" });
    }

    if (user.profilePic && user.profilePic.includes('cloudinary')) {
      try {
        const publicIdMatch = user.profilePic.match(/\/matestay\/profiles\/([^/.]+)/);
        if (publicIdMatch && publicIdMatch[1]) {
          await cloudinary.v2.uploader.destroy(`matestay/profiles/${publicIdMatch[1]}`);
        }
      } catch (cloudinaryError) {
      }
    }

    await Property.deleteMany({ lister: userId });
    const userConversations = await Conversation.find({ members: userId });
    const conversationIds = userConversations.map(c => c._id);

    if (conversationIds.length > 0) {
      await Message.deleteMany({ conversationId: { $in: conversationIds } });
    }
    await Conversation.deleteMany({ _id: { $in: conversationIds } });
    await User.findByIdAndDelete(userId);

    res.json({ message: "Account and all associated data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting account" });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Old and new passwords are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters long." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    sendPasswordChangeConfirmationEmail(user.email, user.name)
      .then(() => console.log("✅ Password change confirmation sent to:", user.email))
      .catch((error) => console.error("❌ SendGrid error (password change confirm):", error));

    res.status(200).json({ message: "Password changed successfully." });

  } catch (error) {
    console.error("❌ Change Password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};