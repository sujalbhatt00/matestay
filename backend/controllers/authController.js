import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail, sendPasswordChangeConfirmationEmail } from "../services/emailSendgrid.js";

export const register = async (req, res) => {
  try {
    console.log("🔵 Registration attempt:", { email: req.body.email, name: req.body.name });
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
    });

    const savedUser = await newUser.save();
    console.log("✅ User saved to database:", savedUser._id);

    const verifyUser = await User.findById(savedUser._id);
    if (!verifyUser) {
      console.error("❌ CRITICAL: User not found after save!");
      return res.status(500).json({ 
        message: "Failed to create account. Please try again." 
      });
    }
    console.log("✅ User verified in database:", verifyUser._id);

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    
    sendVerificationEmail(email, name, verificationUrl)
      .then(() => console.log("✅ Verification email sent via SendGrid to:", email))
      .catch(async (emailError) => {
        console.error("❌ SendGrid error:", emailError);
        await User.findByIdAndDelete(savedUser._id);
        console.log("🔄 User deleted due to email failure");
      });

    res.status(201).json({ 
      message: "Registration successful! Please check your email to verify your account.",
      email: email
    });

  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    console.log("🔵 Email verification attempt with token:", req.query.token);
    
    const { token } = req.query;

    if (!token) {
      console.log("❌ No token provided");
      return res.status(400).json({ message: "Verification token is required" });
    }

    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      console.log("❌ Invalid token - no user found");
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    if (user.verified) {
      console.log("⚠️ Email already verified:", user.email);
      return res.status(200).json({ message: "Email already verified! You can now log in." });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    const verifiedUser = await User.findById(user._id);
    if (!verifiedUser.verified) {
      console.error("❌ CRITICAL: Verification not saved!");
      return res.status(500).json({ message: "Verification failed. Please try again." });
    }

    console.log("✅ Email verified successfully:", user.email);
    res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("❌ Verification error:", error);
    res.status(500).json({ message: "Server error during email verification" });
  }
};

export const login = async (req, res) => {
  try {
    console.log("🔵 Login attempt:", req.body.email);
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing credentials");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const dbCheck = await User.findById(user._id);
    if (!dbCheck) {
      console.error("❌ CRITICAL: User exists in query but not in DB!");
      return res.status(500).json({ message: "Account error. Please contact support." });
    }

    if (!user.verified) {
      console.log("⚠️ Email not verified:", email);
      return res.status(403).json({ 
        message: "Please verify your email before logging in. Check your inbox for the verification link.",
        needsVerification: true,
        email: user.email
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      profilePic: user.profilePic || "",
      isAdmin: user.isAdmin || false,
      isPremium: user.isPremium || false,
      subscriptionTier: user.subscriptionTier || "free",
      subscriptionEndDate: user.subscriptionEndDate || null,
      profileSetupComplete: user.profileSetupComplete || false,
    };

    console.log("✅ Login successful:", email);
    return res.status(200).json({ 
      message: "Login successful",
      token, 
      user: safeUser 
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

export const resendVerification = async (req, res) => {
  try {
    console.log("🔵 Resend verification request:", req.body.email);
    
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(404).json({ message: "User not found with this email" });
    }

    if (user.verified) {
      console.log("⚠️ Email already verified:", email);
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    
    sendVerificationEmail(email, user.name, verificationUrl)
      .then(() => console.log("✅ Verification email resent via SendGrid to:", email))
      .catch((error) => console.error("❌ Resend verification error (SendGrid):", error));

    res.status(200).json({ 
      message: "Verification email resent successfully. Please check your inbox." 
    });
  } catch (error) {
    console.error("❌ Resend verification error:", error);
    res.status(500).json({ message: "Failed to resend verification email" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("🔵 Forgot Password: Email not found (but sending 200).");
      return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    sendPasswordResetEmail(user.email, user.name, resetLink)
      .then(() => console.log("✅ Password reset email sent to:", user.email))
      .catch((error) => console.error("❌ SendGrid error (forgot password):", error));
    
    res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });

  } catch (error) {
    console.error("❌ Forgot Password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and new password are required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return res.status(400).json({ message: "Invalid token." });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.verificationToken = undefined;
    await user.save();

    sendPasswordChangeConfirmationEmail(user.email, user.name)
      .then(() => console.log("✅ Password change confirmation sent to:", user.email))
      .catch((error) => console.error("❌ SendGrid error (password change confirm):", error));

    res.status(200).json({ message: "Password reset successful. You can now log in." });

  } catch (error) {
    console.error("❌ Reset Password error:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "Password reset link has expired. Please request a new one." });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: "Invalid password reset link." });
    }
    res.status(500).json({ message: "Server error" });
  }
};