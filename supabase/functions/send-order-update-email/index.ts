import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface OrderItem {
  productId: string;
  name: string;
  author?: string;
  quantity: number;
  currentPrice: number;
  totalPrice: number;
}

interface OrderUpdateData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  orderDate: string;
  deliveryStatus: string;
  trackingId?: string;
  courier?: string;
  trackingUrl?: string;
  expectedDate?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
}

const generateOrderUpdateEmailHTML = (orderData: OrderUpdateData): string => {
  const itemsHTML = orderData.items.map((item: OrderItem) => `
    <div class="item">
      <span>${item.name} (Qty: ${item.quantity})</span>
      <span>₹${item.totalPrice}</span>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; color: #667eea; }
        .address { background: #e8f2ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .status-update { background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .logo { font-size: 24px; font-weight: bold; }
        .tracking { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📚 CREMSON PUBLICATIONS</div>
          <h1>Order Update</h1>
          <p>Your order has been updated, ${orderData.customerName}!</p>
        </div>

        <div class="content">
          <div class="status-update">
            <h3 style="color: #155724; margin: 0;">Order Status Update</h3>
            <p style="margin: 10px 0 0 0; color: #155724;">
              <strong>Order ID:</strong> ${orderData.orderId}<br>
              <strong>New Status:</strong> ${orderData.deliveryStatus}<br>
              <strong>Updated on:</strong> ${new Date().toLocaleDateString()}
            </p>
          </div>

          ${orderData.trackingId ? `
          <div class="tracking">
            <h3 style="color: #856404; margin: 0;">📦 Tracking Information</h3>
            <p style="margin: 10px 0 0 0; color: #856404;">
              <strong>Tracking ID:</strong> ${orderData.trackingId}<br>
              ${orderData.courier ? `<strong>Courier:</strong> ${orderData.courier}<br>` : ""}
              ${orderData.trackingUrl ? `<strong>Track Package:</strong> <a href="${orderData.trackingUrl}" target="_blank">Click here to track</a><br>` : ""}
              ${orderData.expectedDate ? `<strong>Expected Delivery:</strong> ${new Date(orderData.expectedDate).toLocaleDateString()}` : ""}
            </p>
          </div>
          ` : ""}

          <h2>Order Details</h2>
          <div class="order-details">
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Order Date:</strong> ${orderData.orderDate}</p>

            <h3>Items Ordered:</h3>
            ${itemsHTML}

            <div class="item total">
              <span>Total Amount:</span>
              <span>₹${orderData.totalAmount}</span>
            </div>
          </div>

          <h3>Shipping Address:</h3>
          <div class="address">
            <strong>${orderData.shippingAddress.name}</strong><br>
            ${orderData.shippingAddress.street}<br>
            ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}<br>
            Phone: ${orderData.shippingAddress.phone}
          </div>

          <div class="footer">
            <p><strong>Contact Us:</strong></p>
            <p>📞 011-4578594 | 📱 +91 79826 45175</p>
            <p>📧 info@cremsonpublications.com</p>
            <p>📍 4578/15 (Basement), Aggarwal Road, Opp. Happy School, Darya Ganj, New Delhi – 110002</p>
            <p style="margin-top: 20px; color: #999;">
              Thank you for choosing Cremson Publications for your educational needs!
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderData } = await req.json()

    // Validate input
    if (!orderData || !orderData.customerEmail) {
      return new Response(
        JSON.stringify({ error: 'Order data and customer email are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Brevo API key from environment
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    if (!brevoApiKey) {
      return new Response(
        JSON.stringify({ error: 'Brevo API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare email data for Brevo
    const emailData = {
      sender: {
        name: "Cremson Publications",
        email: "orders@cremsonpublications.com"
      },
      to: [
        {
          email: orderData.customerEmail,
          name: orderData.customerName
        },
        {
          email: "info@cremsonpublications.com",
          name: "Cremson Publications Admin"
        }
      ],
      subject: `Order Update #${orderData.orderId} - ${orderData.deliveryStatus} | Cremson Publications`,
      htmlContent: generateOrderUpdateEmailHTML(orderData),
      textContent: `
Order Update - ${orderData.orderId}

Dear ${orderData.customerName},

Your order has been updated!

Order Details:
- Order ID: ${orderData.orderId}
- New Status: ${orderData.deliveryStatus}
- Updated on: ${new Date().toLocaleDateString()}

${orderData.trackingId ? `
Tracking Information:
- Tracking ID: ${orderData.trackingId}
${orderData.courier ? `- Courier: ${orderData.courier}` : ''}
${orderData.expectedDate ? `- Expected Delivery: ${new Date(orderData.expectedDate).toLocaleDateString()}` : ''}
` : ''}

Items Ordered:
${orderData.items.map((item: OrderItem) => `- ${item.name} (Qty: ${item.quantity}) - ₹${item.totalPrice}`).join('\n')}

Total Amount: ₹${orderData.totalAmount}

Shipping Address:
${orderData.shippingAddress.name}
${orderData.shippingAddress.street}
${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.pincode}

Thank you for choosing Cremson Publications!
      `,
      tags: ["order-update"]
    }

    // Send email via Brevo API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify(emailData)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Brevo API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: error }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const result = await response.json()
    console.log('Order update email sent successfully:', result)

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.messageId,
        message: 'Order update email sent successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error sending order update email:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})