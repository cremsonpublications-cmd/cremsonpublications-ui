import React, { useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Loader2 } from "lucide-react";

const PaymentCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart, clearCheckoutData } = useCart();


  const processPaymentCallback = useCallback(async () => {
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
          if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            window.location.href = "/payment-status?source=callback&status=processing";
          } else {
            navigate("/payment-status?source=callback&status=processing");
          }
          return;
        } else {
          console.error("No payment details found");
          navigate("/payment-status?status=error&message=no_payment_details&source=callback");
          return;
        }
      }

      // Get pending order data
      const pendingOrder = localStorage.getItem('pendingOrder');
      if (!pendingOrder) {
        console.error('No pending order found');
        navigate("/payment-status?status=error&message=no_order_data&source=callback");
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

      // Use the test verify payment endpoint
      const validationResponse = await fetch('https://vayisutwehvbjpkhzhcc.supabase.co/functions/v1/test-verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId,
          razorpay_signature: razorpaySignature,
          orderData: JSON.parse(pendingOrder)
        })
      });

      const validationResult = await validationResponse.json();

      if (!validationResult.success) {
        throw new Error(validationResult.message || 'Payment validation failed');
      }

      const orderData = validationResult.order_data;

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
        // Don't fail the order creation for email issues
      }

      // iOS-specific redirect handling
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // Force a hard redirect for iOS Safari
        window.location.href = "/payment-status?status=success&source=callback";
      } else {
        // Navigate to success page
        navigate("/payment-status?status=success&source=callback");
      }

    } catch (error) {
      console.error("Error processing payment callback:", error);

      // Store error for manual processing
      localStorage.setItem('callbackError', JSON.stringify({
        error: error.message,
        timestamp: Date.now(),
        url: window.location.href,
        paymentId: searchParams.get("razorpay_payment_id"),
        orderId: searchParams.get("razorpay_order_id")
      }));

      // Store failed order creation data for recovery
      const paymentId = searchParams.get("razorpay_payment_id");
      if (paymentId) {
        localStorage.setItem('failedOrderCreation', JSON.stringify({
          paymentDetails: {
            razorpay_payment_id: paymentId,
            razorpay_order_id: searchParams.get("razorpay_order_id"),
            razorpay_signature: searchParams.get("razorpay_signature")
          },
          timestamp: Date.now()
        }));
      }

      // Try to recover by redirecting to status page for manual processing
      const pendingOrder = localStorage.getItem('pendingOrder');
      if (pendingOrder) {
        console.log("Attempting recovery - redirecting to status page for manual processing");
        navigate("/payment-status?status=processing&source=callback&recovery=true");
      } else {
        navigate("/payment-status?status=error&message=processing_failed&source=callback");
      }
    }
  }, [navigate, searchParams, clearCart, clearCheckoutData]);

  useEffect(() => {
    processPaymentCallback();
  }, [processPaymentCallback]);

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
