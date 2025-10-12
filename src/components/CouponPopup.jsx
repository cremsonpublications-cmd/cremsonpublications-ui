import React, { useState, useEffect } from "react";
import { X, Copy, Check, Gift, Percent, Tag } from "lucide-react";
import { useCoupons } from "../context/CouponContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const CouponPopup = ({ isOpen, onClose }) => {
  const { selectedCoupons, loading: contextLoading } = useCoupons();
  const navigate = useNavigate();
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  useEffect(() => {
    if (isOpen && !contextLoading) {
      setAvailableCoupons(selectedCoupons.slice(0, 3)); // Show max 3 coupons
    }
  }, [isOpen, contextLoading, selectedCoupons]);

  const handleCopyCoupon = async (couponCode) => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopiedCoupon(couponCode);

      // Confetti animation
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#f43f5e"],
      });

      toast.success(`Coupon "${couponCode}" copied to clipboard!`);

      setTimeout(() => {
        onClose();
        setCopiedCoupon(null);
      }, 1000);
    } catch (error) {
      console.error("Failed to copy coupon:", error);
      toast.error("Failed to copy coupon code");
    }
  };

  const getBestOffer = () => {
    if (availableCoupons.length === 0) return "0%";

    const bestCoupon = availableCoupons.reduce((best, coupon) => {
      if (!best) return coupon;

      const currentValue =
        coupon.discount_type === "percentage"
          ? coupon.discount_value
          : coupon.discount_value;

      const bestValue =
        best.discount_type === "percentage"
          ? best.discount_value
          : best.discount_value;

      return currentValue > bestValue ? coupon : best;
    }, null);

    if (!bestCoupon) return "0%";

    return bestCoupon.discount_type === "percentage"
      ? `${Math.round(bestCoupon.discount_value)}%`
      : `₹${bestCoupon.discount_value}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-2 sm:p-4 overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl w-full max-w-[90%] sm:max-w-md mx-auto 
        shadow-2xl overflow-hidden 
        mt-4 mb-20 sm:mt-8 sm:mb-8 
        scale-[0.95] sm:scale-100 transition-transform duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[9999] p-1.5 sm:p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <X size={16} className="sm:w-5 sm:h-5 text-gray-600" />
        </button>

        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-purple-600  via-blue-600 to-purple-800 px-3 sm:px-8 pt-6 sm:pt-12 pb-5 sm:pb-8">
          {/* Decorative Confetti Elements */}
          <div className="absolute inset-0 overflow-hidden ">
            <div className="absolute top-4 left-8 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute top-12 right-12 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <div className="absolute top-20 left-16 w-1 h-4 bg-yellow-400 rotate-45"></div>
            <div className="absolute top-8 right-20 w-4 h-1 bg-red-400 rotate-12"></div>
            <div className="absolute bottom-16 left-4 w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="absolute bottom-12 right-8 w-3 h-1 bg-orange-400 rotate-45"></div>
            <div className="absolute top-16 left-1/2 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
          </div>

          {/* Gift Box Icon */}
          <div className="relative z-10 flex justify-center mb-4 sm:mb-6">
            <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg">
              <Gift size={32} className="sm:w-12 sm:h-12 text-red-500" />
            </div>
          </div>

          {/* Main Header Text */}
          <div className="relative z-10 text-center text-white">
            <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
              Save up to
            </h2>
            <div className="text-3xl sm:text-5xl font-bold text-red-400 mb-1 sm:mb-2">
              {getBestOffer()}
            </div>
            <p className="text-sm sm:text-lg opacity-90">
              off on your next order
            </p>
          </div>
        </div>

        {/* Coupons Section */}
        <div className="p-3 sm:p-6 bg-white">
          {availableCoupons.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
                Available Coupons
              </h3>
              {availableCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 hover:border-purple-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {coupon.discount_type === "percentage" ? (
                          <Percent
                            size={16}
                            className="text-purple-600 shrink-0"
                          />
                        ) : (
                          <Tag size={16} className="text-green-600 shrink-0" />
                        )}
                        <span className="font-mono font-bold text-sm sm:text-lg text-gray-800 truncate">
                          {coupon.code}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">
                        {coupon.description}
                      </p>
                      <p className="text-xs text-purple-600 font-medium">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}% OFF`
                          : `₹${coupon.discount_value} OFF`}
                        {coupon.minimum_order_amount &&
                          ` • Min ₹${coupon.minimum_order_amount}`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyCoupon(coupon.code)}
                      className={`ml-2 sm:ml-4 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-base ${
                        copiedCoupon === coupon.code
                          ? "bg-green-500 text-white"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                      }`}
                    >
                      {copiedCoupon === coupon.code ? (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Check size={14} className="sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Copied!</span>
                          <span className="sm:hidden">✓</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Copy size={14} className="sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Copy</span>
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
              <p className="text-sm text-gray-500">
                Check back later for amazing deals!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
            {availableCoupons.length > 0 && (
              <button
                onClick={() => {
                  onClose();
                  navigate("/shop");
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
              >
                START SHOPPING
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors text-sm sm:text-base"
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
