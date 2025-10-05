import { supabase } from '../lib/supabase';

export const getUserOrders = async (userEmail) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_info->>email', userEmail)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return { success: false, error: error.message };
    }

    return { success: true, orders: data || [] };
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    return { success: false, error: error.message };
  }
};

export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all orders:', error);
      return { success: false, error: error.message };
    }

    return { success: true, orders: data || [] };
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    return { success: false, error: error.message };
  }
};

export const getOrderById = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return { success: false, error: error.message };
    }

    return { success: true, order: data };
  } catch (error) {
    console.error('Error in getOrderById:', error);
    return { success: false, error: error.message };
  }
};