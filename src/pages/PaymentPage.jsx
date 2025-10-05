import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import {
  CheckCircle,
  ShoppingBag,
  Truck,
  Package,
  ArrowRight
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';
import { Link } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    getTotalPrice,
    getTotalItems,
    getCouponDiscount,
    appliedCoupon,
    customerInfo,
    shippingInfo,
    clearCart,
    clearCheckoutData
  } = useCart();
  const { user } = useAuth();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validation function to check if customer and shipping info is complete
  const isCheckoutComplete = () => {
    return (
      customerInfo.email?.trim() &&
      customerInfo.firstName?.trim() &&
      customerInfo.lastName?.trim() &&
      customerInfo.address?.street?.trim() &&
      customerInfo.address?.city?.trim() &&
      customerInfo.address?.state?.trim() &&
      customerInfo.address?.pincode?.trim() &&
      customerInfo.phone?.trim() &&
      shippingInfo.method
    );
  };

  // No validation alerts - just let users navigate freely

  // Calculate order summary
  const subtotal = getTotalPrice();
  const couponDiscount = getCouponDiscount();
  const deliveryCharge = 0; // Free shipping
  const total = subtotal - couponDiscount + deliveryCharge;

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BOOK${timestamp}${random}`;
  };

  const createOrderInDatabase = async (paymentDetails) => {
    try {
      const orderId = generateOrderId();
      const currentDate = new Date().toISOString().split('T')[0];

      // Prepare order data according to database schema
      const orderData = {
        order_id: orderId,
        user_info: {
          userId: user?.id || 'guest',
          name: customerInfo.firstName && customerInfo.lastName
            ? `${customerInfo.firstName} ${customerInfo.lastName}`
            : user?.name || 'Guest User',
          email: customerInfo.email || user?.email || 'guest@example.com',
          phone: customerInfo.phone || '+91-9876543210',
          address: {
            street: customerInfo.address.street || '54 Green First Parkway',
            apartment: customerInfo.address.apartment || '',
            city: customerInfo.address.city || 'Tirunelveli',
            state: customerInfo.address.state || 'Tamil Nadu',
            pincode: customerInfo.address.pincode || '627426',
            country: customerInfo.address.country || 'India'
          }
        },
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          author: item.author || 'Unknown Author',
          quantity: item.quantity,
          currentPrice: item.price,
          totalPrice: item.price * item.quantity
        })),
        order_summary: {
          subTotal: subtotal,
          couponDiscount: couponDiscount,
          discountTotal: couponDiscount,
          deliveryCharge: deliveryCharge,
          grandTotal: total
        },
        payment: {
          method: 'Cashfree',
          status: 'Paid',
          transactionId: paymentDetails.cashfree_payment_id,
          cashfree_order_id: paymentDetails.cashfree_order_id,
          cashfree_signature: paymentDetails.cashfree_signature,
          amount: total
        },
        delivery: {
          status: 'Processing',
          deliveryType: shippingInfo.method === 'free' ? 'Free Shipping' : 'Standard Delivery',
          expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
          trackingId: `TRK${Date.now()}`,
          notes: shippingInfo.notes || ''
        },
        order_status: 'Confirmed',
        order_date: currentDate
      };

      // Insert order into database
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to save order to database');
      }

      return { orderId, orderData };
    } catch (error) {
      console.error('Error in createOrderInDatabase:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Prepare payment data for Cashfree
      const paymentData = {
        amount: total,
        customerInfo,
        orderDetails: {
          items: cartItems.length,
          total: total,
          itemNames: cartItems.map(item => item.name).join(', ')
        },
        onSuccess: async (cashfreeResponse) => {
          try {
            // Verify payment
            const verificationResult = await verifyCashfreePayment(cashfreeResponse);

            if (verificationResult.success) {
              // Create order in database
              const { orderId, orderData } = await createOrderInDatabase(cashfreeResponse);

              // Store order details and show success
              setOrderDetails({
                orderId: orderId,
                total: total,
                items: cartItems.length,
                deliveryDate: orderData.delivery.expectedDate
              });

              // Clear cart and checkout data after successful order
              clearCart();
              clearCheckoutData();

              // Show success popup and toast
              setOrderPlaced(true);
              toast.success('Order placed successfully! 🎉');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Error after payment success:', error);
            toast.error('Payment was successful but there was an issue saving your order. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        onFailure: (error) => {
          console.error('Payment failed:', error);
          toast.error('Payment failed: ' + (error.error_description || 'Unknown error'));
          setLoading(false);
        },
        onDismiss: () => {
          console.log('Payment dismissed by user');
          setLoading(false);
        }
      };

      // Start Cashfree payment
      await startCashfreePayment(paymentData);

    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  // No auto-placement, user will click to pay

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-frame mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some books to get started!</p>
          <a href="/shop" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-frame mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing your order...</h2>
          <p className="text-gray-600">Please wait while we confirm your order.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-frame mx-auto px-4 py-8">
      {/* Checkout Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/cart">Cart</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/checkout">Information</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/checkout/shipping">Shipping</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Payment</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Payment Content */}
      {!orderPlaced ? (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">PAY</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Razorpay</p>
                          <p className="text-sm text-gray-600">Credit Card, Debit Card, UPI, Net Banking, Wallets</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                    <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Coupon Discount</span>
                      <span className="text-green-600">-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">₹{total.toFixed(2)}</div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-md font-semibold text-white transition-colors ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Order Success Content */
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Successful!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your order. We've received your payment and your order is being processed.
            </p>
          </div>

          {orderDetails && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">{orderDetails.orderId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="font-semibold">{orderDetails.items} items</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-green-600 font-bold">₹</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold">₹{orderDetails.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Expected Delivery</p>
                    <p className="font-semibold">{new Date(orderDetails.deliveryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => navigate('/my-orders')}
              className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              View My Orders
              <ArrowRight size={20} />
            </button>

            <button
              onClick={() => navigate('/shop')}
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <CheckCircle size={60} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been successfully placed and saved to our database.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/my-orders')}
                className="w-full bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                View My Orders
              </button>
              <button
                onClick={() => setOrderPlaced(false)}
                className="w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;