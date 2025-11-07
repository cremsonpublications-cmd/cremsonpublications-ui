import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/AuthContext";

import useRazorpay from "react-razorpay";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import PaymentModal from "../components/ui/PaymentModal";
import {
  CreditCard,
  MapPin,
  ShoppingBag,
  Truck,
  Edit,
  User,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Link } from "react-router-dom";

const ShippingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error, Razorpay } = useRazorpay();
  const {
    cartItems,
    getTotalPrice,
    getTotalItems,
    getCouponDiscount,
    appliedCoupon,
    customerInfo,
    shippingInfo,
    updateShippingMethod,
    updateShippingNotes,
    clearCart,
    clearCheckoutData,
  } = useCart();
  const { user } = useUser();

  // Payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalStatus, setPaymentModalStatus] = useState("processing"); // 'processing', 'success', 'failed', 'error'
  const [orderIdResult, setOrderIdResult] = useState(null);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState(null);

  // Get data from navigation state
  const navigationData = location.state;
  const displayCustomerInfo = navigationData?.customerInfo || customerInfo;
  const shippingDetails = navigationData?.shippingDetails; // Only exists if different delivery address

  // Order summary state
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    couponDiscount: 0,
    deliveryCharge: 0,
    total: 0,
  });

  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Add payment timeout monitoring
  useEffect(() => {
    const checkPaymentTimeout = () => {
      const paymentStartTime = localStorage.getItem("paymentStartTime");
      const currentOrderId = localStorage.getItem("currentRazorpayOrderId");

      if (paymentStartTime && currentOrderId) {
        const timeDiff = Date.now() - parseInt(paymentStartTime);

        // If payment has been in progress for more than 3 minutes, redirect to status page
        if (timeDiff > 3 * 60 * 1000) {
          console.log("Payment timeout detected, redirecting to status page");
          toast.info("Checking payment status, please wait...");
          navigate("/payment-status?source=timeout");
        }
      }
    };

    // Check every 30 seconds
    const timeoutInterval = setInterval(checkPaymentTimeout, 30000);

    return () => clearInterval(timeoutInterval);
  }, [navigate]);

  // Confetti celebration state (removed - now handled in PaymentStatusPage)

  // Shipping methods
  const shippingMethods = [
    {
      id: "free",
      name: "Free shipping",
      description: "Standard delivery (5-7 business days)",
      price: 0,
      icon: <Truck size={20} />,
    },
  ];

  // Calculate order summary
  useEffect(() => {
    const subtotal = getTotalPrice();
    const couponDiscount = getCouponDiscount();
    const deliveryCharge = 0; // Use calculated shipping charge
    const total = subtotal - couponDiscount + deliveryCharge;

    setOrderSummary({
      subtotal,
      couponDiscount,
      deliveryCharge,
      total: Math.max(0, total),
    });
  }, [cartItems, getTotalPrice, getCouponDiscount, shippingInfo.method]);

  // Calculate final order values
  const subtotal = getTotalPrice();
  const couponDiscount = getCouponDiscount();
  const deliveryCharge = 0; // Use calculated shipping charge
  const total = subtotal - couponDiscount + deliveryCharge;

  const createOrderInDatabase = useCallback(
    async (paymentDetails) => {
      try {
        const orderId = `BOOK${Date.now()}${Math.floor(Math.random() * 1000)}`;
        const currentDate = new Date().toISOString().split("T")[0];

        // Determine which address to use for delivery
        const deliveryAddress = shippingDetails
          ? {
              street: shippingDetails.streetAddress,
              apartment: shippingDetails.apartment,
              city: shippingDetails.city,
              state: shippingDetails.state,
              pincode: shippingDetails.pincode,
              country: shippingDetails.country,
            }
          : {
              street: displayCustomerInfo.address.street,
              apartment: displayCustomerInfo.address.apartment,
              city: displayCustomerInfo.address.city,
              state: displayCustomerInfo.address.state,
              pincode: displayCustomerInfo.address.pincode,
              country: displayCustomerInfo.address.country,
            };

        // Prepare order data
        const orderData = {
          order_id: orderId,
          user_info: {
            userId: user?.id || "guest",
            name: `${displayCustomerInfo.firstName} ${displayCustomerInfo.lastName}`,
            email: displayCustomerInfo.email,
            phone: displayCustomerInfo.phone,
            address: deliveryAddress,
          },
          items: cartItems.map((item) => ({
            productId: item.id,
            name: item.name,
            author: item.author || "Unknown Author",
            quantity: item.quantity,
            currentPrice: item.price,
            totalPrice: item.price * item.quantity,
          })),
          order_summary: {
            subTotal: subtotal,
            couponDiscount: couponDiscount,
            discountTotal: couponDiscount,
            deliveryCharge: deliveryCharge,
            grandTotal: total,
          },
          payment: {
            method: paymentDetails.payment_method || "Razorpay",
            status: "Paid",
            transactionId: paymentDetails.razorpay_payment_id,
            razorpay_order_id: paymentDetails.razorpay_order_id || null,
            razorpay_signature: paymentDetails.razorpay_signature || null,
            amount: total,
            payment_confirmed: true,
          },
          delivery: {
            status: "Order Placed",
            notes: shippingInfo.notes || "",
          },
          order_status: "Confirmed",
          order_date: currentDate,
        };

        // Insert order into database
        const { error } = await supabase
          .from("orders")
          .insert([orderData])
          .select()
          .single();

        if (error) {
          console.error("Error creating order:", error);
          throw new Error("Failed to save order to database");
        }

        // Send order confirmation email immediately after order creation
        fetch(
          "https://vayisutwehvbjpkhzhcc.supabase.co/functions/v1/send-order-confirmation-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ orderData }),
          }
        ).catch((error) => {
          console.error("Email sending failed:", error);
          // Don't block the order creation if email fails
        });

        return { orderId, orderData };
      } catch (error) {
        console.error("Error in createOrderInDatabase:", error);
        throw error;
      }
    },
    [
      user,
      displayCustomerInfo,
      shippingDetails,
      cartItems,
      subtotal,
      couponDiscount,
      deliveryCharge,
      total,
      shippingInfo.notes,
    ]
  );

  // Check for successful payment on page load (for Paytm redirect case)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const razorpayPaymentId = urlParams.get("razorpay_payment_id");
    const razorpayOrderId = urlParams.get("razorpay_order_id");
    const razorpaySignature = urlParams.get("razorpay_signature");

    // If payment parameters are present, it means payment was successful via redirect
    if (razorpayPaymentId && razorpayOrderId) {
      console.log("Payment success detected via URL parameters");

      // Process the successful payment using the same validation flow as desktop
      const processRedirectPayment = async () => {
        try {
          // Show processing modal
          setPaymentModalStatus("processing");
          setShowPaymentModal(true);

          // Prepare order data for validation (same as desktop flow)
          const orderData = {
            order_id: `BOOK${Date.now()}${Math.floor(Math.random() * 1000)}`,
            user_info: {
              userId: user?.id || "guest",
              name: `${displayCustomerInfo.firstName} ${displayCustomerInfo.lastName}`,
              email: displayCustomerInfo.email,
              phone: displayCustomerInfo.phone,
              address: shippingDetails
                ? {
                    street: shippingDetails.streetAddress,
                    apartment: shippingDetails.apartment,
                    city: shippingDetails.city,
                    state: shippingDetails.state,
                    pincode: shippingDetails.pincode,
                    country: shippingDetails.country,
                  }
                : {
                    street: displayCustomerInfo.address.street,
                    apartment: displayCustomerInfo.address.apartment,
                    city: displayCustomerInfo.address.city,
                    state: displayCustomerInfo.address.state,
                    pincode: displayCustomerInfo.address.pincode,
                    country: displayCustomerInfo.address.country,
                  },
            },
            items: cartItems.map((item) => ({
              productId: item.id,
              name: item.name,
              author: item.author || "Unknown Author",
              quantity: item.quantity,
              currentPrice: item.price,
              totalPrice: item.price * item.quantity,
            })),
            order_summary: {
              subTotal: subtotal,
              couponDiscount: couponDiscount,
              deliveryCharge: deliveryCharge,
              grandTotal: total,
            },
            payment: {
              method: "Razorpay",
              amount: total,
            },
            order_date: new Date().toISOString().split("T")[0],
          };

          // Call validation edge function (same as desktop)
          const validationResponse = await fetch(
            "https://vayisutwehvbjpkhzhcc.supabase.co/functions/v1/validate-payment-and-create-order",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${
                  import.meta.env.VITE_SUPABASE_ANON_KEY
                }`,
                apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
              },
              body: JSON.stringify({
                razorpay_payment_id: razorpayPaymentId,
                razorpay_order_id: razorpayOrderId,
                razorpay_signature: razorpaySignature,
                orderData,
              }),
            }
          );

          const result = await validationResponse.json();

          if (result.success) {
            // Payment validated and order created successfully
            setPaymentModalStatus("success");
            setOrderIdResult(result.order_id);

            // Clear cart and checkout data
            clearCart();
            clearCheckoutData();

            // Clear temporary payment data
            localStorage.removeItem("pendingOrder");
            localStorage.removeItem("paymentStartTime");
            localStorage.removeItem("currentRazorpayOrderId");

            // Clean URL
            window.history.replaceState({}, "", window.location.pathname);

            console.log(
              "Mobile payment validated successfully:",
              result.order_id
            );
          } else {
            // Payment validation failed
            setPaymentModalStatus("failed");
            setPaymentErrorMessage(
              result.message || "Payment validation failed"
            );
            console.error("Mobile payment validation failed:", result.message);
          }
        } catch (error) {
          console.error("Error processing mobile redirect payment:", error);
          setPaymentModalStatus("error");
          setPaymentErrorMessage(
            "An unexpected error occurred while processing your payment."
          );
        }
      };

      processRedirectPayment();
    }
  }, [
    createOrderInDatabase,
    clearCart,
    clearCheckoutData,
    navigate,
    cartItems,
    displayCustomerInfo,
    shippingDetails,
    subtotal,
    couponDiscount,
    deliveryCharge,
    total,
    user,
  ]);

  const createRazorpayOrder = async () => {
    try {
      // Method 1: Using supabase.functions.invoke (preferred)
      const { data, error } = await supabase.functions.invoke(
        "create-razorpay-order",
        {
          body: {
            amount: total, // Amount in rupees - Supabase function will convert to paise
            currency: "INR",
            receipt: `order_${Date.now()}_${Math.random()
              .toString(36)
              .substring(2, 11)}`,
          },
        }
      );

      if (error) {
        console.error("Supabase function error:", error);
        // Fallback to direct API call if needed
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);

      // Method 2: Direct API call as fallback
      try {
        const response = await fetch(
          "https://vayisutwehvbjpkhzhcc.supabase.co/functions/v1/create-razorpay-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
              amount: total, // Amount in rupees - Supabase function will convert to paise
              currency: "INR",
              receipt: `order_${Date.now()}_${Math.random()
                .toString(36)
                .substring(2, 11)}`,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (fetchError) {
        console.error("Direct API call failed:", fetchError);
        throw new Error("Failed to create payment order");
      }
    }
  };

  const handleContinueToPayment = async () => {
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);

    try {
      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrder();

      if (!razorpayOrder?.id) {
        throw new Error("Failed to create order");
      }

      // Store pending order data for redirect-based payments
      const pendingOrderData = {
        customerInfo: displayCustomerInfo,
        shippingDetails,
        cartItems,
        orderSummary,
        shippingNotes: shippingInfo.notes,
        timestamp: Date.now(),
      };

      localStorage.setItem("pendingOrder", JSON.stringify(pendingOrderData));
      localStorage.setItem("paymentStartTime", Date.now().toString());
      localStorage.setItem("currentRazorpayOrderId", razorpayOrder.id);

      // Payment options supporting both modal and redirect flows
      const options = {
        key: "rzp_live_RZNaICiFgLKhW2",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "Cremson Publications",
        description: `Books Order`,
        callback_url: `${window.location.origin}/payment-callback`,
        redirect: true,
        prefill: {
          name: `${displayCustomerInfo.firstName} ${displayCustomerInfo.lastName}`,
          email: displayCustomerInfo.email,
          contact: displayCustomerInfo.phone,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      // In redirect mode, don't show processing modal as payment happens on Razorpay's server
      console.log('Opening Razorpay in redirect mode for bulletproof iOS compatibility');

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Payment failed. Please try again.");
      setIsProcessingPayment(false);

      // Clear any stored data
      localStorage.removeItem("pendingOrder");
      localStorage.removeItem("paymentStartTime");
      localStorage.removeItem("currentRazorpayOrderId");
    }
  };

  // Add timeout to auto-reset processing state if stuck

  const handleChangeContact = () => {
    navigate("/checkout", {
      state: {
        customerInfo: displayCustomerInfo,
        returnFromShipping: true,
      },
    });
  };

  const handleChangeAddress = () => {
    navigate("/checkout", {
      state: {
        customerInfo: displayCustomerInfo,
        returnFromShipping: true,
      },
    });
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentModalStatus("processing");
    setOrderIdResult(null);
    setPaymentErrorMessage(null);
    setIsProcessingPayment(false);
  };

  // Don't show empty cart message if payment modal is showing or payment is being processed
  if (cartItems.length === 0 && !showPaymentModal && !isProcessingPayment) {
    return (
      <div className="max-w-frame mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-4">Add some books to get started!</p>
          <a
            href="/shop"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-frame mx-auto px-4 py-8">
      {/* Confetti celebration now handled in PaymentStatusPage */}

      {/* Checkout Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/cart">Cart</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/checkout">Information</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Shipping</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information Display */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User size={18} />
                Contact
              </h2>
              <button
                onClick={handleChangeContact}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <Edit size={14} />
                Change
              </button>
            </div>
            <p className="text-gray-700">
              {displayCustomerInfo.email || (
                <span className="text-gray-500 italic">
                  No email provided. Please go back to add your email.
                </span>
              )}
            </p>
          </div>

          {/* Shipping Address Display */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin size={18} />
                Ship to
              </h2>
              <button
                onClick={handleChangeAddress}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <Edit size={14} />
                Change
              </button>
            </div>
            <div className="text-gray-700">
              {displayCustomerInfo.address?.street ? (
                <>
                  <p>{displayCustomerInfo.address.street}</p>
                  {displayCustomerInfo.address.apartment && (
                    <p>{displayCustomerInfo.address.apartment}</p>
                  )}
                  <p>
                    {displayCustomerInfo.address.city}{" "}
                    {displayCustomerInfo.address.pincode},{" "}
                    {displayCustomerInfo.address.state}
                  </p>
                  <p>{displayCustomerInfo.address.country}</p>
                </>
              ) : (
                <p className="text-gray-500 italic">
                  No shipping address provided. Please go back to add your
                  address.
                </p>
              )}
            </div>
          </div>

          {/* Shipping Methods */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck size={18} />
              Shipping Methods
            </h2>
            <div className="space-y-3">
              {shippingMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    shippingInfo.method === method.id
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={shippingInfo.method === method.id}
                    onChange={(e) => updateShippingMethod(e.target.value)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {method.icon}
                        <span className="font-medium text-gray-900">
                          {method.name}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {method.price === 0 ? "FREE" : `₹${method.price}`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {method.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order notes (optional)
            </h2>
            <textarea
              value={shippingInfo.notes}
              onChange={(e) => updateShippingNotes(e.target.value)}
              placeholder="Special instructions for your order..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
            />
          </div>

          {/* Return to Information Button */}
          <div className="flex justify-start">
            <button
              onClick={() => navigate("/checkout")}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← Return to information
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.main_image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal ({getTotalItems()} items)
                </span>
                <span className="text-gray-900">
                  ₹{orderSummary.subtotal.toFixed(2)}
                </span>
              </div>

              {orderSummary.couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">Coupon Discount</span>
                    {appliedCoupon && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {appliedCoupon.code}
                      </span>
                    )}
                  </div>
                  <span className="text-green-600">
                    -₹{orderSummary.couponDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {orderSummary.deliveryCharge === 0
                    ? "FREE"
                    : `₹${orderSummary.deliveryCharge.toFixed(2)}`}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  ₹{orderSummary.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Pay Now Button */}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600 text-sm">
                  Error loading Razorpay: {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-red-600 underline mt-2 text-sm"
                >
                  Refresh Page
                </button>
              </div>
            )}

            <button
              onClick={handleContinueToPayment}
              disabled={isProcessingPayment || error}
              className={`w-full mt-6 py-3 px-4 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 ${
                isProcessingPayment || error
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <CreditCard size={16} />
              {isProcessingPayment
                ? "Processing..."
                : `Pay ₹${orderSummary.total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        status={paymentModalStatus}
        onClose={handleClosePaymentModal}
        orderId={orderIdResult}
        errorMessage={paymentErrorMessage}
      />
    </div>
  );
};

export default ShippingPage;
