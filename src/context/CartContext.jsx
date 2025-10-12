import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { cartStorage } from "../utils/localStorage";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
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
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);

  // Timer reference for clearing cart after inactivity
  const clearCartTimerRef = useRef(null);
  const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds

  // Mark as initialized after component mounts
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Function to reset the inactivity timer
  const resetClearCartTimer = () => {
    // Clear existing timer if any
    if (clearCartTimerRef.current) {
      clearTimeout(clearCartTimerRef.current);
    }

    // Only set timer if cart has items
    if (cartItems.length > 0) {
      clearCartTimerRef.current = setTimeout(() => {
        console.log("Clearing cart due to inactivity");
        setCartItems([]);
        cartStorage.set([]);
      }, INACTIVITY_TIMEOUT);
    }
  };

  // Save cart to localStorage whenever it changes (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      cartStorage.set(cartItems);
      // Reset timer whenever cart changes
      resetClearCartTimer();
    }
  }, [cartItems, isInitialized]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (clearCartTimerRef.current) {
        clearTimeout(clearCartTimerRef.current);
      }
    };
  }, []);

  // Shipping and customer information state
  const [customerInfo, setCustomerInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: {
      street: "",
      apartment: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    phone: "",
  });

  const [shippingInfo, setShippingInfo] = useState({
    method: "free",
    notes: "",
  });

  // Function to calculate bulk price based on quantity
  const getBulkPrice = (product, quantity) => {
    // Safety checks
    if (!product) {
      console.error("getBulkPrice: product is null or undefined");
      return 0;
    }

    const safeQuantity = parseInt(quantity) || 1;

    if (!product.bulk_pricing || product.bulk_pricing.length === 0) {
      const price =
        parseFloat(product.finalPrice) || parseFloat(product.price) || 0;
      return isNaN(price) ? 0 : price;
    }

    // Sort bulk pricing by quantity (ascending)
    const sortedBulkPricing = [...product.bulk_pricing].sort(
      (a, b) => a.quantity - b.quantity
    );

    // Find the highest tier that the quantity qualifies for
    let applicablePrice =
      parseFloat(product.finalPrice) || parseFloat(product.price) || 0;

    for (const bulk of sortedBulkPricing) {
      if (safeQuantity >= bulk.quantity) {
        const bulkPrice = parseFloat(bulk.price);
        if (!isNaN(bulkPrice)) {
          applicablePrice = bulkPrice;
        }
      }
    }

    return isNaN(applicablePrice) ? 0 : applicablePrice;
  };

  // Show cart popup
  const showPopup = (product) => {
    setPopupProduct(product);
    setShowCartPopup(true);
  };

  // Hide cart popup
  const hidePopup = () => {
    setShowCartPopup(false);
    setPopupProduct(null);
  };

  // Add item to cart
  const addToCart = (product, quantity = 1, showPopupAfter = true) => {
    if (!product || !product.id) {
      console.error("Invalid product data:", product);
      return;
    }

    const addQuantity = parseInt(quantity) || 1;

    // Find current quantity in cart
    const existingItem = cartItems.find((item) => item.id === product.id);
    const currentQuantity = existingItem
      ? parseInt(existingItem.quantity) || 0
      : 0;
    const newQuantity = currentQuantity + addQuantity;

    // Update cart
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);

      if (existing) {
        // Update existing item
        return prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: newQuantity,
                price: getBulkPrice(product, newQuantity),
              }
            : item
        );
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            ...product,
            quantity: addQuantity,
            price: getBulkPrice(product, addQuantity),
          },
        ];
      }
    });

    // Show popup after adding to cart
    if (showPopupAfter) {
      showPopup(product);
    }
  };

  // Remove item from cart completely
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    const numQuantity = parseInt(quantity) || 0;
    if (numQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const newPrice = getBulkPrice(item, numQuantity);
          return { ...item, quantity: numQuantity, price: newPrice };
        }
        return item;
      })
    );
  };

  // Increment item quantity
  const incrementQuantity = (productId, showPopupAfter = true) => {
    let updatedProduct = null;

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const currentQuantity = parseInt(item.quantity) || 0;
          const newQuantity = currentQuantity + 1;
          const newPrice = getBulkPrice(item, newQuantity);
          updatedProduct = { ...item, quantity: newQuantity, price: newPrice };
          return updatedProduct;
        }
        return item;
      })
    );

    // Show popup after incrementing
    if (showPopupAfter && updatedProduct) {
      setTimeout(() => showPopup(updatedProduct), 100); // Small delay to ensure state is updated
    }
  };

  // Decrement item quantity
  const decrementQuantity = (productId, showPopupAfter = true) => {
    let updatedProduct = null;

    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === productId) {
            const currentQuantity = parseInt(item.quantity) || 0;
            const newQuantity = Math.max(0, currentQuantity - 1);
            if (newQuantity === 0) return null; // Will be filtered out
            const newPrice = getBulkPrice(item, newQuantity);
            updatedProduct = {
              ...item,
              quantity: newQuantity,
              price: newPrice,
            };
            return updatedProduct;
          }
          return item;
        })
        .filter((item) => item !== null && item.quantity > 0)
    );

    // Show popup after decrementing (only if item still exists)
    if (showPopupAfter && updatedProduct) {
      setTimeout(() => showPopup(updatedProduct), 100); // Small delay to ensure state is updated
    }
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
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
      return total + price * quantity;
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
    setCustomerInfo((prevInfo) => ({ ...prevInfo, ...info }));
  };

  const updateCustomerAddress = (address) => {
    setCustomerInfo((prevInfo) => ({
      ...prevInfo,
      address: { ...prevInfo.address, ...address },
    }));
  };

  // Shipping info functions
  const updateShippingInfo = (info) => {
    setShippingInfo((prevInfo) => ({ ...prevInfo, ...info }));
  };

  const updateShippingMethod = (method) => {
    setShippingInfo((prevInfo) => ({ ...prevInfo, method }));
  };

  const updateShippingNotes = (notes) => {
    setShippingInfo((prevInfo) => ({ ...prevInfo, notes }));
  };

  // Clear all checkout data
  const clearCheckoutData = () => {
    setCustomerInfo({
      email: "",
      firstName: "",
      lastName: "",
      address: {
        street: "",
        apartment: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },
      phone: "",
    });
    setShippingInfo({
      method: "free",
      notes: "",
    });
    setAppliedCoupon(null);
  };

  const value = {
    cartItems,
    appliedCoupon,
    customerInfo,
    shippingInfo,
    showCartPopup,
    popupProduct,
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
    showPopup,
    hidePopup,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
