import Review from "../models/Review.js";
import User from "../models/User.js";

// Helper function to recalculate user's average rating
const updateUserRating = async (userId) => {
  const reviews = await Review.find({ reviewee: userId });
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  await User.findByIdAndUpdate(userId, {
    averageRating: parseFloat(averageRating.toFixed(1)),
    totalReviews,
  });
};

// Create a review
export const createReview = async (req, res) => {
  try {
    const { revieweeId, rating, comment, propertyId } = req.body;
    const reviewerId = req.user.id;

    if (reviewerId === revieweeId) {
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      reviewer: reviewerId,
      reviewee: revieweeId,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this user" });
    }

    const review = new Review({
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating,
      comment,
      propertyId: propertyId || null,
    });

    await review.save();

    // ✅ UPDATE: Recalculate user's average rating
    await updateUserRating(revieweeId);

    // Populate the review before sending
    const populatedReview = await Review.findById(review._id)
      .populate("reviewer", "name profilePic")
      .populate("reviewee", "name");

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error("Error creating review:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this user" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Get reviews for a user
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewee: userId })
      .populate("reviewer", "name profilePic")
      .sort({ createdAt: -1 });

    const user = await User.findById(userId).select("averageRating totalReviews");

    res.json({
      reviews,
      averageRating: user?.averageRating || 0,
      totalReviews: user?.totalReviews || 0,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewer.toString() !== userId) {
      return res.status(403).json({ message: "You can only edit your own reviews" });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    // ✅ UPDATE: Recalculate user's average rating
    await updateUserRating(review.reviewee);

    const populatedReview = await Review.findById(review._id)
      .populate("reviewer", "name profilePic")
      .populate("reviewee", "name");

    res.json(populatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewer.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    const revieweeId = review.reviewee;
    await Review.findByIdAndDelete(reviewId);

    // ✅ UPDATE: Recalculate user's average rating
    await updateUserRating(revieweeId);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
};