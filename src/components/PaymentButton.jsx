import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const PaymentButton = ({ onPaymentStart, children, orderSummary, shippingInfo, paymentMethod = 'cod' }) => {
  const { cartItems, customerInfo, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if order is ready
  const isOrderReady =
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

  const handlePlaceOrder = async () => {
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

    setIsProcessing(true);

    try {
      if (paymentMethod === 'razorpay') {
        // Navigate to Razorpay payment page with order data
        const buyPlaceOrderApiData = {
          transaction_id: `TXN${Date.now()}`,
          total_buy_amount: orderSummary.total,
          subtotal: orderSummary.subtotal,
          coupon_discount: orderSummary.couponDiscount || 0,
          delivery_charge: orderSummary.deliveryCharge || 0,
          items: cartItems,
          user_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          user_email: customerInfo.email,
          user_phone: customerInfo.phone,
          user_address: customerInfo.address,
          notes: shippingInfo?.notes || ""
        };

        navigate('/buy_order/payment', {
          state: { buyPlaceOrderApiData }
        });
        return;
      }

      // Handle COD payment
      // Create order data
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
          notes: shippingInfo?.notes || ""
        },
        payment: {
          method: "Cash on Delivery",
          status: "Pending",
          amount: orderSummary.total
        },
        order_status: "Confirmed",
        order_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      };

      // Generate order ID
      const orderId = `BOOK${Date.now()}${Math.floor(Math.random() * 1000)}`;
      orderData.order_id = orderId;

      // Save order to database (you might want to create a simple API endpoint for this)
      // For now, we'll just store in localStorage for demonstration
      const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('user_orders', JSON.stringify(existingOrders));

      // Clear cart
      clearCart();

      // Show success alert
      alert('Order successful! Your order has been placed.');

      // Navigate to orders page
      navigate('/my-orders');

    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handlePlaceOrder}
      disabled={isProcessing || !isOrderReady}
      className={`payment-button ${isProcessing ? 'loading' : ''} ${!isOrderReady ? 'disabled' : ''}`}
      style={{
        backgroundColor: isProcessing ? '#ccc' : isOrderReady ? '#F37254' : '#e5e5e5',
        color: isProcessing ? '#666' : isOrderReady ? 'white' : '#999',
        padding: '16px 32px',
        border: 'none',
        borderRadius: '12px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: isProcessing || !isOrderReady ? 'not-allowed' : 'pointer',
        opacity: isProcessing ? 0.7 : 1,
        transition: 'all 0.3s ease',
        width: '100%',
        minHeight: '56px',
        boxShadow: isOrderReady && !isProcessing ? '0 4px 12px rgba(243, 114, 84, 0.3)' : 'none'
      }}
    >
      {isProcessing ? 'Placing Order...' : (children || `Place Order - ₹${orderSummary?.total?.toFixed(2) || '0.00'}`)}
    </button>
  );
};

export default PaymentButton;
