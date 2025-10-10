import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCoupons } from '../services/couponService';

const CouponContext = createContext();

export const useCoupons = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
};

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  // Fetch all coupons - get ALL data once, filter locally
  const fetchCoupons = async (forceRefresh = false) => {
    // Check if we have cached data and it's still valid
    if (!forceRefresh && lastFetched && (Date.now() - lastFetched) < CACHE_DURATION && coupons.length > 0) {
      return coupons;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch ALL coupon data at once (including inactive ones)
      const allCoupons = await getCoupons(false); // Get all coupons
      
      // Filter locally for UI display (active + show_in_ui = true + not expired)
      const activeCoupons = allCoupons.filter(coupon => 
        coupon.is_active && 
        coupon.show_in_ui && 
        (!coupon.valid_until || new Date(coupon.valid_until) > new Date())
      );
      
      setCoupons(allCoupons); // Store all coupons for validation
      setSelectedCoupons(activeCoupons); // Store filtered coupons for UI
      setLastFetched(Date.now());
      
      console.log('CouponContext: Fetched coupons:', {
        allCoupons: allCoupons.length,
        activeCoupons: activeCoupons.length,
        activeCouponsData: activeCoupons
      });
      
      return allCoupons;
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError(err.message || 'Failed to fetch coupons');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get available coupons (selected/active only)
  const getAvailableCoupons = () => {
    return selectedCoupons;
  };

  // Get all coupons (including inactive)
  const getAllCoupons = () => {
    return coupons;
  };

  // Validate a coupon using cached data (frontend validation)
  const validateCouponCode = async (couponCode, orderAmount) => {
    try {
      // Ensure we have coupon data loaded
      if (coupons.length === 0) {
        await fetchCoupons();
      }

      // Find coupon in cached data
      const coupon = coupons.find(c => 
        c.code.toUpperCase() === couponCode.toUpperCase()
      );

      if (!coupon) {
        return { valid: false, message: 'Invalid coupon code' };
      }

      // Check if coupon is active
      if (!coupon.is_active) {
        return { valid: false, message: 'This coupon is no longer active' };
      }

      // Check if coupon is expired (only if valid_until is set)
      if (coupon.valid_until && new Date(coupon.valid_until) <= new Date()) {
        return { valid: false, message: 'This coupon has expired' };
      }

      // Check minimum order amount
      if (coupon.minimum_order_amount && orderAmount < coupon.minimum_order_amount) {
        return {
          valid: false,
          message: `Minimum order amount of ₹${coupon.minimum_order_amount} required`
        };
      }

      // Calculate discount based on type
      let discountAmount = 0;
      let discountDisplay = '';

      if (coupon.discount_type === 'percentage') {
        discountAmount = Math.min(
          (orderAmount * coupon.discount_value) / 100, 
          coupon.max_discount_amount || Infinity
        );
        discountDisplay = `${coupon.discount_value}% (₹${discountAmount.toFixed(2)})`;
      } else {
        discountAmount = coupon.discount_value;
        discountDisplay = `₹${discountAmount}`;
      }

      return {
        valid: true,
        coupon: coupon,
        discount: discountAmount,
        discountDisplay: discountDisplay,
        message: `Coupon applied! You saved ${discountDisplay}`
      };
    } catch (err) {
      console.error('Error validating coupon:', err);
      return {
        valid: false,
        message: 'Error validating coupon code'
      };
    }
  };

  // Check if there are any available coupons for UI display (show_in_ui = true)
  const hasAvailableCoupons = () => {
    return selectedCoupons.length > 0;
  };

  // Check if there are any valid coupons for manual entry (including show_in_ui = false)
  const hasValidCoupons = () => {
    return coupons.filter(coupon => 
      coupon.is_active && 
      (!coupon.valid_until || new Date(coupon.valid_until) > new Date())
    ).length > 0;
  };

  // Get coupon by code
  const getCouponByCode = (code) => {
    return coupons.find(coupon => coupon.code === code);
  };

  // Get best offer percentage for display
  const getBestOfferPercentage = () => {
    if (selectedCoupons.length === 0) return 0;
    
    const maxDiscount = Math.max(...selectedCoupons.map(coupon => {
      if (coupon.discount_type === 'percentage') {
        return coupon.discount_value;
      } else {
        // For fixed amount, assume it's equivalent to ~10% for display
        return Math.min(coupon.discount_value / 10, 50);
      }
    }));
    
    return Math.round(maxDiscount);
  };

  // Refresh coupons data
  const refreshCoupons = () => {
    return fetchCoupons(true);
  };

  // Initial fetch on mount
  useEffect(() => {
    console.log('CouponContext: Initial fetch starting...');
    fetchCoupons();
  }, []);

  const value = {
    // Data
    coupons,
    selectedCoupons,
    loading,
    error,
    lastFetched,
    
    // Methods
    fetchCoupons,
    getAvailableCoupons,
    getAllCoupons,
    validateCouponCode,
    hasAvailableCoupons,
    hasValidCoupons,
    getCouponByCode,
    getBestOfferPercentage,
    refreshCoupons
  };

  return (
    <CouponContext.Provider value={value}>
      {children}
    </CouponContext.Provider>
  );
};

export default CouponContext;
