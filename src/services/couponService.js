import { supabase } from '../lib/supabase';

// Get all coupons - fetch ALL data, let frontend handle filtering
export const getCoupons = async (showOnlySelected = true) => {
  try {
    // Fetch ALL coupons data (like your curl request)
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('discount_value', { ascending: false });

    if (error) throw error;
    
    // If showOnlySelected is false, return all data
    if (!showOnlySelected) {
      return data || [];
    }
    
    // Filter for UI display (active, valid, and show_in_ui = true)
    const filteredData = (data || []).filter(coupon => 
      coupon.is_active && 
      coupon.show_in_ui && 
      new Date(coupon.valid_until) > new Date()
    );
    
    return filteredData;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

// Validate and apply coupon
export const validateCoupon = async (couponCode, orderAmount) => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .gte('valid_until', new Date().toISOString())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { valid: false, message: 'Invalid coupon code' };
      }
      throw error;
    }

    // Check minimum order amount
    if (data.minimum_order_amount && orderAmount < data.minimum_order_amount) {
      return {
        valid: false,
        message: `Minimum order amount of ₹${data.minimum_order_amount} required`
      };
    }

    // Calculate discount based on type
    let discountAmount = 0;
    let discountDisplay = '';

    if (data.discount_type === 'percentage') {
      discountAmount = Math.min((orderAmount * data.discount_value) / 100, data.max_discount_amount || Infinity);
      discountDisplay = `${data.discount_value}% (₹${discountAmount.toFixed(2)})`;
    } else {
      discountAmount = data.discount_value;
      discountDisplay = `₹${discountAmount}`;
    }

    return {
      valid: true,
      coupon: data,
      discount: discountAmount,
      discountDisplay: discountDisplay,
      message: `Coupon applied! You saved ${discountDisplay}`
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { valid: false, message: 'Error validating coupon' };
  }
};

// Get coupon by code
export const getCouponByCode = async (code) => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching coupon:', error);
    throw error;
  }
};