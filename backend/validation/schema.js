import Joi from "joi";

// --- Auth Schemas ---
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const resendSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

// --- Profile Update Schema ---
export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().allow("").optional(),
  age: Joi.number().integer().min(13).optional(),
  gender: Joi.string().valid(
    "Male",
    "Female",
    "Non-binary",
    "Transgender",
    "Prefer not to say",
    "Other"
  ).optional(),
  location: Joi.string().optional(),
  occupation: Joi.string().optional(),
  budget: Joi.number().optional(),
  bio: Joi.string().max(200).allow("").optional(),
  profilePic: Joi.string().uri().optional(),
  lifestyle: Joi.array().items(Joi.string()).optional(),
  lookingFor: Joi.string().valid(
    "Male",
    "Female",
    "Non-binary",
    "Transgender",
    "Any",
    "Other"
  ).optional(),
});

// --- Property Schemas ---
export const createPropertySchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  propertyType: Joi.string().valid("Apartment", "House", "PG", "Hostel", "Other").required(),
  location: Joi.string().required(),
  rent: Joi.number().min(0).required(),
  bedrooms: Joi.number().integer().min(1).max(10).required(),
  bathrooms: Joi.number().integer().min(1).max(10).required(),
  amenities: Joi.array().items(Joi.string()).optional(),
  photos: Joi.array().items(Joi.string().uri()).optional(),
  availableFrom: Joi.date().iso().optional(),
});

export const updatePropertySchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(10).max(1000).optional(),
  propertyType: Joi.string().valid("Apartment", "House", "PG", "Hostel", "Other").optional(),
  location: Joi.string().optional(),
  rent: Joi.number().min(0).optional(),
  bedrooms: Joi.number().integer().min(1).max(10).optional(),
  bathrooms: Joi.number().integer().min(1).max(10).optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  photos: Joi.array().items(Joi.string().uri()).optional(),
  availableFrom: Joi.date().iso().optional(),
});

// --- Message Schema ---
export const addMessageSchema = Joi.object({
  conversationId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid conversation id" }),
  text: Joi.string().min(1).max(2000).required(),
});

// --- Review Schemas ---
export const createReviewSchema = Joi.object({
  revieweeId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid user id" }),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500).required(),
  propertyId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, ""),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().max(500).optional(),
});

// --- Order Schema ---
export const createOrderSchema = Joi.object({
  plan: Joi.string().valid("monthly", "yearly").required(),
});

// --- Conversation Schema ---
export const newConversationSchema = Joi.object({
  receiverId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid receiver id" }),
});