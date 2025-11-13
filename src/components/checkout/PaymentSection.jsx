import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import PaymentButton from '../PaymentButton';
import useRazorpayPayment from '../../hooks/useRazorpayPayment';

const PaymentSection = ({ orderSummary, shippingInfo = {} }) => {
  const { cartItems, customerInfo } = useCart();
  const { checkPendingPayment } = useRazorpayPayment();
  const [isPaymentReady, setIsPaymentReady] = useState(false);

  // Check for pending payments on component load
  useEffect(() => {
    checkPendingPayment();
  }, [checkPendingPayment]);

  // Validate if payment is ready
  useEffect(() => {
    const isReady =
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

    setIsPaymentReady(isReady);
  }, [cartItems, customerInfo, orderSummary]);

  const handlePaymentStart = () => {
    console.log('Payment started with:', {
      items: cartItems?.length,
      customer: customerInfo?.email,
      total: orderSummary?.total
    });
  };

  const validateForm = () => {
    const errors = [];

    if (!cartItems || cartItems.length === 0) {
      errors.push('Your cart is empty');
    }

    if (!customerInfo?.email?.trim()) {
      errors.push('Email is required');
    }

    if (!customerInfo?.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!customerInfo?.lastName?.trim()) {
      errors.push('Last name is required');
    }

    if (!customerInfo?.address?.street?.trim()) {
      errors.push('Street address is required');
    }

    if (!customerInfo?.address?.city?.trim()) {
      errors.push('City is required');
    }

    if (!customerInfo?.address?.state?.trim()) {
      errors.push('State is required');
    }

    if (!customerInfo?.address?.pincode?.trim()) {
      errors.push('PIN code is required');
    }

    if (!customerInfo?.phone?.trim()) {
      errors.push('Phone number is required');
    }

    if (!orderSummary?.total || orderSummary.total <= 0) {
      errors.push('Invalid order total');
    }

    return errors;
  };

  const errors = validateForm();

  return (
    <div className="payment-section">
      {/* Payment Method - Razorpay Only */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          💳 Complete Your Payment
        </h3>

        <div className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                Pay with Credit/Debit Card, UPI, Net Banking
              </div>
              <div className="text-sm text-gray-500">
                100% Secure Payment • Powered by Razorpay
              </div>
            </div>
            <img
              src="https://razorpay.com/assets/razorpay-logo.svg"
              alt="Razorpay"
              className="h-6"
            />
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h4 className="text-red-800 font-semibold mb-2">
            Please complete the following:
          </h4>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Order Summary Display */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{orderSummary?.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          {(orderSummary?.couponDiscount || 0) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-₹{orderSummary.couponDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery:</span>
            <span>
              {(orderSummary?.deliveryCharge || 0) === 0
                ? 'FREE'
                : `₹${orderSummary.deliveryCharge.toFixed(2)}`
              }
            </span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>₹{orderSummary?.total?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Customer Details Display */}
      {customerInfo?.email && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Customer Details</h4>
          <div className="text-sm space-y-1">
            <div><strong>Name:</strong> {customerInfo.firstName} {customerInfo.lastName}</div>
            <div><strong>Email:</strong> {customerInfo.email}</div>
            <div><strong>Phone:</strong> {customerInfo.phone}</div>
            {customerInfo.address && (
              <div>
                <strong>Address:</strong> {customerInfo.address.street}
                {customerInfo.address.apartment && `, ${customerInfo.address.apartment}`}
                , {customerInfo.address.city}, {customerInfo.address.state} - {customerInfo.address.pincode}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Button - Primary Action */}
      <div className="text-center">
        <div className="bg-gray-50 rounded-lg p-6 mb-4">
          <div className="text-center mb-4">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Total Amount: ₹{orderSummary?.total?.toFixed(2) || '0.00'}
            </h4>
            <p className="text-sm text-gray-600">
              Click below to proceed with secure payment
            </p>
          </div>

          <PaymentButton
            orderSummary={orderSummary}
            shippingInfo={shippingInfo}
            onPaymentStart={handlePaymentStart}
          >
            {isPaymentReady
              ? `💳 Pay ₹${orderSummary?.total?.toFixed(2) || '0.00'} Now`
              : '⚠️ Complete Information to Pay'
            }
          </PaymentButton>

          {!isPaymentReady && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">
                Please fill all required information above to proceed with payment
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 text-center text-sm text-gray-500">
        🔒 Your payment information is secure and encrypted
        <br />
        Powered by Razorpay - India's most trusted payment gateway
      </div>
    </div>
  );
};

export default PaymentSection;