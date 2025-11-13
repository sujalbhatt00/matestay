import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.js";
import User from "../models/User.js";

console.log("🔵 Razorpay Configuration Check:");
console.log("Key ID exists:", !!process.env.RAZORPAY_KEY_ID);
console.log("Key Secret exists:", !!process.env.RAZORPAY_KEY_SECRET);

let razorpay = null;

const initializeRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("❌ Razorpay credentials missing");
    return null;
  }

  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("✅ Razorpay initialized successfully");
    return instance;
  } catch (error) {
    console.error("❌ Failed to initialize Razorpay:", error.message);
    return null;
  }
};

razorpay = initializeRazorpay();

// ✅ UPDATED: New pricing structure
export const createOrder = async (req, res) => {
  try {
    if (!razorpay) {
      razorpay = initializeRazorpay();
      if (!razorpay) {
        return res.status(500).json({ 
          message: "Payment gateway not configured." 
        });
      }
    }

    const { plan } = req.body;
    const userId = req.user.id;

    if (!plan) {
      return res.status(400).json({ message: "Plan is required" });
    }

    // ✅ NEW: Updated pricing
    const pricing = {
      monthly: 1,    // ₹1/month
      yearly: 10,    // ₹10/year
    };

    if (!pricing[plan]) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const amount = pricing[plan] * 100; // Convert to paise

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        plan,
      },
    };

    console.log("📤 Creating Razorpay order:", options);
    const order = await razorpay.orders.create(options);
    console.log("✅ Order created:", order.id);

    const subscriptionEndDate = new Date();
    if (plan === "monthly") {
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    } else {
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
    }

    const payment = new Payment({
      user: userId,
      orderId: order.id,
      amount: amount / 100,
      plan,
      subscriptionEndDate,
      status: "created",
    });

    await payment.save();

    res.json({
      orderId: order.id,
      amount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ 
      message: "Failed to create order", 
      error: error.message 
    });
  }
};

// Verify payment (no changes needed)
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const payment = await Payment.findOne({ orderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = "paid";
    await payment.save();

    const user = await User.findById(userId);
    user.isPremium = true;
    user.subscriptionTier = payment.plan;
    user.subscriptionEndDate = payment.subscriptionEndDate;
    await user.save();

    res.json({
      message: "Payment verified successfully",
      isPremium: true,
      subscriptionEndDate: payment.subscriptionEndDate,
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Check subscription status
export const checkSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.isPremium && user.subscriptionEndDate < new Date()) {
      user.isPremium = false;
      user.subscriptionTier = "free";
      await user.save();
    }

    res.json({
      isPremium: user.isPremium,
      subscriptionTier: user.subscriptionTier,
      subscriptionEndDate: user.subscriptionEndDate,
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    res.status(500).json({ message: "Server error" });
  }
};