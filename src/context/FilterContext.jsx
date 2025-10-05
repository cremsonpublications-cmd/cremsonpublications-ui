import React, { createContext, useContext, useState, useMemo } from 'react';

const FilterContext = createContext();

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    categories: [],
    authors: [],
    classes: [],
    priceRange: { min: 0, max: 1000 },
    status: [],
    sortBy: 'most-popular'
  });

  // Update specific filter
  const updateFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Toggle array-based filters (categories, authors, etc.)
  const toggleArrayFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      categories: [],
      authors: [],
      classes: [],
      priceRange: { min: 0, max: 1000 },
      status: [],
      sortBy: 'most-popular'
    });
  };

  // Clear specific filter
  const clearFilter = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: Array.isArray(prev[filterType]) ? [] :
                   filterType === 'priceRange' ? { min: 0, max: 1000 } :
                   'most-popular'
    }));
  };

  // Filter products based on current filters
  const filterProducts = (products) => {
    return products.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.categories?.name)) {
        return false;
      }

      // Author filter
      if (filters.authors.length > 0 && !filters.authors.includes(product.author)) {
        return false;
      }

      // Classes filter
      if (filters.classes.length > 0 && !filters.classes.includes(product.classes)) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(product.status)) {
        return false;
      }

      return true;
    });
  };

  // Sort products based on sortBy filter
  const sortProducts = (products) => {
    const sortedProducts = [...products];

    switch (filters.sortBy) {
      case 'low-price':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'high-price':
        return sortedProducts.sort((a, b) => b.price - a.price);
      case 'newest':
        return sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest':
        return sortedProducts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'name-asc':
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      case 'most-popular':
      default:
        return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  };

  // Get filtered and sorted products
  const getFilteredProducts = (products) => {
    const filtered = filterProducts(products);
    return sortProducts(filtered);
  };

  // Extract unique values from products for dynamic filter options
  const getFilterOptions = (products) => {
    const categories = [...new Set(products.map(p => p.categories?.name).filter(Boolean))];
    const authors = [...new Set(products.map(p => p.author).filter(Boolean))];
    const classes = [...new Set(products.map(p => p.classes).filter(Boolean))];
    const statuses = [...new Set(products.map(p => p.status).filter(Boolean))];

    const prices = products.map(p => p.price).filter(Boolean);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      categories,
      authors,
      classes,
      statuses,
      priceRange: { min: minPrice, max: maxPrice }
    };
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.categories.length > 0 ||
           filters.authors.length > 0 ||
           filters.classes.length > 0 ||
           filters.status.length > 0 ||
           filters.priceRange.min > 0 ||
           filters.priceRange.max < 1000;
  }, [filters]);

  const value = {
    filters,
    updateFilter,
    toggleArrayFilter,
    clearFilters,
    clearFilter,
    filterProducts,
    sortProducts,
    getFilteredProducts,
    getFilterOptions,
    hasActiveFilters
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};