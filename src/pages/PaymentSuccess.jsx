import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SUPABASE_URL = 'https://vayisutwehvbjpkhzhcc.supabase.co';

  useEffect(() => {
    const verifyPaymentSuccess = async () => {
      try {
        // Get order details from URL params
        const orderId = searchParams.get('order_id');
        const paymentId = searchParams.get('payment_id');

        // Also check localStorage for backup
        const storedPaymentData = localStorage.getItem('payment_success_data');
        const storedOrderData = localStorage.getItem('pending_payment_order');

        if (!orderId && !paymentId && !storedPaymentData) {
          // No payment information found, redirect to home
          navigate('/');
          return;
        }

        // Get order details from Supabase
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheWlzdXR3ZWh2Ympwa2h6aGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDg2NzQsImV4cCI6MjA3NTU4NDY3NH0.368e_Tz9pWhTevzXmwXJI3bZ3G9OktrlZzy6lBA8oL4';

        const orderQuery = orderId
          ? `order_id.eq.${orderId}`
          : paymentId
          ? `payment->razorpay_payment_id.eq.${paymentId}`
          : null;

        if (!orderQuery) {
          throw new Error('No valid order identifier found');
        }

        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/orders?${orderQuery}&select=*`,
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const orders = await response.json();

        if (!orders || orders.length === 0) {
          throw new Error('Order not found');
        }

        const order = orders[0];

        // Verify the order is actually paid
        if (order.payment?.status !== 'Paid' || order.order_status !== 'Confirmed') {
          throw new Error('Order payment not confirmed');
        }

        setOrderDetails(order);

        // Clear any stored payment data
        localStorage.removeItem('payment_success_data');
        localStorage.removeItem('pending_payment_order');

      } catch (err) {
        console.error('Error verifying payment success:', err);
        setError(err.message);

        // Redirect to failure page after a short delay
        setTimeout(() => {
          navigate(`/payment-failed?error=${encodeURIComponent(err.message)}`);
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentSuccess();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>
          Verifying your payment...
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #F37254',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <h2 style={{ color: '#d32f2f', marginBottom: '15px' }}>
          Verification Failed
        </h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          {error}
        </p>
        <p style={{ fontSize: '14px', color: '#999' }}>
          Redirecting to error page in a moment...
        </p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <p>No order details found</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        padding: '40px 20px',
        borderRadius: '12px',
        border: '2px solid #28a745'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>
          ✅
        </div>

        <h1 style={{
          color: '#28a745',
          marginBottom: '10px',
          fontSize: '28px'
        }}>
          Payment Successful!
        </h1>

        <p style={{
          color: '#666',
          marginBottom: '30px',
          fontSize: '16px'
        }}>
          Thank you for your order. Your payment has been confirmed.
        </p>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'left',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
            Order Details
          </h3>

          <div style={{ marginBottom: '10px' }}>
            <strong>Order ID:</strong> {orderDetails.order_id}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>Payment ID:</strong> {orderDetails.payment.razorpay_payment_id || orderDetails.payment.transactionId}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>Amount:</strong> ₹{orderDetails.order_summary.grandTotal}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>Status:</strong>
            <span style={{
              color: '#28a745',
              fontWeight: 'bold',
              marginLeft: '5px'
            }}>
              {orderDetails.order_status}
            </span>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>Payment Date:</strong> {
              new Date(orderDetails.created_at).toLocaleString()
            }
          </div>

          {orderDetails.user_info && (
            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
              <strong>Customer:</strong> {orderDetails.user_info.name}<br/>
              <strong>Email:</strong> {orderDetails.user_info.email}
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#F37254',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate('/my-orders')}
            style={{
              backgroundColor: 'white',
              color: '#F37254',
              padding: '12px 24px',
              border: '2px solid #F37254',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            View Orders
          </button>
        </div>

        <div style={{
          marginTop: '30px',
          fontSize: '14px',
          color: '#666'
        }}>
          📧 A confirmation email has been sent to your registered email address.
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;