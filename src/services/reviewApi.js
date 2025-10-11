import { supabase } from '../lib/supabase';

// Reviews API
export const reviewsApi = {
  // Get all reviews for a product
  getByProductId: async (productId) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          review_images (
            id,
            image_url,
            created_at
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Get review statistics for a product
  getStats: async (productId) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId);

      if (error) throw error;

      const reviews = data || [];
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0;

      // Count ratings by star
      const ratingCounts = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
      };

      return {
        totalReviews,
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingCounts,
      };
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  },

  // Upload images to Cloudinary only (Step 1)
  uploadImagesToCloudinary: async (files) => {
    try {
      const { uploadMultipleImagesToCloudinary } = await import('../utils/cloudinaryUpload');

      // Upload all images to Cloudinary and return URLs
      const cloudinaryUrls = await uploadMultipleImagesToCloudinary(files, 'review-images');
      return cloudinaryUrls;
    } catch (error) {
      console.error('Error uploading images to Cloudinary:', error);
      throw error;
    }
  },

  // Create review with image URLs (Step 2)
  create: async (reviewData) => {
    try {
      // Create the review first
      const { data: review, error } = await supabase
        .from('reviews')
        .insert([{
          product_id: reviewData.product_id,
          user_name: reviewData.user_name,
          user_email: reviewData.user_email || null,
          rating: reviewData.rating,
          title: reviewData.title || null,
          comment: reviewData.comment,
          verified_purchase: reviewData.verified_purchase || false,
        }])
        .select()
        .single();

      if (error) throw error;

      // Save image URLs to database if provided
      let images = [];
      if (reviewData.imageUrls && reviewData.imageUrls.length > 0) {
        const imageInserts = reviewData.imageUrls.map(url => ({
          review_id: review.id,
          image_url: url
        }));

        const { data: imageData, error: imageError } = await supabase
          .from('review_images')
          .insert(imageInserts)
          .select();

        if (imageError) throw imageError;
        images = imageData;
      }

      return { ...review, images };
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  // Mark review as helpful
  markHelpful: async (reviewId) => {
    try {
      // Get current helpful count
      const { data: review, error: fetchError } = await supabase
        .from('reviews')
        .select('helpful_count')
        .eq('id', reviewId)
        .single();

      if (fetchError) throw fetchError;

      // Increment helpful count
      const { data, error } = await supabase
        .from('reviews')
        .update({ helpful_count: (review.helpful_count || 0) + 1 })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }
  },

  // Delete a review (admin only)
  delete: async (reviewId) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Get recent reviews for homepage (all products)
  getRecentReviews: async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          products!inner(name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent reviews:', error);
      throw error;
    }
  },

  // Get featured reviews (high rated reviews)
  getFeaturedReviews: async (limit = 6) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          products!inner(name),
          review_images (
            id,
            image_url,
            created_at
          )
        `)
        .gte('rating', 4)
        .order('helpful_count', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured reviews:', error);
      throw error;
    }
  },

  // Admin functions
  admin: {
    // Get all reviews with pagination and filters
    getAllReviews: async (page = 1, limit = 20, filters = {}) => {
      try {
        let query = supabase
          .from('reviews')
          .select(`
            *,
            products!inner(name, main_image),
            review_images (
              id,
              image_url,
              created_at
            )
          `, { count: 'exact' });

        // Apply filters
        if (filters.rating) {
          query = query.eq('rating', filters.rating);
        }
        if (filters.verified_purchase !== undefined) {
          query = query.eq('verified_purchase', filters.verified_purchase);
        }
        if (filters.product_id) {
          query = query.eq('product_id', filters.product_id);
        }
        if (filters.search) {
          query = query.or(`user_name.ilike.%${filters.search}%,comment.ilike.%${filters.search}%,title.ilike.%${filters.search}%`);
        }

        // Pagination
        const offset = (page - 1) * limit;
        query = query.range(offset, offset + limit - 1);

        // Order by created_at descending
        query = query.order('created_at', { ascending: false });

        const { data, error, count } = await query;

        if (error) throw error;

        return {
          reviews: data || [],
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
          currentPage: page,
        };
      } catch (error) {
        console.error('Error fetching all reviews:', error);
        throw error;
      }
    },

    // Update review status or moderate content
    updateReview: async (reviewId, updates) => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .update(updates)
          .eq('id', reviewId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating review:', error);
        throw error;
      }
    },

    // Get review statistics for admin dashboard
    getAdminStats: async () => {
      try {
        const { data: allReviews, error } = await supabase
          .from('reviews')
          .select('rating, created_at, verified_purchase');

        if (error) throw error;

        const totalReviews = allReviews.length;
        const verifiedReviews = allReviews.filter(r => r.verified_purchase).length;
        const averageRating = totalReviews > 0
          ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

        // Reviews in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentReviews = allReviews.filter(r =>
          new Date(r.created_at) > thirtyDaysAgo
        ).length;

        // Rating distribution
        const ratingDistribution = {
          5: allReviews.filter(r => r.rating === 5).length,
          4: allReviews.filter(r => r.rating === 4).length,
          3: allReviews.filter(r => r.rating === 3).length,
          2: allReviews.filter(r => r.rating === 2).length,
          1: allReviews.filter(r => r.rating === 1).length,
        };

        return {
          totalReviews,
          verifiedReviews,
          averageRating: parseFloat(averageRating.toFixed(1)),
          recentReviews,
          ratingDistribution,
        };
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        throw error;
      }
    },

    // Delete review image
    deleteReviewImage: async (imageId) => {
      try {
        // Get image details first
        const { data: image, error: fetchError } = await supabase
          .from('review_images')
          .select('image_url')
          .eq('id', imageId)
          .single();

        if (fetchError) throw fetchError;

        // Extract filename from URL
        const url = new URL(image.image_url);
        const fileName = url.pathname.split('/').pop();

        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('review-images')
          .remove([fileName]);

        if (storageError) throw storageError;

        // Delete from database
        const { error: dbError } = await supabase
          .from('review_images')
          .delete()
          .eq('id', imageId);

        if (dbError) throw dbError;

        return true;
      } catch (error) {
        console.error('Error deleting review image:', error);
        throw error;
      }
    },
  },
};
