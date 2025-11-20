import express from "express";
import Joi from "joi";
import {
  updateProfile,
  getUserProfile,
  getPublicUserProfile,
  searchUsers,
  getFeaturedUsers,
  deleteAccount,
  deleteCloudinaryImage,
  getAllUsers,
  changePassword,
  getProfileViews,
  getUserCount,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { generalLimiter } from "../middleware/rateLimiter.js"; // Use a more relaxed limiter
import { validateBody, validateParams } from "../middleware/validate.js";
import { updateProfileSchema } from "../validation/schema.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

const idParamSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid user id" }),
});

// Public
router.get("/featured", asyncHandler(getFeaturedUsers));
router.get("/public-profile/:userId", validateParams(idParamSchema), asyncHandler(getPublicUserProfile));
router.get("/search-public", asyncHandler(searchUsers));
router.get("/count", asyncHandler(getUserCount));

// Protected (general rate-limited + async wrapper)
router.put("/update", protect, generalLimiter, validateBody(updateProfileSchema), asyncHandler(updateProfile));
router.get("/profile", protect, generalLimiter, asyncHandler(getUserProfile));
router.get("/search", protect, generalLimiter, asyncHandler(searchUsers));
router.delete("/delete-account", protect, generalLimiter, asyncHandler(deleteAccount));
router.post("/delete-cloudinary-image", protect, generalLimiter, asyncHandler(deleteCloudinaryImage));
router.get("/all", protect, generalLimiter, asyncHandler(getAllUsers));
router.put("/update-password", protect, generalLimiter, asyncHandler(changePassword));
router.get("/views", protect, generalLimiter, asyncHandler(getProfileViews));

export default router;