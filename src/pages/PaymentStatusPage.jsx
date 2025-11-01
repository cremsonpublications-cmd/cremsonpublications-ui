import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ShoppingBag,
  CreditCard
} from "lucide-react";

const PaymentStatusPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart, clearCheckoutData } = useCart();
  const { user } = useUser();

  const [status, setStatus] = useState("verifying"); // verifying, success, failed, error
  const [orderData, setOrderData] = useState(null);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  // Get payment details from URL params
  const razorpayPaymentId = searchParams.get("razorpay_payment_id");
  const razorpayOrderId = searchParams.get("razorpay_order_id");
  const razorpaySignature = searchParams.get("razorpay_signature");

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BOOK${timestamp}${random}`;
  };

  const createOrderInDatabase = async (paymentDetails, pendingOrderData) => {
    try {
      const orderId = generateOrderId();
      const currentDate = new Date().toISOString().split("T")[0];

      // Use pending order data if available, otherwise get from localStorage
      const orderInfo = pendingOrderData || JSON.parse(localStorage.getItem('pendingOrder') || '{}');

      if (!orderInfo.customerInfo || !orderInfo.cartItems) {
        throw new Error('Missing order information');
      }

      // Determine which address to use for delivery
      const deliveryAddress = orderInfo.shippingDetails
        ? {
            street: orderInfo.shippingDetails.streetAddress,
            apartment: orderInfo.shippingDetails.apartment,
            city: orderInfo.shippingDetails.city,
            state: orderInfo.shippingDetails.state,
            pincode: orderInfo.shippingDetails.pincode,
            country: orderInfo.shippingDetails.country,
          }
        : {
            street: orderInfo.customerInfo.address.street,
            apartment: orderInfo.customerInfo.address.apartment,
            city: orderInfo.customerInfo.address.city,
            state: orderInfo.customerInfo.address.state,
            pincode: orderInfo.customerInfo.address.pincode,
            country: orderInfo.customerInfo.address.country,
          };

      // Prepare order data according to database schema
      const orderData = {
        order_id: orderId,
        user_info: {
          userId: user?.id || "guest",
          name: `${orderInfo.customerInfo.firstName} ${orderInfo.customerInfo.lastName}`,
          email: orderInfo.customerInfo.email,
          phone: orderInfo.customerInfo.phone,
          address: deliveryAddress,
        },
        // Add billing address separately if different from delivery
        ...(orderInfo.shippingDetails && {
          billing_info: {
            name: `${orderInfo.customerInfo.firstName} ${orderInfo.customerInfo.lastName}`,
            email: orderInfo.customerInfo.email,
            phone: orderInfo.customerInfo.phone,
            address: {
              street: orderInfo.customerInfo.address.street,
              apartment: orderInfo.customerInfo.address.apartment,
              city: orderInfo.customerInfo.address.city,
              state: orderInfo.customerInfo.address.state,
              pincode: orderInfo.customerInfo.address.pincode,
              country: orderInfo.customerInfo.address.country,
            },
          },
        }),
        items: orderInfo.cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          author: item.author || "Unknown Author",
          quantity: item.quantity,
          currentPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
        order_summary: {
          subTotal: orderInfo.orderSummary.subtotal,
          couponDiscount: orderInfo.orderSummary.couponDiscount,
          discountTotal: orderInfo.orderSummary.couponDiscount,
          deliveryCharge: orderInfo.orderSummary.deliveryCharge,
          grandTotal: orderInfo.orderSummary.total,
        },
        payment: {
          method: paymentDetails.payment_method || "Razorpay",
          status: "Paid",
          transactionId: paymentDetails.razorpay_payment_id,
          razorpay_order_id: paymentDetails.razorpay_order_id || null,
          razorpay_signature: paymentDetails.razorpay_signature || null,
          amount: orderInfo.orderSummary.total,
          payment_confirmed: true,
        },
        delivery: {
          status: "Order Placed",
          notes: orderInfo.shippingNotes || "",
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

      return { orderId, orderData };
    } catch (error) {
      console.error("Error in createOrderInDatabase:", error);
      throw error;
    }
  };

  const verifyPaymentAndCreateOrder = async () => {
    try {
      console.log("Starting payment verification...");
      console.log("Payment ID from URL:", razorpayPaymentId);

      // Check if we have payment details
      if (!razorpayPaymentId) {
        // Try to get from localStorage as fallback
        const storedPayment = localStorage.getItem('paymentInProgress');
        console.log("No payment ID in URL, checking localStorage:", storedPayment);
        if (!storedPayment) {
          console.error("No payment details found");
          setStatus("error");
          return;
        }
      }

      // Get pending order data
      const pendingOrder = localStorage.getItem('pendingOrder');
      if (!pendingOrder) {
        console.error('No pending order found');
        setStatus("error");
        return;
      }

      const pendingOrderData = JSON.parse(pendingOrder);

      // Create payment details object
      const paymentDetails = {
        razorpay_payment_id: razorpayPaymentId || `payment_${Date.now()}`,
        razorpay_order_id: razorpayOrderId || null,
        razorpay_signature: razorpaySignature || null,
        payment_method: "Razorpay"
      };

      console.log("Creating order with payment details:", paymentDetails);

      // Create order in database
      const { orderData } = await createOrderInDatabase(paymentDetails, pendingOrderData);

      setOrderData(orderData);
      setStatus("success");

      // Clear pending order data
      localStorage.removeItem('pendingOrder');
      localStorage.removeItem('paymentInProgress');

      // Clear cart and checkout data
      clearCart();
      clearCheckoutData();

      // Show celebration - will be added later

      // Send order confirmation email (background process)
      try {
        await fetch('https://vayisutwehvbjpkhzhcc.supabase.co/functions/v1/send-order-confirmation-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ orderData })
        });
        console.log('Order confirmation email sent successfully');
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't fail the order creation for email issues
      }

    } catch (error) {
      console.error("Error verifying payment:", error);
      setStatus("failed");
    }
  };

  const pollPaymentStatus = async () => {
    if (verificationAttempts >= 10) {
      console.log("Max verification attempts reached");
      setStatus("error");
      return;
    }

    console.log(`Payment verification attempt ${verificationAttempts + 1}`);
    setVerificationAttempts(prev => prev + 1);

    try {
      await verifyPaymentAndCreateOrder();
    } catch (error) {
      console.error("Payment verification failed:", error);

      // If we still have attempts left, try again after delay
      if (verificationAttempts < 9) {
        setTimeout(() => {
          pollPaymentStatus();
        }, 2000); // Wait 2 seconds before retrying
      } else {
        setStatus("error");
      }
    }
  };

  useEffect(() => {
    // Start verification process
    pollPaymentStatus();
  }, []);

  const handleContinueShopping = () => {
    navigate("/shop");
  };

  const handleViewOrders = () => {
    navigate("/my-orders");
  };

  const handleRetryPayment = () => {
    navigate("/checkout/shipping");
  };

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin mx-auto mb-4">
            <Loader2 size={48} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600 mb-4">
            Please wait while we confirm your payment...
          </p>
          <p className="text-sm text-gray-500">
            Attempt {verificationAttempts + 1} of 10
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        {/* Confetti Effect - Removed for now */}

        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto mb-4">
            <CheckCircle size={64} className="text-green-600 mx-auto" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Payment Successful! 🎉
          </h2>

          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </p>

          {orderData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
              <p className="text-sm text-gray-600">
                <strong>Order ID:</strong> {orderData.order_id}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total:</strong> ₹{orderData.order_summary.grandTotal.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Items:</strong> {orderData.items.length}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleViewOrders}
              className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
            >
              View My Orders
            </button>

            <button
              onClick={handleContinueShopping}
              className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed" || status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto mb-4">
            {status === "failed" ? (
              <XCircle size={64} className="text-red-600 mx-auto" />
            ) : (
              <CreditCard size={64} className="text-orange-600 mx-auto" />
            )}
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {status === "failed" ? "Payment Failed" : "Payment Status Unknown"}
          </h2>

          <p className="text-gray-600 mb-6">
            {status === "failed"
              ? "We couldn't process your payment. Please try again."
              : "We're having trouble verifying your payment. Please check your order history or contact support."
            }
          </p>

          <div className="space-y-3">
            <button
              onClick={handleViewOrders}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Check My Orders
            </button>

            <button
              onClick={handleRetryPayment}
              className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
            >
              Try Payment Again
            </button>

            <button
              onClick={handleContinueShopping}
              className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentStatusPage;