import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Mail, Home } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    // Redirect if no order data
    if (!order) {
      navigate('/', { replace: true });
    }

    // Clear location state to prevent re-processing
    window.history.replaceState({}, document.title);
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Confirmation Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package size={24} className="text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Order Confirmed</h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium text-gray-900">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-medium text-gray-900">{order.payment_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium text-gray-900">₹{order.amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.order_items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                    <img
                      src={item.main_image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Author: {item.author}
                      </p>
                      <p className="text-sm text-gray-500">
                        ISBN: {item.isbn}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Truck size={24} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
              </div>
              <div className="text-gray-700">
                <p className="font-medium">
                  {order.customer_info?.firstName} {order.customer_info?.lastName}
                </p>
                <p>{order.shipping_address?.street}</p>
                {order.shipping_address?.apartment && (
                  <p>{order.shipping_address.apartment}</p>
                )}
                <p>
                  {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.pincode}
                </p>
                <p>{order.shipping_address?.country}</p>
                <p className="mt-2">
                  <span className="font-medium">Phone:</span> {order.customer_info?.phone}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {order.customer_info?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Steps */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Order Confirmation Email</h4>
                    <p className="text-sm text-gray-600">
                      You'll receive an email confirmation with order details and tracking information.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Shipping Updates</h4>
                    <p className="text-sm text-gray-600">
                      We'll send you tracking updates once your order ships (typically within 2-3 business days).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Delivery Time</h4>
                    <p className="text-sm text-gray-600">
                      Standard delivery: 3-5 business days. Express delivery: 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/my-orders"
                  className="w-full bg-black text-white px-4 py-3 rounded-md hover:bg-gray-800 transition-colors inline-block text-center"
                >
                  View My Orders
                </Link>
                <Link
                  to="/shop"
                  className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-md hover:bg-gray-200 transition-colors inline-block text-center"
                >
                  Continue Shopping
                </Link>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Email:</span> support@cremsonpublications.com
                </p>
                <p>
                  <span className="font-medium">Phone:</span> +91-XXXXXXXXXX
                </p>
                <p className="mt-3">
                  Our customer support team is here to help with any questions about your order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
