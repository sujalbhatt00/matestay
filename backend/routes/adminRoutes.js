import express from "express";
import {
  getDashboardStats,
  getAllUsersAdmin,
  deleteUserAdmin,
  getAllPropertiesAdmin,
  deletePropertyAdmin,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// All routes require authentication AND admin privileges
router.use(protect, adminMiddleware);

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsersAdmin);
router.delete("/users/:id", deleteUserAdmin);
router.get("/properties", getAllPropertiesAdmin);
router.delete("/properties/:id", deletePropertyAdmin);

export default router;