// ...existing code...
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js"; // may throw if misconfigured

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// Register

export const register = async (req, res) => {
  console.log("REGISTER called:", { body: req.body });
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    console.log("REGISTER validation failed:", { name, email, passwordPresent: !!password });
    return res.status(400).json({ message: "Name, email and password required" });
  }

  try {
    let user = await User.findOne({ email });
    console.log("REGISTER findOne result:", !!user);

    if (user) {
      if (user.verified) {
        console.log("REGISTER: user already exists & verified:", email);
        return res.status(400).json({ message: "User with this email already exists and is verified." });
      }

      console.log("REGISTER: user exists but not verified. Attempting resend email:", email);
      try {
        const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const verifyLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;
        await sendEmail(user.email, "Verify Your Email", `Please verify: ${verifyLink}`);
        console.log("REGISTER: resend email success:", email);
        return res.status(200).json({ message: "Verification email resent. Check your inbox." });
      } catch (emailErr) {
        console.error("REGISTER: resend email failed (non-blocking):", emailErr && emailErr.message);
        // Do not treat as server error for registration flow
        return res.status(200).json({ message: "Account exists but verification email failed to send." });
      }
    }

    console.log("REGISTER: creating user:", email);
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashed });
    const saved = await user.save();
    console.log("REGISTER: user saved:", saved._id?.toString() || '<no id>');

    // respond immediately
    res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
      userId: saved._id,
    });

    // send verification email async (errors logged only)
    (async () => {
      try {
        const verificationToken = jwt.sign({ id: saved._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const verifyLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;
        await sendEmail(saved.email, "Verify Your Email", `Welcome ${name}, verify: ${verifyLink}`);
        console.log("REGISTER: async verification email sent to", saved.email);
      } catch (asyncEmailErr) {
        console.error("REGISTER: async email send failed:", asyncEmailErr && asyncEmailErr.message);
      }
    })();
  } catch (err) {
    console.error("REGISTER error:", err && err.stack ? err.stack : err);
    // return error.message (development) so frontend can display reason
    return res.status(500).json({ message: err?.message || "Server error during registration" });
  }
};


// Verify email
export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  console.log("VERIFY called with token:", !!token);
  if (!token) return res.status(400).json({ message: "Verification token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verified) return res.status(200).json({ message: "Email already verified" });

    user.verified = true;
    await user.save();
    console.log("VERIFY: user verified id=", user._id);
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("VERIFY error:", err);
    if (err && err.name === "TokenExpiredError") return res.status(400).json({ message: "Verification token expired" });
    return res.status(400).json({ message: "Invalid verification token" });
  }
};

// Login
export const login = async (req, res) => {
  console.log("LOGIN called:", { body: req.body && { email: req.body.email } });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.verified) return res.status(403).json({ message: "Account not verified. Check your email." });

    const token = signToken(user);

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      profilePic: user.profilePic || "",
    };

    return res.status(200).json({ token, user: safeUser });

  } catch (err) {
    console.error("LOGIN error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};
