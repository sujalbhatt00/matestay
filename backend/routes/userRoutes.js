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
import { authLimiter } from "../middleware/rateLimiter.js";
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

// Protected (rate-limited + async wrapper)
router.put("/update", protect, authLimiter, validateBody(updateProfileSchema), asyncHandler(updateProfile));
router.get("/profile", protect, authLimiter, asyncHandler(getUserProfile));
router.get("/search", protect, authLimiter, asyncHandler(searchUsers));
router.delete("/delete-account", protect, authLimiter, asyncHandler(deleteAccount));
router.post("/delete-cloudinary-image", protect, authLimiter, asyncHandler(deleteCloudinaryImage));
router.get("/all", protect, authLimiter, asyncHandler(getAllUsers));
router.put("/update-password", protect, authLimiter, asyncHandler(changePassword));
router.get("/views", protect, authLimiter, asyncHandler(getProfileViews));

export default router;