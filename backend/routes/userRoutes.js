import express from "express";
import {
  updateProfile,
  getUserProfile,
  getPublicUserProfile,
  searchUsers,
  getFeaturedUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- PUBLIC ROUTES ---

// Route to get featured users for the homepage
router.get("/featured", getFeaturedUsers);

// Route to get another user's public profile information
router.get("/public-profile/:userId", getPublicUserProfile);


// --- PROTECTED ROUTES (require authentication) ---

// Route to update the logged-in user's profile
router.put("/update", protect, updateProfile);

// Route to get the logged-in user's own profile
router.get("/profile", protect, getUserProfile);

// Route to search for other users (roommates)
router.get("/search", protect, searchUsers);


export default router;