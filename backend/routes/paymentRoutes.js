import express from "express";
import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  checkSubscription,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/history", protect, getPaymentHistory);
router.get("/subscription-status", protect, checkSubscription);

export default router;