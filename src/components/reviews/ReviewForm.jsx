import React, { useState, useEffect } from "react";
import { Star, Upload, X, Loader2 } from "lucide-react";
import { reviewsApi } from "../../services/reviewApi";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const ReviewForm = ({ productId, onReviewSubmitted, onClose }) => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    rating: 0,
    title: "",
    comment: "",
    verified_purchase: false,
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!isSignedIn) {
      onClose(); // Close the modal first
      navigate('/signin'); // Redirect to sign-in page
      return;
    }

    // Pre-fill form with user data if logged in
    if (user) {
      setFormData(prev => ({
        ...prev,
        user_name: user.fullName || "",
        user_email: user.emailAddresses[0]?.emailAddress || "",
      }));
    }
  }, [user, isSignedIn, navigate, onClose]);

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;

    if (images.length + files.length > maxImages) {
      alert(`You can upload maximum ${maxImages} images`);
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) {
        alert(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...validFiles]);

      // Create previews
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews((prev) => [
            ...prev,
            {
              file,
              url: e.target.result,
              id: Date.now() + Math.random(),
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_name.trim()) {
      newErrors.user_name = "Name is required";
    }

    if (!formData.rating) {
      newErrors.rating = "Please select a rating";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Review comment is required";
    }

    if (formData.user_email && !/\S+@\S+\.\S+/.test(formData.user_email)) {
      newErrors.user_email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrls = [];

      // Step 1: Upload images to Cloudinary first (if any)
      if (images.length > 0) {
        console.log("Uploading images to Cloudinary...");
        imageUrls = await reviewsApi.uploadImagesToCloudinary(images);
        console.log("Images uploaded to Cloudinary:", imageUrls);
      }

      // Step 2: Create review with image URLs
      const reviewData = {
        ...formData,
        product_id: productId,
        imageUrls: imageUrls, // Pass URLs not files
      };

      console.log("Creating review...");
      const newReview = await reviewsApi.create(reviewData);
      console.log("Review created:", newReview);

      // Step 3: Call callback to refresh reviews (this will call get API)
      if (onReviewSubmitted) {
        onReviewSubmitted(newReview);
      }

      // Reset form
      setFormData({
        user_name: "",
        user_email: "",
        rating: 0,
        title: "",
        comment: "",
        verified_purchase: false,
      });
      setImages([]);
      setImagePreviews([]);

      // Close form
      if (onClose) {
        onClose();
      }

      // Success - no alert needed, form will close and reviews will refresh
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render form if user is not signed in
  if (!isSignedIn) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[200] flex items-center justify-center p-4 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Write a Review
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-700 border-gray-300"
                placeholder="Enter your name"
              />
              {errors.user_name && (
                <p className="text-red-500 text-sm mt-1">{errors.user_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                name="user_email"
                value={formData.user_email}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-700 border-gray-300"
                placeholder="Enter your email"
              />
              {errors.user_email && (
                <p className="text-red-500 text-sm mt-1">{errors.user_email}</p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="focus:outline-none transition-colors"
                >
                  <Star
                    size={24}
                    className={`${
                      star <= formData.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    } hover:text-yellow-400 transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating
                  ? `${formData.rating} star${formData.rating > 1 ? "s" : ""}`
                  : "Select rating"}
              </span>
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Title (optional)
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Give your review a title"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.comment ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Share your experience with this book..."
            />
            {errors.comment && (
              <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos (optional)
            </label>
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Upload size={20} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Upload Images (Max 5, 5MB each)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">JPG, PNG, GIF up to 5MB</p>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={preview.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
