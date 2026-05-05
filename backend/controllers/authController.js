import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangeConfirmationEmail,
} from "../services/emailSendgrid.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(`📝 Registration attempt for: ${email}`);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists (including unverified)
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.verified) {
      console.log(`⚠️ User already exists and verified: ${email}`);
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // If unverified user exists, delete them to allow re-registration
    if (existingUser && !existingUser.verified) {
      await User.deleteOne({ email });
      console.log(`🗑️ Deleted unverified user: ${email}`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    console.log(`🔐 Hashed password and generated verification token for: ${email}`);

    // SEND EMAIL FIRST - before creating user
    try {
      await sendVerificationEmail(email, name, verificationUrl);
      console.log(`✅ Verification email sent successfully to: ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', {
        email,
        error: emailError.message,
        fullError: emailError
      });
      return res.status(500).json({ 
        message: "Failed to send verification email. Please check that the email is correct and try again.",
        error: emailError.message,
        details: "This usually happens due to Brevo API issues. Please contact support if the problem persists."
      });
    }

    // Only create user if email is sent successfully
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
    });

    await newUser.save();
    console.log(`👤 New user created: ${email}`);

    return res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      email,
      nextStep: "Check your email for a verification link. The link will expire in 24 hours."
    });
  } catch (error) {
    console.error("❌ Registration error:", {
      message: error.message,
      email: req.body.email,
      stack: error.stack.split('\n').slice(0, 3).join('\n')
    });
    return res.status(500).json({ message: "Server error during registration. Please try again later." });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    if (user.verified) {
      return res.status(200).json({ message: "Email already verified! You can now log in." });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ message: "Server error during email verification" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "This account uses Google sign-in. Please continue with Google." });
    }

    if (!user.verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        needsVerification: true,
        email: user.email,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        profilePic: user.profilePic || "",
        phone: user.phone || "",
        gender: user.gender || "",
        age: user.age || null,
        location: user.location || "",
        budget: user.budget || null,
        occupation: user.occupation || "",
        lifestyle: user.lifestyle || [],
        bio: user.bio || "",
        lookingFor: user.lookingFor || "Any",
        smokingPreference: user.smokingPreference || "Any",
        sleepSchedule: user.sleepSchedule || "Any",
        cleanlinessLevel: user.cleanlinessLevel || "Any",
        isAdmin: user.isAdmin || false,
        isPremium: user.isPremium || false,
        subscriptionTier: user.subscriptionTier || "free",
        subscriptionEndDate: user.subscriptionEndDate || null,
        profileSetupComplete: user.profileSetupComplete || false,
        averageRating: user.averageRating || 0,
        totalReviews: user.totalReviews || 0,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    sendVerificationEmail(email, user.name, verificationUrl).catch((error) => {
      console.error('❌ Failed to send verification email:', error.message);
    });

    return res.status(200).json({
      message: "Verification email resent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({ message: "Failed to resend verification email" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    sendPasswordResetEmail(user.email, user.name, resetLink).catch((error) => {
      console.error('❌ Failed to send password reset email:', error.message);
    });

    return res.status(200).json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password error:", error);
    return res.status(500).json({ message: "Server error" });
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
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.verificationToken = undefined;
    await user.save();

    sendPasswordChangeConfirmationEmail(user.email, user.name).catch((error) => {
      console.error('❌ Failed to send password confirmation email:', error.message);
    });

    return res.status(200).json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Password reset link has expired." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid password reset link." });
    }
    return res.status(500).json({ message: "Server error" });
  }
};
