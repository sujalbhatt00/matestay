import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    profilePic: { type: String, default: "" },
    phone: { type: String, default: "" },

    // Profile fields
    gender: { 
      type: String, 
      enum: ["Male", "Female", "Non-binary", "Transgender", "Prefer not to say", "Other"] 
    },
    age: { type: Number },
    location: { type: String },
    budget: { type: Number },
    occupation: { type: String },
    lifestyle: [String],
    bio: { type: String, maxlength: 200 },
    profileSetupComplete: { type: Boolean, default: false },
    lookingFor: {
      type: String,
      enum: ["Male", "Female", "Non-binary", "Transgender", "Any", "Other"],
      default: 'Any',
    },

    // ✅ NEW: Review fields
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    // Premium subscription fields
    isPremium: {
      type: Boolean,
      default: false,
    },
    subscriptionTier: {
      type: String,
      default: 'free',
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    paymentGatewayCustomerId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);