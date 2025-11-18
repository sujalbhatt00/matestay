import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().allow("").optional(),
  age: Joi.number().integer().min(13).optional(),
  location: Joi.string().optional(),
  occupation: Joi.string().optional(),
  budget: Joi.number().optional(),
  bio: Joi.string().max(200).allow("").optional(),
  profilePic: Joi.string().uri().optional(),
});

