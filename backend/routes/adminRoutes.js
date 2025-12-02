import express from "express";
import Joi from "joi";
import {
  getDashboardStats,
  getAllUsersAdmin,
  deleteUserAdmin,
  getAllPropertiesAdmin,
  deletePropertyAdmin,
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";
import { validateParams } from "../middleware/validate.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

const idParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid id" }),
});

router.use(verifyToken);
router.use(verifyAdmin);

router.get("/stats", asyncHandler(getDashboardStats));
router.get("/users", asyncHandler(getAllUsersAdmin));
router.delete(
  "/users/:id",
  validateParams(idParamSchema),
  asyncHandler(deleteUserAdmin)
);
router.get("/properties", asyncHandler(getAllPropertiesAdmin));
router.delete(
  "/properties/:id",
  validateParams(idParamSchema),
  asyncHandler(deletePropertyAdmin)
);

export default router;
