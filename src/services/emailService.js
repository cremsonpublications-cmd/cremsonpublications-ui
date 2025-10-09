import { supabase } from './supabaseClient';

export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: orderData.customerEmail,
        subject: `Order Confirmation #${orderData.orderId} - Cremson Publications`,
        customerName: orderData.customerName,
        orderId: orderData.orderId,
        orderItems: orderData.items,
        totalAmount: orderData.totalAmount,
        shippingAddress: orderData.shippingAddress
      }
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
};

// Alternative method using direct fetch (if supabase.functions.invoke doesn't work)
export const sendOrderConfirmationEmailDirect = async (orderData) => {
  try {
    const response = await fetch(
      'https://onszmectsaddhcqhrpnt.supabase.co/functions/v1/send-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uc3ptZWN0c2FkZGhjcWhycG50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTE5MzcsImV4cCI6MjA3NDcyNzkzN30.8oON_0Z71U1tA_JUmMvvT-zF2-J-acrPtj0mEd4PnMU',
        },
        body: JSON.stringify({
          to: orderData.customerEmail,
          subject: `Order Confirmation #${orderData.orderId} - Cremson Publications`,
          customerName: orderData.customerName,
          orderId: orderData.orderId,
          orderItems: orderData.items,
          totalAmount: orderData.totalAmount,
          shippingAddress: orderData.shippingAddress
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log('Email sent successfully:', data);
      return { success: true, data };
    } else {
      console.error('Error sending email:', data);
      return { success: false, error: data.error || 'Failed to send email' };
    }
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
};
