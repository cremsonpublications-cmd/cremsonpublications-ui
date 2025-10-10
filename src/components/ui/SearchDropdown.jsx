import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const SearchDropdown = ({ className = "", onResultClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { products } = useProducts();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        // Optionally clear search when clicking outside
        // setSearchTerm('');
        // setSearchResults([]);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
        setSearchResults([]);
        setSelectedIndex(-1);
        inputRef.current?.blur();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prev =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
      } else if (event.key === 'Enter' && selectedIndex >= 0) {
        event.preventDefault();
        // Navigate to selected product
        const selectedProduct = searchResults[selectedIndex];
        window.location.href = `/shop/product/${selectedProduct.id}`;
        handleResultClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Calculate product price with discounts (same as ProductCard)
  const calculatePrice = (product) => {
    const mrp = product.mrp || 0;
    let finalPrice = mrp;
    let discountPercentage = 0;

    // Check if product has its own discount
    if (product.has_own_discount && product.own_discount_percentage) {
      discountPercentage = product.own_discount_percentage;
    }
    // Otherwise use category discount if enabled
    else if (product.use_category_discount && product.categories) {
      const category = product.categories;
      if (category.offer_type === "percentage" && category.offer_percentage) {
        discountPercentage = category.offer_percentage;
      } else if (
        category.offer_type === "flat_amount" &&
        category.offer_amount
      ) {
        finalPrice = mrp - category.offer_amount;
        return {
          finalPrice: Math.max(0, finalPrice),
          mrp,
          discountPercentage: 0,
        };
      }
    }

    // Apply percentage discount
    if (discountPercentage > 0) {
      finalPrice = mrp - (mrp * discountPercentage) / 100;
    }

    return {
      finalPrice: Math.round(finalPrice),
      mrp,
      discountPercentage: Math.round(discountPercentage),
    };
  };

  // Search products - comprehensive search across all fields (instant, no debounce)
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = products.filter(product => {
      // Search in all relevant fields
      const searchFields = [
        product.name,
        product.author,
        product.description,
        product.isbn,
        product.publisher,
        product.categories?.main_category_name,
        product.categories?.sub_category_name,
        // Convert numbers to strings for search
        product.mrp?.toString(),
        product.pages?.toString(),
        product.year?.toString(),
      ].filter(Boolean); // Remove null/undefined values

      return searchFields.some(field =>
        field.toLowerCase().includes(searchTermLower)
      );
    }).slice(0, 8); // Limit to 8 results

    setSearchResults(filtered);
    setSelectedIndex(-1);
  }, [searchTerm, products]);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setSearchTerm('');
    setSearchResults([]);
    onResultClick?.();
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          placeholder="Search for products..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-[#F0F0F0] placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors"
            title="Clear search"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {searchTerm.trim() === '' ? (
            <div className="p-4 text-center text-gray-500">
              Start typing to search for books...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No books found for "{searchTerm}"
            </div>
          ) : (
            <div className="py-2">
              <div className="px-3 py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </span>
              </div>
              {searchResults.map((product, index) => {
                const { finalPrice, mrp, discountPercentage } = calculatePrice(product);
                const hasDiscount = finalPrice < mrp;

                return (
                  <Link
                    key={product.id}
                    to={`/shop/product/${product.id}`}
                    onClick={handleResultClick}
                    className={`flex items-center space-x-3 px-3 py-3 transition-colors ${
                      index === selectedIndex ? 'bg-blue-50 border-l-2 border-blue-500' : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={product.main_image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {highlightText(product.name, searchTerm)}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {product.author && (
                          <span>by {highlightText(product.author, searchTerm)}</span>
                        )}
                        {product.author && product.categories?.main_category_name && ' • '}
                        {product.categories?.main_category_name && (
                          <span>{highlightText(product.categories.main_category_name, searchTerm)}</span>
                        )}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-bold text-black">
                          ₹{finalPrice}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{mrp}
                          </span>
                        )}
                        {discountPercentage > 0 && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            -{discountPercentage}%
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.status === 'In Stock'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {searchResults.length >= 8 && (
                <div className="px-3 py-2 border-t border-gray-100">
                  <Link
                    to={`/shop?search=${encodeURIComponent(searchTerm)}`}
                    onClick={handleResultClick}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all results for "{searchTerm}" →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;