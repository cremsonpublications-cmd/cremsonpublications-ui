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
    sub_categories: [],
    authors: [],
    classes: [],
    editions: [],
    priceRange: { min: 0, max: 10000 },
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
      sub_categories: [],
      authors: [],
      classes: [],
      editions: [],
      priceRange: { min: 0, max: 10000 },
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

  // Calculate product price with discounts
  const calculateProductPrice = (product) => {
    const mrp = product.mrp || 0;
    let finalPrice = mrp;

    if (product.has_own_discount && product.own_discount_percentage) {
      finalPrice = mrp - (mrp * product.own_discount_percentage / 100);
    } else if (product.use_category_discount && product.categories) {
      const category = product.categories;
      if (category.offer_type === 'percentage' && category.offer_percentage) {
        finalPrice = mrp - (mrp * category.offer_percentage / 100);
      } else if (category.offer_type === 'flat_amount' && category.offer_amount) {
        finalPrice = mrp - category.offer_amount;
      }
    }

    return Math.max(0, Math.round(finalPrice));
  };

  // Filter products based on current filters
  const filterProducts = (products) => {
    return products.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.categories?.main_category_name)) {
        return false;
      }

      // Sub-category filter
      if (filters.sub_categories.length > 0) {
        const productSubCategories = product.sub_categories || [];
        const hasMatchingSubCategory = filters.sub_categories.some(filterSub => 
          productSubCategories.includes(filterSub)
        );
        if (!hasMatchingSubCategory) {
          return false;
        }
      }

      // Author filter
      if (filters.authors.length > 0 && !filters.authors.includes(product.author)) {
        return false;
      }

      // Classes filter - product.classes is an array
      if (filters.classes.length > 0) {
        const productClasses = product.classes || [];
        const hasMatchingClass = filters.classes.some(filterClass => 
          productClasses.includes(filterClass)
        );
        if (!hasMatchingClass) {
          return false;
        }
      }

      // Edition filter
      if (filters.editions.length > 0 && !filters.editions.includes(product.edition)) {
        return false;
      }

      // Price range filter - use calculated price
      const productPrice = calculateProductPrice(product);
      if (productPrice < filters.priceRange.min || productPrice > filters.priceRange.max) {
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

    // Helper function to check if product is available (not sold out)
    const isAvailable = (product) => product.status !== "Out of Stock";

    // Helper function to check if product has valid pricing
    const hasPricing = (product) => product.mrp && product.mrp > 0;

    // Helper function to get product priority for sorting
    const getProductPriority = (product) => {
      if (hasPricing(product) && isAvailable(product)) return 1; // Highest priority: with MRP & available
      if (product.status === "Out of Stock") return 2; // Medium priority: sold out
      if (!hasPricing(product) && isAvailable(product)) return 3; // Lowest priority: no MRP but available
      return 4; // Fallback
    };

    switch (filters.sortBy) {
      case 'low-price':
        return sortedProducts.sort((a, b) => {
          // First sort by priority: MRP products, then sold out, then no MRP
          const priorityA = getProductPriority(a);
          const priorityB = getProductPriority(b);
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          // Then sort by price within same priority group
          const priceA = calculateProductPrice(a);
          const priceB = calculateProductPrice(b);
          return priceA - priceB;
        });
      case 'high-price':
        return sortedProducts.sort((a, b) => {
          // First sort by priority: MRP products, then sold out, then no MRP
          const priorityA = getProductPriority(a);
          const priorityB = getProductPriority(b);
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          // Then sort by price within same priority group
          const priceA = calculateProductPrice(a);
          const priceB = calculateProductPrice(b);
          return priceB - priceA;
        });
      case 'newest':
        return sortedProducts.sort((a, b) => {
          // First sort by priority: MRP products, then sold out, then no MRP
          const priorityA = getProductPriority(a);
          const priorityB = getProductPriority(b);
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          // Then sort by creation date within same priority group
          return new Date(b.created_at) - new Date(a.created_at);
        });
      case 'oldest':
        return sortedProducts.sort((a, b) => {
          // First sort by priority: MRP products, then sold out, then no MRP
          const priorityA = getProductPriority(a);
          const priorityB = getProductPriority(b);
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          // Then sort by creation date within same priority group
          return new Date(a.created_at) - new Date(b.created_at);
        });
      case 'name-asc':
        return sortedProducts.sort((a, b) => {
          // First sort by priority: MRP products, then sold out, then no MRP
          const priorityA = getProductPriority(a);
          const priorityB = getProductPriority(b);
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          // Then sort by name within same priority group
          return a.name.localeCompare(b.name);
        });
      case 'name-desc':
        return sortedProducts.sort((a, b) => {
          // First sort by priority: MRP products, then sold out, then no MRP
          const priorityA = getProductPriority(a);
          const priorityB = getProductPriority(b);
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          // Then sort by name within same priority group
          return b.name.localeCompare(a.name);
        });
      case 'most-popular':
      default:
        return sortedProducts.sort((a, b) => {
          // First sort by priority: MRP products, then sold out, then no MRP
          const priorityA = getProductPriority(a);
          const priorityB = getProductPriority(b);
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          // Then sort by rating within same priority group
          return (b.rating || 0) - (a.rating || 0);
        });
    }
  };

  // Get filtered and sorted products
  const getFilteredProducts = (products) => {
    const filtered = filterProducts(products);
    return sortProducts(filtered);
  };

  // Extract unique values from products for dynamic filter options
  const getFilterOptions = (products) => {
    const categories = [...new Set(products.map(p => p.categories?.main_category_name).filter(Boolean))];
    const authors = [...new Set(products.map(p => p.author).filter(Boolean))];
    
    // Extract all unique sub-categories from all products
    const allSubCategories = products.flatMap(p => p.sub_categories || []);
    const sub_categories = [...new Set(allSubCategories)].filter(Boolean);
    
    // Extract all unique classes from all products
    const allClasses = products.flatMap(p => p.classes || []);
    const classes = [...new Set(allClasses)].filter(Boolean);
    
    // Extract unique editions
    const editions = [...new Set(products.map(p => p.edition).filter(Boolean))];
    
    const statuses = [...new Set(products.map(p => p.status).filter(Boolean))];

    // Calculate prices with discounts
    const prices = products.map(p => calculateProductPrice(p)).filter(Boolean);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000;

    return {
      categories,
      sub_categories,
      authors,
      classes,
      editions,
      statuses,
      priceRange: { min: minPrice, max: maxPrice }
    };
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.categories.length > 0 ||
           filters.sub_categories.length > 0 ||
           filters.authors.length > 0 ||
           filters.classes.length > 0 ||
           filters.editions.length > 0 ||
           filters.status.length > 0 ||
           filters.priceRange.min > 0 ||
           filters.priceRange.max < 10000;
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