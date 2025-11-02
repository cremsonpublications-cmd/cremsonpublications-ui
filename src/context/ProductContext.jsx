import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Cache duration: 10 minutes for products, 30 minutes for categories
  const PRODUCT_CACHE_DURATION = 10 * 60 * 1000;
  const CATEGORY_CACHE_DURATION = 30 * 60 * 1000;

  // Fetch categories from Supabase with caching
  const fetchCategories = async (forceRefresh = false) => {
    // Check cache validity for categories
    if (!forceRefresh && lastFetched && categories.length > 0 && 
        (Date.now() - lastFetched) < CATEGORY_CACHE_DURATION) {
      return categories;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('main_category_name', { ascending: true });

      if (error) {
        throw error;
      }

      setCategories(data || []);
      return data || [];
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
      return [];
    }
  };

  // Fetch products from Supabase with caching
  const fetchProducts = async (forceRefresh = false) => {
    // Check cache validity for products
    if (!forceRefresh && lastFetched && products.length > 0 && 
        (Date.now() - lastFetched) < PRODUCT_CACHE_DURATION) {
      return products;
    }

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

      if (error) {
        throw error;
      }

      setProducts(data || []);
      setLastFetched(Date.now());
      return data || [];
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
      return [];
    }
  };

  // Fetch products by category
  const fetchProductsByCategory = async (categoryId) => {
    try {
      setLoading(true);
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

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products by category:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get product by ID
  const getProductById = (productId) => {
    return products.find(product => product.id === productId);
  };

  // Search products
  const searchProducts = async (searchTerm) => {
    try {
      setLoading(true);
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

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err) {
      setError(err.message);
      console.error('Error searching products:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchProducts()]);
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  // Refresh methods
  const refreshProducts = () => fetchProducts(true);
  const refreshCategories = () => fetchCategories(true);
  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([refreshCategories(), refreshProducts()]);
    setLoading(false);
  };

  // Get cached data info
  const getCacheInfo = () => ({
    lastFetched,
    productsCount: products.length,
    categoriesCount: categories.length,
    isProductsCacheValid: lastFetched && (Date.now() - lastFetched) < PRODUCT_CACHE_DURATION,
    isCategoriesCacheValid: lastFetched && (Date.now() - lastFetched) < CATEGORY_CACHE_DURATION
  });

  const value = {
    // Data
    categories,
    products,
    loading,
    error,
    lastFetched,
    
    // Methods
    fetchCategories,
    fetchProducts,
    fetchProductsByCategory,
    getProductById,
    searchProducts,
    refreshProducts,
    refreshCategories,
    refreshAll,
    getCacheInfo,
    setError,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};