import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartPopup = ({ isOpen, product, onClose }) => {
  const { incrementQuantity, decrementQuantity, getItemQuantity } = useCart();
  const [autoCloseTimer, setAutoCloseTimer] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const cartQuantity = product ? getItemQuantity(product.id) : 0;

  // Handle show/hide animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10); // Small delay for smooth animation
    } else if (isVisible) {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300); // Wait for animation to complete
    }
  }, [isOpen, isVisible]);

  // Auto-close after 3 seconds of inactivity
  useEffect(() => {
    if (isOpen) {
      // Clear existing timer
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }

      // Set new timer
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      setAutoCloseTimer(timer);

      // Cleanup on unmount or close
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [isOpen, cartQuantity]); // Reset timer when quantity changes

  // Reset timer on user interaction
  const resetTimer = () => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
    }

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    setAutoCloseTimer(timer);
  };

  const handleIncrement = () => {
    if (product) {
      incrementQuantity(product.id, true); // Show popup with updated quantity
      resetTimer();
    }
  };

  const handleDecrement = () => {
    if (product) {
      decrementQuantity(product.id, true); // Show popup with updated quantity
      resetTimer();
    }
  };

  const handleGoToCart = () => {
    onClose();
  };

  if (!isVisible || !product || cartQuantity === 0) return null;

  return (
    <div className={`fixed top-20 right-4 left-4 md:left-auto md:w-80 z-[10000] transition-all duration-300 ease-in-out ${
      isAnimating
        ? 'opacity-100 translate-y-0 scale-100'
        : 'opacity-0 -translate-y-4 scale-95'
    }`}>
      {/* Arrow pointing up to cart */}
      <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45 hidden md:block"></div>

      {/* Popup Content */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden transform transition-all duration-300 backdrop-blur-sm relative"
           style={{ boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)' }}>

        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-800">Added to Cart</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4">
          <div className="flex gap-3">
            {/* Product Image */}
            <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
              <img
                src={product.main_image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              {/* Product Name */}
              <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 leading-tight hover:text-orange-500 transition-colors duration-200 cursor-pointer">
                {product.name}
              </h3>

              {/* Price */}
              <div className="text-lg font-bold text-gray-900 mb-3">
                ₹{product.finalPrice || product.price}
              </div>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={handleDecrement}
                className="px-3 py-2 hover:bg-gray-100 transition-colors border-r border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartQuantity <= 1}
              >
                <Minus size={16} className="text-gray-600" />
              </button>
              <span className="px-4 py-2 text-sm font-semibold text-gray-900 min-w-[3rem] text-center">
                {cartQuantity}
              </span>
              <button
                onClick={handleIncrement}
                className="px-3 py-2 hover:bg-gray-100 transition-colors border-l border-gray-200"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>

            <Link
              to="/cart"
              onClick={handleGoToCart}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ShoppingCart size={16} />
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;