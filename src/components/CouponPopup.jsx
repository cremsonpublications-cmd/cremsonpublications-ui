import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Gift, Percent, Tag } from 'lucide-react';
import { getCoupons } from '../services/couponService';
import { toast } from 'sonner';

const CouponPopup = ({ isOpen, onClose }) => {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadCoupons();
    }
  }, [isOpen]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const coupons = await getCoupons(true); // Only show selected coupons
      setAvailableCoupons(coupons.slice(0, 3)); // Show max 3 coupons
    } catch (error) {
      console.error('Failed to load coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCoupon = async (couponCode) => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopiedCoupon(couponCode);
      toast.success(`Coupon "${couponCode}" copied to clipboard!`);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedCoupon(null), 2000);
    } catch (error) {
      console.error('Failed to copy coupon:', error);
      toast.error('Failed to copy coupon code');
    }
  };

  const getBestOffer = () => {
    if (availableCoupons.length === 0) return '0%';
    
    const maxDiscount = Math.max(...availableCoupons.map(coupon => {
      if (coupon.discount_type === 'percentage') {
        return coupon.discount_value;
      } else {
        // For fixed amount, assume it's equivalent to ~10% for display
        return Math.min(coupon.discount_value / 10, 50);
      }
    }));
    
    return `${Math.round(maxDiscount)}%`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Background with confetti pattern */}
        <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 px-8 pt-12 pb-8">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 left-8 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute top-12 right-12 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <div className="absolute top-20 left-16 w-1 h-4 bg-yellow-400 rotate-45"></div>
            <div className="absolute top-8 right-20 w-4 h-1 bg-red-400 rotate-12"></div>
            <div className="absolute bottom-16 left-4 w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="absolute bottom-12 right-8 w-3 h-1 bg-orange-400 rotate-45"></div>
            <div className="absolute top-16 left-1/2 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
          </div>

          {/* Gift Box Icon */}
          <div className="relative z-10 flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <Gift size={48} className="text-red-500" />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Save up to</h2>
            <div className="text-5xl font-bold text-red-400 mb-2">
              {getBestOffer()}
            </div>
            <p className="text-lg opacity-90">off on your next order</p>
          </div>
        </div>

        {/* Coupons Section */}
        <div className="p-6 bg-white">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading amazing offers...</p>
            </div>
          ) : availableCoupons.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Available Coupons
              </h3>
              {availableCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-purple-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {coupon.discount_type === 'percentage' ? (
                          <Percent size={16} className="text-purple-600" />
                        ) : (
                          <Tag size={16} className="text-green-600" />
                        )}
                        <span className="font-mono font-bold text-lg text-gray-800">
                          {coupon.code}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {coupon.description}
                      </p>
                      <p className="text-xs text-purple-600 font-medium">
                        {coupon.discount_type === 'percentage' 
                          ? `${coupon.discount_value}% OFF` 
                          : `₹${coupon.discount_value} OFF`}
                        {coupon.minimum_order_amount && (
                          ` • Min ₹${coupon.minimum_order_amount}`
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyCoupon(coupon.code)}
                      className={`ml-4 px-4 py-2 rounded-lg font-medium transition-all ${
                        copiedCoupon === coupon.code
                          ? 'bg-green-500 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {copiedCoupon === coupon.code ? (
                        <div className="flex items-center gap-2">
                          <Check size={16} />
                          Copied!
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Copy size={16} />
                          Copy
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Gift size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No coupons available right now</p>
              <p className="text-sm text-gray-500">Check back later for amazing deals!</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {availableCoupons.length > 0 && (
              <button
                onClick={onClose}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                START SHOPPING
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
            >
              NO, THANKS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponPopup;
