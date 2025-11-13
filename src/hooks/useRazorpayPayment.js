import { useState } from 'react';

const useRazorpayPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SUPABASE_URL = 'https://vayisutwehvbjpkhzhcc.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheWlzdXR3ZWh2Ympwa2h6aGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDg2NzQsImV4cCI6MjA3NTU4NDY3NH0.368e_Tz9pWhTevzXmwXJI3bZ3G9OktrlZzy6lBA8oL4';
  const RAZORPAY_KEY_ID = 'rzp_live_RZNaICiFgLKhW2';

  const initiatePayment = async (cartItems, customerInfo, orderSummary, shippingInfo = {}) => {
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Create Razorpay order via Supabase Edge Function
      console.log('Creating Razorpay order for amount:', orderSummary.total);

      const orderResponse = await fetch(`${SUPABASE_URL}/functions/v1/test-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          amount: orderSummary.total,
          currency: 'INR',
          receipt: `BOOK_${Date.now()}`
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const razorpayOrder = await orderResponse.json();
      console.log('Razorpay order created:', razorpayOrder.id);

      // Prepare order data for verification (matching your database schema)
      const orderData = {
        user_info: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address
        },
        items: cartItems.map(item => ({
          name: item.name,
          author: item.author,
          quantity: item.quantity,
          productId: item.id,
          currentPrice: item.price,
          totalPrice: item.price * item.quantity
        })),
        order_summary: {
          subTotal: orderSummary.subtotal,
          grandTotal: orderSummary.total,
          discountTotal: orderSummary.couponDiscount || 0,
          couponDiscount: orderSummary.couponDiscount || 0,
          deliveryCharge: orderSummary.deliveryCharge || 0
        },
        delivery: {
          status: "Order Placed",
          notes: shippingInfo.notes || ""
        },
        payment: {
          method: "Razorpay",
          status: "Pending",
          amount: orderSummary.total
        },
        order_status: "Pending",
        order_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      };

      // Store order details for recovery
      localStorage.setItem('pending_payment_order', JSON.stringify({
        razorpay_order_id: razorpayOrder.id,
        order_data: orderData,
        timestamp: Date.now()
      }));

      // 2️⃣ Open Razorpay Checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Cremson Publications",
        description: "Book Order",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          console.log('Payment successful:', response);

          // Store payment info for recovery
          localStorage.setItem('payment_success_data', JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          }));

          // Store order data for verification
          localStorage.setItem('payment_order_data', JSON.stringify(orderData));

          // Immediately redirect to verification screen
          window.location.href = `/payment-verification?razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`;
        },

        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setLoading(false);
            // Don't clear stored data - user might retry
          }
        },

        prefill: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email || '',
          contact: customerInfo.phone || ''
        },

        theme: {
          color: "#F37254"
        },

        // Mobile-specific optimizations
        remember_customer: false,
        timeout: 900, // 15 minutes
        retry: { enabled: false }
      };

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      const rzp = new window.Razorpay(options);

      // Handle payment failures
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setError(response.error.description);
        setLoading(false);
        window.location.href = `/payment-failed?error=${encodeURIComponent(response.error.description)}`;
      });

      // Open payment modal
      rzp.open();

    } catch (err) {
      console.error('Payment initiation error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  // Check for pending payments on page load (recovery mechanism)
  const checkPendingPayment = async () => {
    const pendingPayment = localStorage.getItem('pending_payment_order');
    const paymentSuccess = localStorage.getItem('payment_success_data');

    if (pendingPayment && paymentSuccess) {
      const paymentData = JSON.parse(paymentSuccess);
      const orderData = JSON.parse(pendingPayment);

      try {
        // Try to verify the payment that might have been completed
        const verifyResponse = await fetch(`${SUPABASE_URL}/functions/v1/test-verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            ...paymentData,
            orderData: orderData.order_data
          })
        });

        const result = await verifyResponse.json();

        if (result.success) {
          // Payment was successful, clear storage and redirect
          localStorage.removeItem('pending_payment_order');
          localStorage.removeItem('payment_success_data');
          window.location.href = `/payment-success?order_id=${result.order_id}&payment_id=${paymentData.razorpay_payment_id}`;
        }
      } catch (error) {
        console.log('Could not verify pending payment:', error);
      }
    }
  };

  return {
    initiatePayment,
    checkPendingPayment,
    loading,
    error
  };
};

export default useRazorpayPayment;