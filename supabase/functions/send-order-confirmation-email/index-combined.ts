import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// PDF Generation Code - Embedded
import { jsPDF } from "https://cdn.skypack.dev/jspdf@2.5.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface OrderItem {
  productId: string;
  name: string;
  author: string;
  quantity: number;
  currentPrice: number;
  totalPrice: number;
}

interface OrderData {
  order_id: string;
  user_info: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      apartment?: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  };
  items: OrderItem[];
  order_summary: {
    subTotal: number;
    couponDiscount: number;
    deliveryCharge: number;
    grandTotal: number;
  };
  payment: {
    method: string;
    transactionId: string;
    amount: number;
  };
  order_date: string;
}

// PDF Generation Functions
const generateShippingLabelPDF = (orderData: OrderData): Uint8Array => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;

    pdf.setFont('helvetica');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');

    const currentDate = new Date().toLocaleDateString('en-GB');
    pdf.text(`DATE: ${currentDate}`, pageWidth - 60, 20);
    pdf.text(`Order No: #${orderData.order_id}`, 20, 30);

    pdf.setFontSize(14);
    pdf.text('PRINTED BOOKS(ORDER)', 20, 45);
    pdf.text('REGD.', pageWidth - 30, 45);

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TO', 20, 65);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    let yPosition = 80;

    pdf.setFont('helvetica', 'bold');
    pdf.text(orderData.user_info?.name || 'Customer Name', 30, yPosition);
    yPosition += 10;

    pdf.setFont('helvetica', 'normal');
    pdf.text('Address:-', 30, yPosition);
    yPosition += 8;

    if (orderData.user_info?.address?.street) {
      const streetText = pdf.splitTextToSize(orderData.user_info.address.street, 150);
      pdf.text(streetText, 30, yPosition);
      yPosition += streetText.length * 6;
    }

    const locationText = `${orderData.user_info?.address?.city || ''}, ${orderData.user_info?.address?.state || ''} - ${orderData.user_info?.address?.pincode || ''}`;
    pdf.text(locationText, 30, yPosition);
    yPosition += 8;

    pdf.text(`Pin Code:- ${orderData.user_info?.address?.pincode || ''}`, 30, yPosition);
    yPosition += 8;

    pdf.text(`Contact No:- ${orderData.user_info?.phone || ''}`, 30, yPosition);
    yPosition += 10;

    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach((item) => {
        pdf.text(`Quantity:- ${item.quantity}`, 30, yPosition);
        yPosition += 6;
        pdf.text(`Subject:- ${item.name}`, 30, yPosition);
        yPosition += 8;
      });
    }

    yPosition += 15;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FROM:-', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CREMSON PUBLICATIONS', 20, yPosition);
    yPosition += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.text('4578/15, (Basement) Aggarwal Road,', 20, yPosition);
    yPosition += 6;
    pdf.text('Opp. Happy School, Ansari Road', 20, yPosition);
    yPosition += 6;
    pdf.text('Daryaganj, New Delhi-110002', 20, yPosition);
    yPosition += 10;

    pdf.text('Email:-info@cremsonpublications.com', 20, yPosition);
    yPosition += 6;
    pdf.text('PH:-011-45785945', 20, yPosition);

    pdf.setLineWidth(0.5);
    pdf.rect(15, 15, pageWidth - 30, yPosition - 5);

    const pdfArrayBuffer = pdf.output('arraybuffer');
    return new Uint8Array(pdfArrayBuffer);

  } catch (error) {
    console.error('Error generating shipping label PDF:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

const generatePDFFileName = (orderData: OrderData): string => {
  const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  return `shipping_label_${orderData.order_id}_${currentDate}.pdf`;
};

// Email HTML Generation
const generateEmailHTML = (orderData: OrderData): string => {
  const itemsHTML = orderData.items.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px; border-right: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <small style="color: #666;">by ${item.author}</small>
      </td>
      <td style="padding: 12px; text-align: center; border-right: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 12px; text-align: right; border-right: 1px solid #eee;">₹${item.currentPrice.toFixed(2)}</td>
      <td style="padding: 12px; text-align: right;">₹${item.totalPrice.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Cremson Publications</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Thank you for your order with Cremson Publications</p>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #495057; margin: 0 0 15px 0; font-size: 20px;">Order Details</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <strong>Order ID:</strong>
            <span style="color: #667eea; font-weight: bold;">${orderData.order_id}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <strong>Order Date:</strong>
            <span>${new Date(orderData.order_date).toLocaleDateString('en-IN')}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <strong>Payment Method:</strong>
            <span>${orderData.payment.method}</span>
          </div>
        </div>

        <h3 style="color: #495057; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Shipping Address</h3>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
          <strong>${orderData.user_info.name}</strong><br>
          ${orderData.user_info.address.street}${orderData.user_info.address.apartment ? ', ' + orderData.user_info.address.apartment : ''}<br>
          ${orderData.user_info.address.city}, ${orderData.user_info.address.state} ${orderData.user_info.address.pincode}<br>
          ${orderData.user_info.address.country}<br>
          <strong>Phone:</strong> ${orderData.user_info.phone}
        </div>

        <h3 style="color: #495057; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid #ddd;">
          <thead>
            <tr style="background: #667eea; color: white;">
              <th style="padding: 12px; text-align: left;">Book</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
              <th style="padding: 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3 style="margin: 0 0 15px 0; color: #495057;">Order Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <span>₹${orderData.order_summary.subTotal.toFixed(2)}</span>
          </div>
          ${orderData.order_summary.couponDiscount > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #28a745;">
            <span>Discount:</span>
            <span>-₹${orderData.order_summary.couponDiscount.toFixed(2)}</span>
          </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Delivery Charge:</span>
            <span>${orderData.order_summary.deliveryCharge === 0 ? 'FREE' : '₹' + orderData.order_summary.deliveryCharge.toFixed(2)}</span>
          </div>
          <hr style="margin: 15px 0; border: none; border-top: 2px solid #667eea;">
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #667eea;">
            <span>Total Paid:</span>
            <span>₹${orderData.order_summary.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div style="background: #e8f4fd; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0;">
          <h4 style="margin: 0 0 10px 0; color: #495057;">What's Next?</h4>
          <ul style="margin: 0; padding-left: 20px; color: #666;">
            <li>We'll process your order within 1-2 business days</li>
            <li>You'll receive a shipping confirmation email with tracking details</li>
            <li>Standard delivery takes 5-7 business days</li>
            <li>For any questions, contact us at support@cremsonpublications.com</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; margin: 0;">Thank you for choosing Cremson Publications!</p>
          <p style="color: #999; font-size: 14px; margin: 10px 0 0 0;">
            Transaction ID: ${orderData.payment.transactionId}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderData } = await req.json()

    if (!orderData || !orderData.user_info?.email) {
      return new Response(
        JSON.stringify({ error: 'Order data and email are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

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

    // Generate PDF for admin attachment
    let pdfAttachment = null;
    try {
      const pdfBuffer = generateShippingLabelPDF(orderData);
      const pdfFileName = generatePDFFileName(orderData);

      const base64PDF = btoa(String.fromCharCode(...pdfBuffer));

      pdfAttachment = {
        content: base64PDF,
        name: pdfFileName
      };
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError);
    }

    // Customer email (without PDF)
    const customerEmailData = {
      sender: {
        name: "Cremson Publications",
        email: "orders@cremsonpublications.com"
      },
      to: [
        {
          email: orderData.user_info.email,
          name: orderData.user_info.name
        }
      ],
      subject: `Order Confirmation - ${orderData.order_id} | Cremson Publications`,
      htmlContent: generateEmailHTML(orderData),
      tags: ["order-confirmation"]
    }

    // Admin email (with PDF attachment)
    const adminEmailData = {
      sender: {
        name: "Cremson Publications",
        email: "orders@cremsonpublications.com"
      },
      to: [
        {
          email: "info@cremsonpublications.com",
          name: "Cremson Publications Admin"
        }
      ],
      subject: `New Order Received - ${orderData.order_id} | Admin Copy`,
      htmlContent: generateEmailHTML(orderData),
      tags: ["order-confirmation", "admin"],
      ...(pdfAttachment && { attachment: [pdfAttachment] })
    }

    // Send both emails
    const customerResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify(customerEmailData)
    })

    const adminResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify(adminEmailData)
    })

    const customerResult = customerResponse.ok ? await customerResponse.json() : null;
    const adminResult = adminResponse.ok ? await adminResponse.json() : null;

    if (!customerResponse.ok) {
      const error = await customerResponse.text()
      console.error('Customer email failed:', error)
    }

    if (!adminResponse.ok) {
      const error = await adminResponse.text()
      console.error('Admin email failed:', error)
    }

    if (customerResponse.ok || adminResponse.ok) {
      console.log('Emails sent:', {
        customer: customerResult?.messageId || 'failed',
        admin: adminResult?.messageId || 'failed',
        pdfAttached: !!pdfAttachment
      })

      return new Response(
        JSON.stringify({
          success: true,
          customerMessageId: customerResult?.messageId,
          adminMessageId: adminResult?.messageId,
          pdfAttached: !!pdfAttachment,
          message: 'Order confirmation emails sent successfully'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to send both customer and admin emails' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})