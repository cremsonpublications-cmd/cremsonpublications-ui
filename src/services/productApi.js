import { supabase } from '../lib/supabase';

// Categories API
export const categoriesApi = {
  // Get all categories
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('main_category_name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get category by ID
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },
};

// Products API
export const productsApi = {
  // Get all products
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            main_category_name,
            offer_type,
            offer_percentage,
            offer_amount
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            main_category_name,
            offer_type,
            offer_percentage,
            offer_amount
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get products by category
  getByCategory: async (categoryId) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            main_category_name,
            offer_type,
            offer_percentage,
            offer_amount
          )
        `)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Search products
  search: async (searchTerm) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            main_category_name,
            offer_type,
            offer_percentage,
            offer_amount
          )
        `)
        .or(`name.ilike.%${searchTerm}%, description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Get featured products
  getFeatured: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            main_category_name,
            offer_type,
            offer_percentage,
            offer_amount
          )
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  // Get products with discount
  getOnSale: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            main_category_name,
            offer_type,
            offer_percentage,
            offer_amount
          )
        `)
        .or('discount_percentage.gt.0, discount_amount.gt.0')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products on sale:', error);
      throw error;
    }
  },
};