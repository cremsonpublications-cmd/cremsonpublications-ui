import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { CreditCard, Shield, Truck } from 'lucide-react';

const PaymentSection = ({ orderSummary }) => {
  const { cartItems, customerInfo, appliedCoupon } = useCart();
  const navigate = useNavigate();

  // Prepare order data for payment - transform to match PaymentOption format
  const prepareOrderData = () => {
    // Generate a transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      buyPlaceOrderApiData: {
        transaction_id: transactionId,
        total_buy_amount: orderSummary.total,
        bond_details: cartItems.length > 0 ? {
          issuer_name: cartItems[0].name || "Product Purchase",
          issuer_logo: cartItems[0].main_image || ""
        } : {
          issuer_name: "Product Purchase",
          issuer_logo: ""
        }
      },
      // Include complete checkout data
      checkoutData: {
        cartItems,
        customerInfo,
        orderSummary: {
          subtotal: orderSummary.subtotal,
          couponDiscount: orderSummary.couponDiscount,
          deliveryCharge: orderSummary.deliveryCharge,
          total: orderSummary.total
        },
        appliedCoupon
      }
    };
  };

  const orderData = prepareOrderData();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <CreditCard size={20} />
        Payment Information
      </h2>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>₹{orderSummary.subtotal?.toFixed(2)}</span>
          </div>
          {orderSummary.couponDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Coupon Discount</span>
              <span>-₹{orderSummary.couponDiscount?.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span>{orderSummary.deliveryCharge === 0 ? 'FREE' : `₹${orderSummary.deliveryCharge?.toFixed(2)}`}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{orderSummary.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
        <div className="space-y-3">
          <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
            <input
              type="radio"
              id="razorpay"
              name="paymentMethod"
              value="razorpay"
              checked={true}
              readOnly
              className="h-4 w-4 text-black focus:ring-black border-gray-300"
            />
            <label htmlFor="razorpay" className="ml-3 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">Razorpay (UPI, Cards, Net Banking)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Secure Payment</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your payment information is encrypted and secure. We use Razorpay's PCI DSS compliant payment gateway.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <div className="space-y-4">
        <button
          onClick={() => navigate('/payment', { state: orderData })}
          className="w-full bg-black text-white px-6 py-4 rounded-md hover:bg-gray-800 transition-colors text-lg font-medium"
        >
          Pay ₹{orderSummary.total?.toFixed(2)}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By completing your purchase, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      {/* Delivery Info */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Truck size={20} className="text-green-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-green-900">Fast Delivery</h4>
            <p className="text-sm text-green-700 mt-1">
              Orders are typically delivered within 3-5 business days. You'll receive tracking information via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
