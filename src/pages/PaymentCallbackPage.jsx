import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PaymentCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart, clearCheckoutData } = useCart();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(true);

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BOOK${timestamp}${random}`;
  };

  const createOrderInDatabase = async (paymentDetails, pendingOrderData) => {
    try {
      const orderId = generateOrderId();
      const currentDate = new Date().toISOString().split("T")[0];

      const orderInfo = pendingOrderData || JSON.parse(localStorage.getItem('pendingOrder') || '{}');

      if (!orderInfo.customerInfo || !orderInfo.cartItems) {
        throw new Error('Missing order information');
      }

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

      const orderData = {
        order_id: orderId,
        user_info: {
          userId: user?.id || "guest",
          name: `${orderInfo.customerInfo.firstName} ${orderInfo.customerInfo.lastName}`,
          email: orderInfo.customerInfo.email,
          phone: orderInfo.customerInfo.phone,
          address: deliveryAddress,
        },
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

  const processPaymentCallback = async () => {
    try {
      console.log("Processing payment callback...");

      // Get payment details from URL
      const razorpayPaymentId = searchParams.get("razorpay_payment_id");
      const razorpayOrderId = searchParams.get("razorpay_order_id");
      const razorpaySignature = searchParams.get("razorpay_signature");

      console.log("Payment details from URL:", {
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
      });

      // Check if we have valid payment details
      if (!razorpayPaymentId) {
        // No payment details in URL, check if we have ongoing payment polling
        const currentOrderId = localStorage.getItem('currentRazorpayOrderId');
        if (currentOrderId) {
          console.log("No payment details in URL, redirecting to status page for polling");
          navigate("/payment-status?source=callback");
          return;
        } else {
          console.error("No payment details found");
          navigate("/payment-status?status=error&message=no_payment_details");
          return;
        }
      }

      // Get pending order data
      const pendingOrder = localStorage.getItem('pendingOrder');
      if (!pendingOrder) {
        console.error('No pending order found');
        navigate("/payment-status?status=error&message=no_order_data");
        return;
      }

      // Create payment details object
      const paymentDetails = {
        razorpay_payment_id: razorpayPaymentId,
        razorpay_order_id: razorpayOrderId,
        razorpay_signature: razorpaySignature,
        payment_method: "razorpay"
      };

      console.log("Creating order with payment details:", paymentDetails);

      // Create order in database
      const { orderData } = await createOrderInDatabase(paymentDetails, JSON.parse(pendingOrder));

      // Store success data
      localStorage.setItem('orderSuccess', JSON.stringify({
        orderData,
        paymentDetails,
        timestamp: Date.now()
      }));

      // Clear temporary data
      localStorage.removeItem('pendingOrder');
      localStorage.removeItem('paymentInProgress');
      localStorage.removeItem('currentRazorpayOrderId');
      localStorage.removeItem('paymentStartTime');

      // Clear cart
      clearCart();
      clearCheckoutData();

      console.log("Order created successfully, redirecting to success page");

      // Send order confirmation email (background)
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
      }

      // Navigate to success page
      navigate("/payment-status?status=success&source=callback");

    } catch (error) {
      console.error("Error processing payment callback:", error);

      // Store error for manual processing
      localStorage.setItem('callbackError', JSON.stringify({
        error: error.message,
        timestamp: Date.now(),
        url: window.location.href
      }));

      navigate("/payment-status?status=error&message=processing_failed");
    }
  };

  useEffect(() => {
    processPaymentCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin mx-auto mb-4">
          <Loader2 size={48} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Processing Payment
        </h2>
        <p className="text-gray-600 mb-4">
          Please wait while we confirm your payment and create your order...
        </p>
        <p className="text-sm text-gray-500">
          This should only take a few seconds
        </p>
      </div>
    </div>
  );
};

export default PaymentCallbackPage;