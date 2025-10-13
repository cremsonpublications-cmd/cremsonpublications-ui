import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ShippingContext = createContext();

export const useShipping = () => {
  const context = useContext(ShippingContext);
  if (!context) {
    throw new Error('useShipping must be used within a ShippingProvider');
  }
  return context;
};

export const ShippingProvider = ({ children }) => {
  const [shippingSettings, setShippingSettings] = useState({
    shipping_charge: 50,
    free_delivery_threshold: 500,
    shipping_enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch shipping settings from database
  const fetchShippingSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shipping_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching shipping settings:', error);
        // Use default settings if fetch fails
        setShippingSettings({
          shipping_charge: 50,
          free_delivery_threshold: 500,
          shipping_enabled: true,
        });
      } else {
        setShippingSettings({
          shipping_charge: data.shipping_charge || 50,
          free_delivery_threshold: data.free_delivery_threshold || 500,
          shipping_enabled: data.shipping_enabled ?? true,
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      // Use default settings on error
      setShippingSettings({
        shipping_charge: 50,
        free_delivery_threshold: 500,
        shipping_enabled: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate shipping charge for a given order total
  const calculateShippingCharge = (orderTotal) => {
    // If shipping is disabled globally, return 0
    if (!shippingSettings.shipping_enabled) {
      return 0;
    }

    // If order total meets free delivery threshold, return 0
    if (orderTotal >= shippingSettings.free_delivery_threshold) {
      return 0;
    }

    // Otherwise return the standard shipping charge
    return shippingSettings.shipping_charge;
  };

  // Get shipping info text for display
  const getShippingInfo = (orderTotal) => {
    const shippingCharge = calculateShippingCharge(orderTotal);

    let infoText = '';

    if (!shippingSettings.shipping_enabled) {
      infoText = '🚚 Free delivery on all orders';
    } else if (shippingCharge === 0) {
      infoText = `🚚 Free delivery (order above ₹${shippingSettings.free_delivery_threshold})`;
    } else {
      const remaining = shippingSettings.free_delivery_threshold - orderTotal;
      infoText = `🚚 ₹${shippingCharge} shipping • Add ₹${remaining.toFixed(2)} more for free delivery`;
    }

    return {
      shippingCharge,
      infoText,
      isFreeDelivery: shippingCharge === 0,
      amountForFreeDelivery: shippingSettings.shipping_enabled ?
        Math.max(0, shippingSettings.free_delivery_threshold - orderTotal) : 0
    };
  };

  // Fetch settings on component mount
  useEffect(() => {
    fetchShippingSettings();
  }, []);

  const value = {
    shippingSettings,
    loading,
    error,
    calculateShippingCharge,
    getShippingInfo,
    refreshSettings: fetchShippingSettings,
  };

  return (
    <ShippingContext.Provider value={value}>
      {children}
    </ShippingContext.Provider>
  );
};

export default ShippingContext;