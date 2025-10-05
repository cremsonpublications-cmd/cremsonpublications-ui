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

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Add new item
      return [...prevItems, { ...product, quantity }];
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
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Increment item quantity
  const incrementQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrement item quantity
  const decrementQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      ).filter(item => item.quantity > 0)
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
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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