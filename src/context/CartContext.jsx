import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartStorage } from '../utils/localStorage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize with data from localStorage
    return cartStorage.get();
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Mark as initialized after component mounts
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      cartStorage.set(cartItems);
    }
  }, [cartItems, isInitialized]);

  // Shipping and customer information state
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: {
      street: '',
      apartment: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    phone: ''
  });

  const [shippingInfo, setShippingInfo] = useState({
    method: 'free',
    notes: ''
  });

  // Function to calculate bulk price based on quantity
  const getBulkPrice = (product, quantity) => {
    if (!product.bulk_pricing || product.bulk_pricing.length === 0) {
      return product.finalPrice || product.price;
    }

    // Sort bulk pricing by quantity (ascending)
    const sortedBulkPricing = [...product.bulk_pricing].sort((a, b) => a.quantity - b.quantity);

    // Find the highest tier that the quantity qualifies for
    let applicablePrice = product.finalPrice || product.price;
    for (const bulk of sortedBulkPricing) {
      if (quantity >= bulk.quantity) {
        applicablePrice = bulk.price;
      }
    }

    return applicablePrice;
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    const numQuantity = parseInt(quantity) || 1;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Update quantity and recalculate price based on new total quantity
        const currentQuantity = parseInt(existingItem.quantity) || 0;
        const newQuantity = currentQuantity + numQuantity;
        const newPrice = getBulkPrice(product, newQuantity);
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity, price: newPrice }
            : item
        );
      }
      // Add new item with bulk price
      const bulkPrice = getBulkPrice(product, numQuantity);
      return [...prevItems, { ...product, quantity: numQuantity, price: bulkPrice }];
    });
  };

  // Remove item from cart completely
  const removeFromCart = (productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productId)
    );
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    const numQuantity = parseInt(quantity) || 0;
    if (numQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === productId) {
          const newPrice = getBulkPrice(item, numQuantity);
          return { ...item, quantity: numQuantity, price: newPrice };
        }
        return item;
      })
    );
  };

  // Increment item quantity
  const incrementQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === productId) {
          const currentQuantity = parseInt(item.quantity) || 0;
          const newQuantity = currentQuantity + 1;
          const newPrice = getBulkPrice(item, newQuantity);
          return { ...item, quantity: newQuantity, price: newPrice };
        }
        return item;
      })
    );
  };

  // Decrement item quantity
  const decrementQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === productId) {
          const currentQuantity = parseInt(item.quantity) || 0;
          const newQuantity = Math.max(0, currentQuantity - 1);
          if (newQuantity === 0) return null; // Will be filtered out
          const newPrice = getBulkPrice(item, newQuantity);
          return { ...item, quantity: newQuantity, price: newPrice };
        }
        return item;
      }).filter(item => item !== null && item.quantity > 0)
    );
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  // Get cart subtotal (before any discounts)
  const getSubtotal = () => {
    return getTotalPrice();
  };

  // Apply coupon
  const applyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Get coupon discount
  const getCouponDiscount = () => {
    return appliedCoupon ? appliedCoupon.discount_value : 0;
  };

  // Get final total (after coupon discount)
  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const couponDiscount = getCouponDiscount();
    return subtotal - couponDiscount;
  };

  // Customer info functions
  const updateCustomerInfo = (info) => {
    setCustomerInfo(prevInfo => ({ ...prevInfo, ...info }));
  };

  const updateCustomerAddress = (address) => {
    setCustomerInfo(prevInfo => ({
      ...prevInfo,
      address: { ...prevInfo.address, ...address }
    }));
  };

  // Shipping info functions
  const updateShippingInfo = (info) => {
    setShippingInfo(prevInfo => ({ ...prevInfo, ...info }));
  };

  const updateShippingMethod = (method) => {
    setShippingInfo(prevInfo => ({ ...prevInfo, method }));
  };

  const updateShippingNotes = (notes) => {
    setShippingInfo(prevInfo => ({ ...prevInfo, notes }));
  };

  // Clear all checkout data
  const clearCheckoutData = () => {
    setCustomerInfo({
      email: '',
      firstName: '',
      lastName: '',
      address: {
        street: '',
        apartment: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      },
      phone: ''
    });
    setShippingInfo({
      method: 'free',
      notes: ''
    });
    setAppliedCoupon(null);
  };

  const value = {
    cartItems,
    appliedCoupon,
    customerInfo,
    shippingInfo,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    getItemQuantity,
    isInCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getSubtotal,
    applyCoupon,
    removeCoupon,
    getCouponDiscount,
    getFinalTotal,
    updateCustomerInfo,
    updateCustomerAddress,
    updateShippingInfo,
    updateShippingMethod,
    updateShippingNotes,
    clearCheckoutData,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};