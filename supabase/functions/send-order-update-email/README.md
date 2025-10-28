# Send Order Update Email Function

This Supabase Edge Function sends order update notifications to both customers and admin when order status, tracking information, or delivery details are modified.

## Usage

### Endpoint
```
POST https://your-project-ref.supabase.co/functions/v1/send-order-update-email
```

### Request Body
```json
{
  "orderData": {
    "orderId": "string",
    "customerEmail": "string",
    "customerName": "string",
    "orderDate": "string",
    "deliveryStatus": "string",
    "trackingId": "string (optional)",
    "courier": "string (optional)",
    "trackingUrl": "string (optional)",
    "expectedDate": "string (optional)",
    "items": [
      {
        "productId": "string",
        "name": "string",
        "author": "string (optional)",
        "quantity": "number",
        "currentPrice": "number",
        "totalPrice": "number"
      }
    ],
    "totalAmount": "number",
    "shippingAddress": {
      "name": "string",
      "street": "string",
      "city": "string",
      "state": "string",
      "pincode": "string",
      "phone": "string"
    }
  }
}
```

### Response
```json
{
  "success": true,
  "messageId": "string",
  "message": "Order update email sent successfully"
}
```

## Features

- Sends emails to both customer and admin (info@cremsonpublications.com)
- Professional HTML email template with order update details
- Includes tracking information when available
- Fallback text version for email clients that don't support HTML
- Proper error handling and validation

## Environment Variables Required

- `BREVO_API_KEY`: Your Brevo API key for sending emails

## Email Recipients

1. **Customer**: Uses the email from `orderData.customerEmail`
2. **Admin**: Automatically sends to `info@cremsonpublications.com`

## Deployment

```bash
supabase functions deploy send-order-update-email
```