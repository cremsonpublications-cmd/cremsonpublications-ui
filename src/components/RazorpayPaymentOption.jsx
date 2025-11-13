import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import SpinnerbLoader from "./ui/SpinnerbLoader";

const RazorpayPaymentOption = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);

  const buyPlaceOrderApiData = location.state?.buyPlaceOrderApiData;

  const SUPABASE_URL = 'https://vayisutwehvbjpkhzhcc.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheWlzdXR3ZWh2Ympwa2h6aGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDg2NzQsImV4cCI6MjA3NTU4NDY3NH0.368e_Tz9pWhTevzXmwXJI3bZ3G9OktrlZzy6lBA8oL4';
  const RAZORPAY_KEY_ID = 'rzp_live_RZNaICiFgLKhW2';

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const createRazorpayOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      // Create order data for Supabase
      const amount = parseFloat(buyPlaceOrderApiData?.total_buy_amount || buyPlaceOrderApiData?.amount || 0);
      const orderData = {
        transaction_id: buyPlaceOrderApiData?.transaction_id,
        amount: amount.toFixed(2),
        user_id: localStorage.getItem("userId")
      };

      console.log("Creating Razorpay order with data:", orderData);

      // Call Supabase edge function to create Razorpay order
      const orderResponse = await fetch(`${SUPABASE_URL}/functions/v1/test-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          amount: parseFloat(orderData.amount),
          currency: 'INR',
          receipt: `BOOK_${orderData.transaction_id || Date.now()}`
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const razorpayOrder = await orderResponse.json();
      console.log('Razorpay order created:', razorpayOrder.id);

      // Prepare order data for verification (matching Supabase function expectations)
      const fullOrderData = {
        order_id: `BOOK${Date.now()}${Math.floor(Math.random() * 1000)}`,
        user_info: {
          name: buyPlaceOrderApiData?.user_name || "",
          email: buyPlaceOrderApiData?.user_email || "",
          phone: buyPlaceOrderApiData?.user_phone || "",
          address: buyPlaceOrderApiData?.user_address || {}
        },
        items: buyPlaceOrderApiData?.items || [],
        order_summary: {
          subTotal: buyPlaceOrderApiData?.subtotal || 0,
          grandTotal: parseFloat(orderData.amount),
          discountTotal: buyPlaceOrderApiData?.discount || 0,
          couponDiscount: buyPlaceOrderApiData?.coupon_discount || 0,
          deliveryCharge: buyPlaceOrderApiData?.delivery_charge || 0
        },
        delivery: {
          status: "Order Placed",
          notes: buyPlaceOrderApiData?.notes || ""
        },
        payment: {
          method: "Razorpay",
          status: "Pending",
          amount: parseFloat(orderData.amount)
        },
        order_status: "Pending",
        order_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      };

      // Store order data for verification
      localStorage.setItem('pendingOrder', JSON.stringify(fullOrderData));
      localStorage.setItem('currentRazorpayOrderId', razorpayOrder.id);

      // Start payment
      await startPayment(razorpayOrder, fullOrderData);

    } catch (err) {
      console.error("Error creating order:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const startPayment = async (razorpayOrder, orderData) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Cremson Publications",
      description: "Book Order Payment",
      order_id: razorpayOrder.id,
      handler: function (response) {
        console.log('Payment successful:', response);
        verifyPayment(response, orderData);
      },
      prefill: {
        name: orderData.user_info.name,
        email: orderData.user_info.email,
        contact: orderData.user_info.phone
      },
      notes: {
        address: orderData.user_info.address?.street || ""
      },
      theme: {
        color: "#F37254"
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal dismissed');
          setLoading(false);
          // Navigate back or show message
          navigate(-1);
        }
      },
      // For external app payments (Paytm, PhonePe, etc.)
      callback_url: window.location.origin + '/payment-callback',
      redirect: true,
      timeout: 300, // 5 minutes timeout
      remember_customer: true
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      setError(response.error.description);
      setLoading(false);
      navigate('/payment-failed', { state: { error: response.error } });
    });

    rzp.open();
  };

  const verifyPayment = async (razorpayResponse, orderData) => {
    try {
      console.log('Verifying payment:', razorpayResponse);

      // Call Supabase edge function to verify payment and create order
      const verifyResponse = await fetch(`${SUPABASE_URL}/functions/v1/test-verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          orderData: orderData
        })
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.success) {
        console.log('Payment verified and order created:', verifyResult.order_id);
        setLoading(false);

        // Clear stored data
        localStorage.removeItem('pendingOrder');
        localStorage.removeItem('currentRazorpayOrderId');

        // Navigate to success page
        navigate('/payment-success', { state: verifyResult });
      } else {
        throw new Error(verifyResult.message || 'Payment verification failed');
      }

    } catch (err) {
      console.error("Payment verification error:", err);
      setError(err.message);
      setLoading(false);
      navigate('/payment-failed', { state: { error: err.message } });
    }
  };

  useEffect(() => {
    // Add a small delay to show loading spinner initially
    const timer = setTimeout(() => {
      if (buyPlaceOrderApiData) {
        createRazorpayOrder();
      } else {
        setLoading(false);
        setError("No order data provided");
      }
    }, 500); // Show loading for at least 500ms

    return () => clearTimeout(timer);
  }, [buyPlaceOrderApiData]);

  if (error) {
    return (
      <div className="payment-container">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-red-800 font-semibold mb-2">Payment Error</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      {loading && (
        <div className="loader">
          <SpinnerbLoader title="Processing Payment..." />
        </div>
      )}
    </div>
  );
};

export default RazorpayPaymentOption;
