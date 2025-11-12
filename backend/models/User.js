import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    profilePic: { type: String, default: "" },
    phone: { type: String, default: "" },

    // --- Profile fields ---
    // --- THIS IS THE CHANGE: Expanded gender options ---
    gender: { 
      type: String, 
      enum: ["Male", "Female", "Non-binary", "Transgender", "Prefer not to say", "Other"] 
    },
    // --- END CHANGE ---
    age: { type: Number },
    location: { type: String },
    budget: { type: Number },
    occupation: { type: String },
    lifestyle: [String],
    bio: { type: String, maxlength: 200 },
    profileSetupComplete: { type: Boolean, default: false },

    // --- THIS IS THE CHANGE: New "Looking For" field ---
    lookingFor: {
      type: String,
      enum: ["Male", "Female", "Non-binary", "Transgender", "Any", "Other"],
      default: 'Any',
    },
    // --- END CHANGE ---

    // --- NEW PREMIUM SUBSCRIPTION FIELDS ---
    isPremium: {
      type: Boolean,
      default: false,
    },
    subscriptionTier: { // e.g., 'monthly', 'yearly', 'free'
      type: String,
      default: 'free',
    },
    subscriptionEndDate: {
      type: Date,
      default: null, // Null means no active subscription or never subscribed
    },
    paymentGatewayCustomerId: { // Store customer ID from Stripe/Razorpay etc.
      type: String,
      default: null,
    },
    // --- END NEW FIELDS ---
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);