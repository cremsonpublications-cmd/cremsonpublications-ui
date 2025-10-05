import { supabase } from '../lib/supabase';

// Get all available coupons
export const getCoupons = async () => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .gte('valid_until', new Date().toISOString())
      .order('discount_value', { ascending: false });

    if (error) throw error;
    return data;
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

    return {
      valid: true,
      coupon: data,
      discount: data.discount_value,
      message: `Coupon applied! You saved ₹${data.discount_value}`
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