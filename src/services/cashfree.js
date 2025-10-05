// Frontend service for creating Cashfree orders directly without backend
export const createCashfreeOrder = async (orderData) => {
  try {
    const clientId = import.meta.env.VITE_CASHFREE_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_CASHFREE_CLIENT_SECRET;
    const environment = import.meta.env.VITE_CASHFREE_ENVIRONMENT || 'sandbox';

    // Cashfree API base URL
    const baseURL = environment === 'production'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg';

    const orderRequest = {
      order_amount: orderData.amount.toString(),
      order_currency: "INR",
      customer_details: {
        customer_id: orderData.customerId || `customer_${Date.now()}`,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
      },
      order_meta: {
        return_url: `${window.location.origin}/payment/success`,
      },
      order_note: orderData.note || "Payment for order",
    };

    console.log('Creating order with Cashfree API:', orderRequest);

    const response = await fetch(`${baseURL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': clientId,
        'X-Client-Secret': clientSecret,
        'x-api-version': '2023-08-01'
      },
      body: JSON.stringify(orderRequest)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cashfree API Error:', errorData);
      throw new Error(`Failed to create order: ${response.status}`);
    }

    const orderResponse = await response.json();
    console.log("Order created successfully:", orderResponse);

    return orderResponse;
  } catch (error) {
    console.error("Error creating Cashfree order:", error);
    throw new Error("Failed to create payment order");
  }
};

export const getOrderStatus = async (orderId) => {
  try {
    const clientId = import.meta.env.VITE_CASHFREE_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_CASHFREE_CLIENT_SECRET;
    const environment = import.meta.env.VITE_CASHFREE_ENVIRONMENT || 'sandbox';

    // Cashfree API base URL
    const baseURL = environment === 'production'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg';

    const response = await fetch(`${baseURL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': clientId,
        'X-Client-Secret': clientSecret,
        'x-api-version': '2023-08-01'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cashfree API Error:', errorData);
      throw new Error(`Failed to get order status: ${response.status}`);
    }

    const orderStatus = await response.json();
    console.log("Order status:", orderStatus);

    return orderStatus;
  } catch (error) {
    console.error("Error getting order status:", error);
    throw new Error("Failed to get order status");
  }
};