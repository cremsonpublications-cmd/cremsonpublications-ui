import React, { createContext, useContext, useState } from 'react';
import { getUserOrders } from '../services/orderService';
import { useUser } from '@clerk/clerk-react';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  // Cache duration: 2 minutes for orders (they change frequently)
  const ORDER_CACHE_DURATION = 2 * 60 * 1000;

  // Fetch user orders ONLY when explicitly called (like when visiting order page)
  const fetchUserOrders = async (forceRefresh = false) => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    
    if (!userEmail) {
      setOrders([]);
      setCurrentUserEmail(null);
      return [];
    }

    // If user changed, clear cache and fetch new data
    if (currentUserEmail !== userEmail) {
      setOrders([]);
      setLastFetched(null);
      setCurrentUserEmail(userEmail);
      forceRefresh = true;
    }

    // Check cache validity - only use cache if same user and not expired
    if (!forceRefresh && lastFetched && orders.length >= 0 && 
        currentUserEmail === userEmail &&
        (Date.now() - lastFetched) < ORDER_CACHE_DURATION) {
      return orders;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await getUserOrders(userEmail);
      
      if (result.success) {
        setOrders(result.orders);
        setLastFetched(Date.now());
        setCurrentUserEmail(userEmail);
        return result.orders;
      } else {
        setError(result.error);
        setOrders([]);
        return [];
      }
    } catch (err) {
      console.error('Error fetching user orders:', err);
      setError('Failed to fetch orders');
      setOrders([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get order by ID from cached data
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId || order.order_id === orderId);
  };

  // Get orders by status from cached data
  const getOrdersByStatus = (status) => {
    return orders.filter(order => 
      order.order_status?.toLowerCase() === status.toLowerCase() ||
      order.delivery?.status?.toLowerCase() === status.toLowerCase()
    );
  };

  // Get recent orders (last 30 days) from cached data
  const getRecentOrders = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return orders.filter(order => 
      new Date(order.order_date) >= thirtyDaysAgo
    );
  };

  // Get order statistics from cached data
  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, order) => 
      sum + (order.order_summary?.grandTotal || 0), 0
    );
    
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.delivery?.status || order.order_status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders,
      totalAmount,
      statusCounts,
      averageOrderValue: totalOrders > 0 ? totalAmount / totalOrders : 0
    };
  };

  // Force refresh orders
  const refreshOrders = () => {
    return fetchUserOrders(true);
  };

  // Clear orders (for logout or user change)
  const clearOrders = () => {
    setOrders([]);
    setLastFetched(null);
    setError(null);
    setCurrentUserEmail(null);
  };

  // Check if orders are loaded for current user
  const hasOrdersLoaded = () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    return currentUserEmail === userEmail && lastFetched !== null;
  };

  // Check if cache is valid
  const isCacheValid = () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    return currentUserEmail === userEmail && 
           lastFetched && 
           (Date.now() - lastFetched) < ORDER_CACHE_DURATION;
  };

  // Get cache info
  const getCacheInfo = () => ({
    lastFetched,
    ordersCount: orders.length,
    currentUserEmail,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    isCacheValid: isCacheValid(),
    hasOrdersLoaded: hasOrdersLoaded(),
    cacheAge: lastFetched ? Date.now() - lastFetched : null
  });

  const value = {
    // Data
    orders,
    loading,
    error,
    lastFetched,
    currentUserEmail,
    
    // Methods
    fetchUserOrders,        // Call this ONLY when user visits order page
    getOrderById,
    getOrdersByStatus,
    getRecentOrders,
    getOrderStats,
    refreshOrders,
    clearOrders,
    hasOrdersLoaded,
    isCacheValid,
    getCacheInfo
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
