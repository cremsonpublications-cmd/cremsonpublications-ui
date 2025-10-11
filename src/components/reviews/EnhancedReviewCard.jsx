import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, CheckCircle, MoreHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { reviewsApi } from '../../services/reviewApi';

const ImageGallery = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Disable body scroll when image gallery is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[1000] flex items-center justify-center p-4">
      {/* Left Arrow - Desktop: Screen edge, Mobile: Near dots */}
      {images.length > 1 && (
        <button
          onClick={prevImage}
          className="fixed left-4 sm:top-1/2 sm:transform sm:-translate-y-1/2 bottom-16 sm:bottom-auto p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all shadow-lg z-10"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Right Arrow - Desktop: Screen edge, Mobile: Near dots */}
      {images.length > 1 && (
        <button
          onClick={nextImage}
          className="fixed right-4 sm:top-1/2 sm:transform sm:-translate-y-1/2 bottom-16 sm:bottom-auto p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all shadow-lg z-10"
        >
          <ChevronRight size={28} />
        </button>
      )}

      <div className="relative max-w-4xl max-h-full">
        {/* Close Button - Near Image */}
        <button
          onClick={onClose}
          className="absolute -top-5 -right-20 sm:-right-20 -right-5 z-10 p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all shadow-lg"
        >
          <X size={28} />
        </button>

        <div className="relative">
          <img
            src={images[currentIndex].image_url}
            alt={`Review image ${currentIndex + 1}`}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>
      </div>

      {/* Dots Navigation - Outside image container */}
      {images.length > 1 && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex justify-center gap-2 bg-black bg-opacity-30 rounded-full px-4 py-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Image Counter */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-30 rounded-full px-3 py-1">
        {currentIndex + 1} of {images.length}
      </div>
    </div>
  );
};

const EnhancedReviewCard = ({ review, isAdmin = false }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);
  const [showGallery, setShowGallery] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMarkHelpful = async () => {
    if (isHelpful) return; // Prevent multiple clicks

    try {
      setIsUpdating(true);
      await reviewsApi.markHelpful(review.id);
      setIsHelpful(true);
      setHelpfulCount(prev => prev + 1);
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const hasImages = review.review_images && review.review_images.length > 0;

  return (
    <>
      <div className="bg-white border-b border-gray-100 py-4 px-0">
        {/* Top Row - User Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {review.user_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 text-sm">{review.user_name}</span>
              {review.verified_purchase && (
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-0.5">
                {renderStars(review.rating)}
              </div>
              <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
            </div>
          </div>
          {isAdmin && (
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal size={16} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Title */}
        {review.title && (
          <h4 className="font-medium text-gray-900 mb-2 text-sm">{review.title}</h4>
        )}

        {/* Review Content */}
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.comment}</p>

        {/* Images */}
        {hasImages && (
          <div className="mb-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {review.review_images.slice(0, 8).map((image, index) => (
                <div
                  key={image.id}
                  className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer bg-gray-100"
                  onClick={() => setShowGallery(true)}
                >
                  <img
                    src={image.image_url}
                    alt={`Review ${index + 1}`}
                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
              {review.review_images.length > 8 && (
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center cursor-pointer text-xs font-medium text-gray-600"
                  onClick={() => setShowGallery(true)}
                >
                  +{review.review_images.length - 8}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={handleMarkHelpful}
            disabled={isHelpful || isUpdating}
            className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs transition-colors ${
              isHelpful
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <ThumbsUp size={12} className={isHelpful ? 'fill-current' : ''} />
            <span>Helpful ({helpfulCount})</span>
          </button>

          {isAdmin && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>ID: {review.id}</span>
              {review.user_email && (
                <span className="truncate max-w-24">{review.user_email}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && hasImages && (
        <ImageGallery
          images={review.review_images}
          onClose={() => setShowGallery(false)}
        />
      )}
    </>
  );
};

export default EnhancedReviewCard;