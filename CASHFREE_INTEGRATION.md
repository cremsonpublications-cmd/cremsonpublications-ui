# Cashfree Payment Integration

This document outlines the complete Cashfree payment integration implementation.

## Setup

### 1. Environment Variables

Add these to your `.env` file:

```env
VITE_CASHFREE_CLIENT_ID=your_cashfree_client_id_here
VITE_CASHFREE_CLIENT_SECRET=your_cashfree_client_secret_here
VITE_CASHFREE_ENVIRONMENT=sandbox  # or 'production'
```

### 2. Dependencies

```bash
npm install @cashfreepayments/cashfree-js
```

## Frontend Implementation

### Current Implementation

The frontend integration is complete in `src/pages/CheckoutPage.jsx` with:

- ✅ Cashfree SDK initialization
- ✅ Payment form validation
- ✅ Modal payment flow
- ✅ Order creation (using mock service)
- ✅ Payment processing with error handling
- ✅ Success/failure flow

### Payment Flow

1. User fills checkout form
2. Clicks "Pay Now" button
3. System validates form data
4. Creates order via backend API (currently mocked)
5. Initializes Cashfree payment session
6. Opens payment modal
7. Processes payment result
8. Redirects to success/failure page

## Backend Implementation Required

### Node.js/Express Backend Service

Create a backend service to handle order creation:

```javascript
// backend/routes/cashfree.js
const express = require('express');
const { Cashfree, CFEnvironment } = require('cashfree-pg');
const router = express.Router();

const cashfree = new Cashfree(
  process.env.CASHFREE_ENVIRONMENT === 'production'
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX,
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET
);

// Create order endpoint
router.post('/create-order', async (req, res) => {
  try {
    const { amount, customer_details, order_note } = req.body;

    const request = {
      order_amount: amount.toString(),
      order_currency: "INR",
      customer_details: {
        customer_id: customer_details.customer_id,
        customer_name: customer_details.customer_name,
        customer_email: customer_details.customer_email,
        customer_phone: customer_details.customer_phone,
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        notify_url: `${process.env.BACKEND_URL}/api/cashfree/webhook`,
      },
      order_note: order_note || "Payment for order",
    };

    const response = await cashfree.PGCreateOrder(request);
    res.json(response.data);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order status
router.get('/order-status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const response = await cashfree.PGOrderGet(orderId);
    res.json(response.data);
  } catch (error) {
    console.error('Order status error:', error);
    res.status(500).json({ error: 'Failed to get order status' });
  }
});

// Webhook endpoint for payment notifications
router.post('/webhook', (req, res) => {
  // Verify webhook signature
  // Process payment status updates
  // Update order status in database
  res.status(200).send('OK');
});

module.exports = router;
```

### Update Frontend Service

Replace the mock implementation in `src/services/cashfree.js`:

```javascript
export const createCashfreeOrder = async (orderData) => {
  try {
    const response = await fetch('/api/cashfree/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}` // Add your auth token
      },
      body: JSON.stringify({
        amount: orderData.amount,
        customer_details: {
          customer_id: orderData.customerId,
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
          customer_phone: orderData.customerPhone,
        },
        order_note: orderData.note
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating Cashfree order:", error);
    throw new Error("Failed to create payment order");
  }
};
```

## Testing

### Sandbox Testing

1. Set `VITE_CASHFREE_ENVIRONMENT=sandbox`
2. Use Cashfree test credentials
3. Use test card numbers for payments

### Test Cards

```
Card Number: 4111111111111111
CVV: 123
Expiry: Any future date
Name: Any name
```

## Security Best Practices

1. **Never expose client secret in frontend**
2. **Always validate payments server-side**
3. **Implement webhook verification**
4. **Use HTTPS in production**
5. **Validate order amounts server-side**
6. **Implement proper authentication**

## Production Deployment

1. Update environment variables to production values
2. Set `VITE_CASHFREE_ENVIRONMENT=production`
3. Use production Cashfree credentials
4. Implement proper backend API
5. Set up webhook endpoints
6. Configure proper CORS settings

## Features Implemented

- ✅ Modal payment integration
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Success/failure redirects
- ✅ Order creation
- ✅ Payment session management

## Additional Features to Implement

- [ ] Payment success page
- [ ] Order management system
- [ ] Email notifications
- [ ] Invoice generation
- [ ] Refund handling
- [ ] Webhook processing
- [ ] Payment analytics

## Support

For Cashfree specific issues, refer to:
- [Cashfree Documentation](https://docs.cashfree.com/)
- [Cashfree Developer Portal](https://www.cashfree.com/developers)