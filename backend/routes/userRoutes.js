import express from "express";
import {
  updateProfile,
  getUserProfile,
  getPublicUserProfile,
  searchUsers,
  getFeaturedUsers,
  getAllUsers, 
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/featured", getFeaturedUsers);
router.get("/public-profile/:userId", getPublicUserProfile);

// --- PROTECTED ROUTES (require authentication) ---
router.put("/update", protect, updateProfile);
router.get("/profile", protect, getUserProfile);
router.get("/search", protect, searchUsers);

// --- NEW ROUTE TO GET ALL USERS ---
router.get("/all", protect, getAllUsers);

export default router;