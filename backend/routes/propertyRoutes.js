import express from "express";
import Joi from "joi";
import {
  createProperty,
  getPropertyById,
  searchProperties,
  getFeaturedProperties,
  getUserProperties,
  updateProperty,
  getPropertyStats,
  deleteProperty,
} from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { generalLimiter } from "../middleware/rateLimiter.js"; // Use a more relaxed limiter
import { validateBody, validateParams } from "../middleware/validate.js";
import { createPropertySchema, updatePropertySchema } from "../validation/schema.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

const idParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid property id" }),
});

// --- Public routes (specific before dynamic) ---
router.get("/search", asyncHandler(searchProperties));
router.get("/featured", asyncHandler(getFeaturedProperties));
router.get("/stats", asyncHandler(getPropertyStats));

// Get single property by id (validate params)
router.get("/:id", validateParams(idParamSchema), asyncHandler(getPropertyById));

// --- Protected routes (general rate-limited) ---
router.get("/my-listings", protect, generalLimiter, asyncHandler(getUserProperties));
router.post("/", protect, generalLimiter, validateBody(createPropertySchema), asyncHandler(createProperty));
router.put(
  "/:id",
  protect,
  generalLimiter,
  validateParams(idParamSchema),
  validateBody(updatePropertySchema),
  asyncHandler(updateProperty)
);
router.delete("/:id", protect, generalLimiter, validateParams(idParamSchema), asyncHandler(deleteProperty));

export default router;