// Simple text-based shipping label generator for Supabase Edge Functions
// Creates a formatted text file instead of PDF to avoid external dependencies

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
  items: Array<{
    productId: string;
    name: string;
    author: string;
    quantity: number;
    currentPrice: number;
    totalPrice: number;
  }>;
}

export const generateShippingLabelPDF = (orderData: OrderData): Uint8Array => {
  try {
    const currentDate = new Date().toLocaleDateString('en-GB');

    // Create formatted shipping label as text
    const shippingLabel = `
=====================================
       CREMSON PUBLICATIONS
       SHIPPING LABEL
=====================================

DATE: ${currentDate}                Order No: #${orderData.order_id}

PRINTED BOOKS(ORDER)                              REGD.

TO:
---

${orderData.user_info?.name || 'Customer Name'}

Address:-
${orderData.user_info?.address?.street || ''}
${orderData.user_info?.address?.city || ''}, ${orderData.user_info?.address?.state || ''} - ${orderData.user_info?.address?.pincode || ''}

Pin Code:- ${orderData.user_info?.address?.pincode || ''}
Contact No:- ${orderData.user_info?.phone || ''}

ITEMS:
------
${orderData.items && orderData.items.length > 0
  ? orderData.items.map(item => `Quantity:- ${item.quantity}\nSubject:- ${item.name}`).join('\n\n')
  : 'No items listed'
}

=====================================

FROM:-

CREMSON PUBLICATIONS
4578/15, (Basement) Aggarwal Road,
Opp. Happy School, Ansari Road
Daryaganj, New Delhi-110002

Email:-info@cremsonpublications.com
PH:-011-45785945

=====================================
    `;

    // Convert text to Uint8Array for email attachment
    const encoder = new TextEncoder();
    return encoder.encode(shippingLabel);

  } catch (error) {
    console.error('Error generating shipping label:', error);
    throw new Error(`Shipping label generation failed: ${error.message}`);
  }
};

export const generatePDFFileName = (orderData: OrderData): string => {
  const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  return `shipping_label_${orderData.order_id}_${currentDate}.txt`;
};