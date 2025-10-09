import { supabase } from '../lib/supabase';

// Reviews API
export const reviewsApi = {
  // Get all reviews for a product
  getByProductId: async (productId) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
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

  // Add a new review
  create: async (reviewData) => {
    try {
      const { data, error } = await supabase
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
      return data;
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
          products!inner(name)
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
};
