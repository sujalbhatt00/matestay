import express from "express";
import { 
  register, 
  verifyEmail, 
  login, 
  resendVerification,
  forgotPassword, 
  resetPassword 
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", protect, resendVerification);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;