# Razorpay Payment Integration Guide

## 🚀 Quick Start

Your payment integration is now set up to work with your real product data and customer information. Here's how to use it:

### **1. Deploy Edge Functions**

```bash
# Link your Supabase project
npx supabase link --project-ref vayisutwehvbjpkhzhcc

# Deploy the payment functions
npx supabase functions deploy test-order
npx supabase functions deploy test-verify-payment
```

### **2. Using the Payment Integration**

The integration automatically works with your existing:
- ✅ **Cart Context** (`src/context/CartContext.jsx`)
- ✅ **Product Types** (`src/types/product.types.ts`)
- ✅ **Customer Information** from your checkout flow
- ✅ **Real Address Data** (Indian states, addresses)

### **3. Payment Flow**

```javascript
// Your CheckoutPage now includes PaymentSection automatically
// Customer fills out information → PaymentSection validates → Razorpay opens → Payment verified → Order saved
```

## 📋 Integration Components

### **Created Files:**
1. `src/hooks/useRazorpayPayment.js` - Payment hook using your real data
2. `src/components/PaymentButton.jsx` - Button component integrated with your cart
3. `src/components/checkout/PaymentSection.jsx` - Full payment UI for checkout
4. `src/pages/PaymentSuccess.jsx` - Success page with order verification
5. `src/pages/PaymentFailed.jsx` - Failure page with retry options
6. `supabase/functions/test-order/` - Creates Razorpay orders
7. `supabase/functions/test-verify-payment/` - Verifies payments & saves orders

### **Updated Files:**
1. `src/pages/CheckoutPage.jsx` - Now includes payment section

## 🔧 Data Structure Used

### **Cart Items (from your CartContext):**
```javascript
{
  id: number,
  name: string,
  author: string,
  isbn: string,
  main_image: string,
  price: number,
  quantity: number
}
```

### **Customer Info (from your CartContext):**
```javascript
{
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  address: {
    street: string,
    apartment: string,
    city: string,
    state: string,
    pincode: string,
    country: string
  }
}
```

### **Order Summary (calculated in CheckoutPage):**
```javascript
{
  subtotal: number,
  couponDiscount: number,
  deliveryCharge: number,
  total: number
}
```

## 🛡️ Security Features

- ✅ **Payment Signature Verification** (server-side)
- ✅ **Amount Validation** (prevents tampering)
- ✅ **Idempotency Protection** (prevents duplicate orders)
- ✅ **Real Payment API Verification** (double-checks with Razorpay)
- ✅ **Order Recovery** (mobile payment issues fixed)

## 📱 Mobile Optimizations

- ✅ **localStorage Recovery** - Handles Safari page reloads
- ✅ **Payment Status Checking** - Verifies pending payments on page load
- ✅ **Retry Mechanisms** - Allows users to retry failed payments
- ✅ **Proper URL Handling** - Works with iPhone redirection issues

## 🎯 Usage Examples

### **Basic Usage (Automatic):**
Your existing checkout flow now includes payment functionality automatically.

### **Manual Payment Button:**
```jsx
import PaymentButton from '../components/PaymentButton';
import { useCart } from '../context/CartContext';

const MyComponent = () => {
  const { customerInfo } = useCart();

  const orderSummary = {
    subtotal: 1000,
    couponDiscount: 100,
    deliveryCharge: 0,
    total: 900
  };

  return (
    <PaymentButton
      orderSummary={orderSummary}
      onPaymentStart={() => console.log('Payment started')}
    >
      Pay Now ₹{orderSummary.total}
    </PaymentButton>
  );
};
```

### **Payment Section Component:**
```jsx
import PaymentSection from '../components/checkout/PaymentSection';

const Checkout = () => {
  const orderSummary = { /* your order summary */ };
  const shippingInfo = { method: 'standard', notes: '' };

  return (
    <PaymentSection
      orderSummary={orderSummary}
      shippingInfo={shippingInfo}
    />
  );
};
```

## 🔍 Testing

### **Test Data:**
- Use small amounts (₹1, ₹10) for testing
- Test with real Indian phone numbers
- Use valid PIN codes for address testing

### **Test Cards (Razorpay):**
- **Success:** 4111 1111 1111 1111
- **Failed:** 4000 0000 0000 0002
- **CVV:** Any 3-digit number
- **Expiry:** Any future date

## 🐛 Troubleshooting

### **Common Issues:**

1. **"Order not found" after payment**
   - Check if customer information is complete
   - Verify cart has items
   - Check browser console for errors

2. **Payment opens but fails immediately**
   - Verify Razorpay credentials in environment
   - Check if amount is valid (> ₹1)
   - Ensure cart total calculation is correct

3. **Mobile payment redirection issues**
   - The integration includes automatic recovery
   - Check localStorage for pending payments
   - Verify success/failure page URLs

### **Debug Steps:**
1. Check browser console for payment logs
2. Verify Supabase functions are deployed
3. Test with small amounts first
4. Check customer information is complete

## 📞 Support

If you encounter issues:
1. Check browser console logs
2. Verify all required customer fields are filled
3. Test with test credentials first
4. Check Supabase function logs for errors

---

🎉 **Your payment integration is ready!** The system now uses your real product data, customer addresses, and integrates seamlessly with your existing cart and checkout flow.