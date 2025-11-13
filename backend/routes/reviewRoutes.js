import express from "express";
import {
  createReview,
  getUserReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/user/:userId", getUserReviews);
router.put("/:reviewId", protect, updateReview);
router.delete("/:reviewId", protect, deleteReview);

export default router;