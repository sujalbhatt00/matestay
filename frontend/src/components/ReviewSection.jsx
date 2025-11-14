import React, { useState, useEffect } from 'react';
import axios from '@/api/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Star, Loader2, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';

const defaultAvatar = 'https://i.imgur.com/6VBx3io.png';

const ReviewSection = ({ userId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/reviews/user/${userId}`);
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
      setTotalReviews(res.data.totalReviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to leave a review');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('/reviews', {
        revieweeId: userId,
        rating,
        comment,
      });
      toast.success('Review submitted successfully');
      setShowReviewForm(false);
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await axios.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const renderStars = (count, interactive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <Star
          key={index}
          className={`h-5 w-5 cursor-pointer transition-colors ${
            starValue <= (interactive ? hoveredRating || rating : count)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
          onClick={interactive ? () => setRating(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
        />
      );
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const canReview = user && user._id !== userId;
  const hasReviewed = reviews.some((r) => r.reviewer._id === user?._id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Reviews ({totalReviews})</h3>
          {totalReviews > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">{renderStars(Math.round(averageRating))}</div>
              <span className="text-lg font-semibold">{averageRating}</span>
              <span className="text-muted-foreground">out of 5</span>
            </div>
          )}
        </div>

        {canReview && !hasReviewed && (
          <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
            <DialogTrigger asChild>
              <Button>Write a Review</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>Share your experience with this user</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-1">{renderStars(rating, true)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Comment</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {500 - comment.length} characters remaining
                  </p>
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No reviews yet. Be the first to review!
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => {
            // ✅ Check if current user can delete this review
            const canDelete = user && (
              review.reviewer._id === user._id || // User's own review
              user.isAdmin // Admin can delete any review
            );

            return (
              <Card key={review._id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 flex-1">
                      <Avatar>
                        <AvatarImage src={review.reviewer.profilePic || defaultAvatar} />
                        <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold">{review.reviewer.name}</span>
                          <div className="flex">{renderStars(review.rating)}</div>
                          {/* ✅ Show admin badge if reviewer is admin */}
                          {review.reviewer._id === user?._id && user.isAdmin && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    </div>
                    
                    {/* ✅ Show delete button for own reviews and admins */}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReview(review._id)}
                        title={user.isAdmin && review.reviewer._id !== user._id 
                          ? "Delete as Admin" 
                          : "Delete your review"
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReviewSection;