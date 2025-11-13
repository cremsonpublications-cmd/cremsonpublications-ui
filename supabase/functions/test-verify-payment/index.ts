import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// @ts-ignore: Deno global
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Generate HMAC SHA256 signature for verification
async function generateSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = encoder.encode(secret);
  const message = encoder.encode(payload);

  // Use Web Crypto API for HMAC
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  try {
    const requestBody = await req.json();
    console.log('Payment verification request:', JSON.stringify(requestBody, null, 2));

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = requestBody;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderData) {
      console.error('Missing required fields:', {
        razorpay_order_id: !!razorpay_order_id,
        razorpay_payment_id: !!razorpay_payment_id,
        razorpay_signature: !!razorpay_signature,
        orderData: !!orderData
      });
      return new Response(JSON.stringify({
        error: 'Missing required payment verification data',
        received: {
          razorpay_order_id: !!razorpay_order_id,
          razorpay_payment_id: !!razorpay_payment_id,
          razorpay_signature: !!razorpay_signature,
          orderData: !!orderData
        }
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Get Razorpay secret from environment
    const razorpayKeySecret = Deno.env.get('RAZORPAY_TEST_KEY_SECRET') || 'opVmGuDHyNwjLmIYkguQjmL6';
    if (!razorpayKeySecret) {
      return new Response(JSON.stringify({
        error: 'Razorpay secret not configured'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Verify payment signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = await generateSignature(sign, razorpayKeySecret);

    console.log('Signature verification:', {
      sign,
      expectedSignature,
      receivedSignature: razorpay_signature,
      match: expectedSignature === razorpay_signature
    });

    if (expectedSignature !== razorpay_signature) {
      console.error('Payment signature verification failed');
      return new Response(JSON.stringify({
        error: 'Payment verification failed',
        details: 'Invalid signature',
        debug: {
          expectedSignature,
          receivedSignature: razorpay_signature
        }
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify payment with Razorpay API
    const authHeader = `Basic ${btoa(`${Deno.env.get('RAZORPAY_TEST_KEY_ID')}:${razorpayKeySecret}`)}`;

    const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!paymentResponse.ok) {
      console.error('Failed to fetch payment details from Razorpay');
      return new Response(JSON.stringify({
        error: 'Payment verification failed',
        details: 'Could not verify payment with Razorpay'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    const paymentDetails = await paymentResponse.json();

    // Check if payment was successful
    if (paymentDetails.status !== 'captured') {
      return new Response(JSON.stringify({
        error: 'Payment not captured',
        details: `Payment status: ${paymentDetails.status}`
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Validate amount matches
    const expectedAmount = Math.round(orderData.total * 100); // Convert to paise
    console.log('Amount verification:', {
      orderDataTotal: orderData.total,
      expectedAmount,
      paymentDetailsAmount: paymentDetails.amount,
      match: paymentDetails.amount === expectedAmount
    });

    if (paymentDetails.amount !== expectedAmount) {
      console.error(`Amount mismatch: expected ${expectedAmount}, got ${paymentDetails.amount}`);
      return new Response(JSON.stringify({
        error: 'Payment amount verification failed',
        debug: {
          expectedAmount,
          receivedAmount: paymentDetails.amount,
          orderTotal: orderData.total
        }
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Save order to database
    const orderRecord = {
      order_id: `BOOK${Date.now()}${Math.floor(Math.random() * 1000000)}`,
      user_info: orderData.customerInfo,
      items: orderData.cartItems,
      order_summary: orderData.orderSummary,
      payment: {
        amount: paymentDetails.amount / 100, // Convert back to rupees
        method: 'Razorpay',
        status: 'Paid',
        transactionId: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        razorpay_signature: razorpay_signature
      },
      delivery: {
        shipping_address: orderData.shippingAddress
      },
      order_status: 'Confirmed',
      order_date: new Date().toISOString().split('T')[0]
    };

    const { data: savedOrder, error: orderError } = await supabase
      .from('orders')
      .insert(orderRecord)
      .select()
      .single();

    if (orderError) {
      console.error('Failed to save order:', orderError);
      return new Response(JSON.stringify({
        error: 'Failed to save order',
        details: orderError.message
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Payment verified and order saved:', savedOrder.id);

    return new Response(JSON.stringify({
      success: true,
      order: savedOrder,
      message: 'Payment verified and order placed successfully'
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
