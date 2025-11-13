import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { XCircle, RefreshCw, Home, ShoppingBag } from 'lucide-react';

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const error = location.state?.error || 'Payment was cancelled or failed';

  useEffect(() => {
    // Clear location state to prevent re-processing
    window.history.replaceState({}, document.title);
  }, []);

  const handleRetryPayment = () => {
    // Navigate back to checkout
    navigate('/checkout', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Error Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle size={32} className="text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-lg text-gray-600">
            We couldn't process your payment. Don't worry, your card wasn't charged.
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What happened?</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Common Issues & Solutions</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-sm font-medium text-gray-900">Insufficient Funds</h3>
              <p className="text-sm text-gray-600">
                Check your account balance or try a different payment method.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-sm font-medium text-gray-900">Card Declined</h3>
              <p className="text-sm text-gray-600">
                Contact your bank or try a different card/UPI ID.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-sm font-medium text-gray-900">Network Issues</h3>
              <p className="text-sm text-gray-600">
                Check your internet connection and try again.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-sm font-medium text-gray-900">UPI Issues</h3>
              <p className="text-sm text-gray-600">
                Ensure your UPI app is updated and try a different UPI ID.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What would you like to do?</h2>
          <div className="space-y-4">
            <button
              onClick={handleRetryPayment}
              className="w-full bg-black text-white px-6 py-4 rounded-md hover:bg-gray-800 transition-colors text-lg font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Try Payment Again
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/cart"
                className="bg-gray-100 text-gray-900 px-4 py-3 rounded-md hover:bg-gray-200 transition-colors inline-block text-center flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                Review Cart
              </Link>
              <Link
                to="/shop"
                className="bg-gray-100 text-gray-900 px-4 py-3 rounded-md hover:bg-gray-200 transition-colors inline-block text-center"
              >
                Continue Shopping
              </Link>
            </div>

            <Link
              to="/"
              className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-md hover:bg-gray-200 transition-colors inline-block text-center flex items-center justify-center gap-2"
            >
              <Home size={16} />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Still having issues?</h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Our customer support team is here to help you complete your order.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">Email:</span>
                <p className="text-gray-600">support@cremsonpublications.com</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Phone:</span>
                <p className="text-gray-600">+91-XXXXXXXXXX</p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                <strong>Important:</strong> Your cart items are saved. You can try the payment again anytime within the next 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
