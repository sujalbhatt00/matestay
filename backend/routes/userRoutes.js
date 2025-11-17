import express from "express";
import {
  updateProfile,
  getUserProfile,
  getPublicUserProfile,
  searchUsers,
  getFeaturedUsers,
  deleteAccount,
  deleteCloudinaryImage,
  getAllUsers, 
  changePassword
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/featured", getFeaturedUsers);
router.get("/public-profile/:userId", getPublicUserProfile);
router.get("/search-public", searchUsers);


router.put("/update", protect, updateProfile);
router.get("/profile", protect, getUserProfile);
router.get("/search", protect, searchUsers);
router.delete("/delete-account", protect, deleteAccount);
router.post("/delete-cloudinary-image", protect, deleteCloudinaryImage);
router.get("/all", protect, getAllUsers);

router.put("/update-password", protect, changePassword);


export default router;