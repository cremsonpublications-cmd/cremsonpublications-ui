import React from 'react';
import { useRazorpayPayment } from '../hooks/useRazorpayPayment';

const PaymentButton = ({
  orderData,
  onPaymentSuccess,
  onPaymentFailure,
  children,
  className = '',
  disabled = false
}) => {
  const { initiatePayment, isLoading } = useRazorpayPayment();

  const handlePayment = async () => {
    if (disabled || isLoading) return;

    try {
      await initiatePayment(
        orderData,
        (order) => {
          console.log('Payment successful:', order);
          if (onPaymentSuccess) {
            onPaymentSuccess(order);
          }
        },
        (error) => {
          console.error('Payment failed:', error);
          if (onPaymentFailure) {
            onPaymentFailure(error);
          }
        }
      );
    } catch (err) {
      console.error('Payment initiation failed:', err);
      if (onPaymentFailure) {
        onPaymentFailure(err.message);
      }
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className={`relative ${className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        </div>
      )}
      <span className={isLoading ? 'invisible' : ''}>
        {children}
      </span>
    </button>
  );
};

export default PaymentButton;
