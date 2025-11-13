import React from 'react';
import { useCart } from '../context/CartContext';
import useRazorpayPayment from '../hooks/useRazorpayPayment';

const PaymentButton = ({ onPaymentStart, children, orderSummary, shippingInfo }) => {
  const { cartItems, customerInfo } = useCart();
  const { initiatePayment, loading, error } = useRazorpayPayment();

  // Check if payment is ready
  const isPaymentReady =
    cartItems?.length > 0 &&
    customerInfo?.email &&
    customerInfo?.firstName &&
    customerInfo?.lastName &&
    customerInfo?.address?.street &&
    customerInfo?.address?.city &&
    customerInfo?.address?.state &&
    customerInfo?.address?.pincode &&
    customerInfo?.phone &&
    orderSummary?.total > 0;

  const handlePayNow = async () => {
    if (onPaymentStart) {
      onPaymentStart();
    }

    // Validate cart and customer data
    if (!cartItems || cartItems.length === 0) {
      alert('Your cart is empty. Please add items to cart.');
      return;
    }

    if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName) {
      alert('Please fill in customer information before proceeding.');
      return;
    }

    if (!orderSummary || orderSummary.total <= 0) {
      alert('Invalid order amount. Please check your order.');
      return;
    }

    await initiatePayment(cartItems, customerInfo, orderSummary, shippingInfo);
  };

  if (error) {
    return (
      <div className="payment-error">
        <p style={{ color: 'red' }}>Payment Error: {error}</p>
        <button onClick={() => window.location.reload()}>
          Retry Payment
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handlePayNow}
      disabled={loading || !isPaymentReady}
      className={`payment-button ${loading ? 'loading' : ''} ${!isPaymentReady ? 'disabled' : ''}`}
      style={{
        backgroundColor: loading ? '#ccc' : isPaymentReady ? '#F37254' : '#e5e5e5',
        color: loading ? '#666' : isPaymentReady ? 'white' : '#999',
        padding: '16px 32px',
        border: 'none',
        borderRadius: '12px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: loading || !isPaymentReady ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'all 0.3s ease',
        width: '100%',
        minHeight: '56px',
        boxShadow: isPaymentReady && !loading ? '0 4px 12px rgba(243, 114, 84, 0.3)' : 'none'
      }}
    >
      {loading ? 'Processing...' : (children || `Pay ₹${orderSummary?.total || 0}`)}
    </button>
  );
};

export default PaymentButton;