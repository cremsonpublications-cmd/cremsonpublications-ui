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

    // Ensure items array has proper structure for backward compatibility
    const ordersWithItems = (data || []).map(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items = order.items.map(item => {
          // Ensure each item has a name field
          if (!item.name && item.productName) {
            item.name = item.productName;
          }
          if (!item.name && item.title) {
            item.name = item.title;
          }
          // If still no name, try to use a fallback
          if (!item.name) {
            item.name = `Product ${item.productId || item.id || 'Unknown'}`;
          }
          return item;
        });
      }
      return order;
    });

    return { success: true, orders: ordersWithItems };
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