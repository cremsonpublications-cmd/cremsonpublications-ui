import React, { useEffect } from 'react';
import PaymentButton from '../components/PaymentButton';
import useRazorpayPayment from '../hooks/useRazorpayPayment';

const CheckoutPage = () => {
  const { checkPendingPayment } = useRazorpayPayment();

  // Sample order data - replace with your actual order data
  const orderData = {
    order_id: null, // Will be generated
    customer_details: {
      name: "John Doe",
      email: "john@example.com",
      phone: "9876543210",
      address: "123 Main St, City, State 12345"
    },
    order_summary: {
      subtotal: 1200,
      shipping: 50,
      tax: 150,
      discount: 100,
      grandTotal: 1300
    },
    items: [
      {
        id: "book1",
        title: "Sample Book 1",
        quantity: 2,
        price: 500,
        total: 1000
      },
      {
        id: "book2",
        title: "Sample Book 2",
        quantity: 1,
        price: 200,
        total: 200
      }
    ],
    delivery: {
      status: "Pending",
      expected_date: "2024-01-20"
    },
    payment: {
      method: "Razorpay",
      status: "Pending"
    }
  };

  // Check for any pending payments when component loads
  useEffect(() => {
    checkPendingPayment();
  }, [checkPendingPayment]);

  const handlePaymentStart = () => {
    console.log('Payment process started');
    // You can add loading states or analytics here
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1>Checkout</h1>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Order Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal:</span>
          <span>₹{orderData.order_summary.subtotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Shipping:</span>
          <span>₹{orderData.order_summary.shipping}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Tax:</span>
          <span>₹{orderData.order_summary.tax}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Discount:</span>
          <span>-₹{orderData.order_summary.discount}</span>
        </div>
        <hr />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          <span>Total:</span>
          <span>₹{orderData.order_summary.grandTotal}</span>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> {orderData.customer_details.name}</p>
        <p><strong>Email:</strong> {orderData.customer_details.email}</p>
        <p><strong>Phone:</strong> {orderData.customer_details.phone}</p>
        <p><strong>Address:</strong> {orderData.customer_details.address}</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <PaymentButton
          orderData={orderData}
          onPaymentStart={handlePaymentStart}
        >
          Pay ₹{orderData.order_summary.grandTotal} Now
        </PaymentButton>
      </div>

      <div style={{
        marginTop: '20px',
        fontSize: '12px',
        color: '#666',
        textAlign: 'center'
      }}>
        🔒 Your payment is secure and encrypted
      </div>
    </div>
  );
};

export default CheckoutPage;