import React, { useState, useEffect } from "react";
import { Star, Filter } from "lucide-react";
import { reviewsApi } from "../../services/reviewApi";
import ReviewForm from "./ReviewForm";
import EnhancedReviewCard from "./EnhancedReviewCard";

const ReviewsSection = ({ productId, className = "" }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await reviewsApi.getByProductId(productId);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await reviewsApi.getStats(productId);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleReviewSubmitted = () => {
    loadReviews();
    loadStats();
    setShowForm(false);
  };

  const sortedAndFilteredReviews = reviews
    .filter((review) => {
      if (filterRating === "all") return true;
      return review.rating === parseInt(filterRating);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "helpful":
          return (b.helpful_count || 0) - (a.helpful_count || 0);
        default:
          return 0;
      }
    });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Reviews Header */}

      {/* Rating Breakdown */}
      {stats && stats.totalReviews > 0 && (
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
          {/* Overall Rating */}
          <div className="text-center lg:text-left">
            <div className="text-4xl font-semibold text-gray-900 mb-1">
              {stats.averageRating}
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">
              {renderStars(Math.round(stats.averageRating))}
            </div>
            <div className="text-sm text-gray-600">
              {stats.totalReviews.toLocaleString()} Ratings &<br />
              {stats.totalReviews.toLocaleString()} Reviews
            </div>
          </div>

          {/* Rating Bars */}
          <div className="flex-1 max-w-md space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingCounts[rating] || 0;
              const percentage = (count / stats.totalReviews) * 100;

              return (
                <div key={rating} className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 w-8">
                    <span className="font-medium">{rating}</span>
                    <Star
                      size={12}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        rating >= 4 ? 'bg-green-700' :
                        rating === 3 ? 'bg-green-600' :
                        rating === 2 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-gray-600 w-16 text-right">
                    {count.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Write Review Button */}
          <div className="flex justify-center lg:justify-end lg:items-start">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Write Review
            </button>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          productId={productId}
          onReviewSubmitted={handleReviewSubmitted}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedAndFilteredReviews.length > 0 ? (
          sortedAndFilteredReviews.map((review) => (
            <EnhancedReviewCard key={review.id} review={review} />
          ))
        ) : reviews.length > 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No reviews match your current filters.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600 mb-4">
              Be the first to review this book!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Write the first review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
