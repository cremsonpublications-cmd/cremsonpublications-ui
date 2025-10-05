import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import {
  CreditCard,
  MapPin,
  User,
  Mail,
  ShoppingBag,
  Truck,
  Edit
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

const ShippingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    cartItems,
    getTotalPrice,
    getTotalItems,
    getCouponDiscount,
    appliedCoupon,
    customerInfo,
    shippingInfo,
    updateShippingMethod,
    updateShippingNotes,
    clearCart,
    clearCheckoutData
  } = useCart();
  const { user } = useAuth();

  // Get data from navigation state
  const navigationData = location.state;
  const displayCustomerInfo = navigationData?.customerInfo || customerInfo;

  // Order processing state
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Validation function to check if customer info is complete
  const isCustomerInfoComplete = () => {
    return (
      customerInfo.email?.trim() &&
      customerInfo.firstName?.trim() &&
      customerInfo.lastName?.trim() &&
      customerInfo.address?.street?.trim() &&
      customerInfo.address?.city?.trim() &&
      customerInfo.address?.state?.trim() &&
      customerInfo.address?.pincode?.trim() &&
      customerInfo.phone?.trim()
    );
  };

  // No validation alerts - just let users navigate freely

  // Order summary state
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    couponDiscount: 0,
    deliveryCharge: 0,
    total: 0
  });

  // Shipping methods
  const shippingMethods = [
    {
      id: 'free',
      name: 'Free shipping',
      description: 'Standard delivery (5-7 business days)',
      price: 0,
      icon: <Truck size={20} />
    }
  ];

  // Calculate order summary
  useEffect(() => {
    const subtotal = getTotalPrice();
    const couponDiscount = getCouponDiscount();
    const selectedMethod = shippingMethods.find(method => method.id === shippingInfo.method);
    const deliveryCharge = 0; // Always free delivery
    const total = subtotal - couponDiscount + deliveryCharge;

    setOrderSummary({
      subtotal,
      couponDiscount,
      deliveryCharge,
      total: Math.max(0, total)
    });
  }, [cartItems, getTotalPrice, getCouponDiscount, shippingInfo.method]);

  // Calculate final order values
  const subtotal = getTotalPrice();
  const couponDiscount = getCouponDiscount();
  const deliveryCharge = 0; // Free shipping
  const total = subtotal - couponDiscount + deliveryCharge;

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BOOK${timestamp}${random}`;
  };

  const createOrderInDatabase = async () => {
    try {
      const orderId = generateOrderId();
      const currentDate = new Date().toISOString().split('T')[0];

      // Prepare order data according to database schema
      const orderData = {
        order_id: orderId,
        user_info: {
          userId: user?.id || 'guest',
          name: displayCustomerInfo.firstName && displayCustomerInfo.lastName
            ? `${displayCustomerInfo.firstName} ${displayCustomerInfo.lastName}`
            : user?.name || 'Guest User',
          email: displayCustomerInfo.email || user?.email || 'guest@example.com',
          phone: displayCustomerInfo.phone || '+91-9876543210',
          address: {
            street: displayCustomerInfo.address.street || '54 Green First Parkway',
            apartment: displayCustomerInfo.address.apartment || '',
            city: displayCustomerInfo.address.city || 'Tirunelveli',
            state: displayCustomerInfo.address.state || 'Tamil Nadu',
            pincode: displayCustomerInfo.address.pincode || '627426',
            country: displayCustomerInfo.address.country || 'India'
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
          method: 'Cash on Delivery',
          status: 'Confirmed',
          transactionId: `TXN${Date.now()}`,
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

  const handlePlaceOrder = async () => {
    setIsProcessingOrder(true);

    try {
      // Create order directly in database
      const { orderId, orderData } = await createOrderInDatabase();

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

      // Show success and navigate to orders page
      setOrderPlaced(true);
      toast.success('Order placed successfully! 🎉');

      // Navigate to orders page after a short delay
      setTimeout(() => {
        navigate('/my-orders');
      }, 2000);

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
      setIsProcessingOrder(false);
    }
  };

  const handleChangeContact = () => {
    navigate('/checkout', {
      state: {
        customerInfo: displayCustomerInfo,
        returnFromShipping: true
      }
    });
  };

  const handleChangeAddress = () => {
    navigate('/checkout', {
      state: {
        customerInfo: displayCustomerInfo,
        returnFromShipping: true
      }
    });
  };

  if (cartItems.length === 0) {
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
            <BreadcrumbPage>Shipping</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information Display */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail size={18} />
                Contact
              </h2>
              <button
                onClick={handleChangeContact}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <Edit size={14} />
                Change
              </button>
            </div>
            <p className="text-gray-700">
              {displayCustomerInfo.email || <span className="text-gray-500 italic">No email provided. Please go back to add your email.</span>}
            </p>
          </div>

          {/* Shipping Address Display */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin size={18} />
                Ship to
              </h2>
              <button
                onClick={handleChangeAddress}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <Edit size={14} />
                Change
              </button>
            </div>
            <div className="text-gray-700">
              {displayCustomerInfo.address?.street ? (
                <>
                  <p>{displayCustomerInfo.address.street}</p>
                  {displayCustomerInfo.address.apartment && <p>{displayCustomerInfo.address.apartment}</p>}
                  <p>
                    {displayCustomerInfo.address.city} {displayCustomerInfo.address.pincode}, {displayCustomerInfo.address.state}
                  </p>
                  <p>{displayCustomerInfo.address.country}</p>
                </>
              ) : (
                <p className="text-gray-500 italic">No shipping address provided. Please go back to add your address.</p>
              )}
            </div>
          </div>

          {/* Shipping Methods */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck size={18} />
              Shipping Methods
            </h2>
            <div className="space-y-3">
              {shippingMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    shippingInfo.method === method.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={shippingInfo.method === method.id}
                    onChange={(e) => updateShippingMethod(e.target.value)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {method.icon}
                        <span className="font-medium text-gray-900">{method.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {method.price === 0 ? 'FREE' : `₹${method.price}`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order notes (optional)
            </h2>
            <textarea
              value={shippingInfo.notes}
              onChange={(e) => updateShippingNotes(e.target.value)}
              placeholder="Special instructions for your order..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
            />
          </div>

          {/* Return to Information Button */}
          <div className="flex justify-start">
            <button
              onClick={() => navigate('/checkout')}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← Return to information
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.main_image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                <span className="text-gray-900">₹{orderSummary.subtotal.toFixed(2)}</span>
              </div>

              {orderSummary.couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">Coupon Discount</span>
                    {appliedCoupon && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {appliedCoupon.code}
                      </span>
                    )}
                  </div>
                  <span className="text-green-600">-₹{orderSummary.couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {orderSummary.deliveryCharge === 0 ? 'FREE' : `₹${orderSummary.deliveryCharge.toFixed(2)}`}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₹{orderSummary.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessingOrder}
              className={`w-full mt-6 py-3 px-4 rounded-md transition-colors ${
                isProcessingOrder
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isProcessingOrder ? 'Placing Order...' : 'Place Order →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;