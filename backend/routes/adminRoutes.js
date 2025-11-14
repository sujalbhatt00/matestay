import express from "express";
import {
  getDashboardStats,
  getAllUsersAdmin,
  deleteUserAdmin,
  getAllPropertiesAdmin,
  deletePropertyAdmin,
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// All routes require authentication and admin privileges
router.use(verifyToken);
router.use(verifyAdmin);

// Dashboard stats
router.get("/stats", getDashboardStats);

// User management
router.get("/users", getAllUsersAdmin);
router.delete("/users/:id", deleteUserAdmin);

// Property management
router.get("/properties", getAllPropertiesAdmin);
router.delete("/properties/:id", deletePropertyAdmin);

export default router;