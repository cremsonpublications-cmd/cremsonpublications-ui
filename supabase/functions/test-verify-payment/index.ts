import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `BOOK${timestamp}${random}`;
};

// HMAC SHA256 function for Deno
async function createHMAC(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }

  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderData
    } = await req.json();

    console.log("Payment verification request:", {
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      has_signature: !!razorpay_signature,
      has_order_data: !!orderData
    });

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !orderData) {
      return new Response(JSON.stringify({
        success: false,
        message: "Missing required payment details or order data"
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    // Get Razorpay credentials from environment
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || 'rzp_live_RZNaICiFgLKhW2';
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || 'opVmGuDHyNwjLmIYkguQjmL6';

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(JSON.stringify({
        success: false,
        message: "Razorpay credentials not configured"
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    // 1️⃣ Verify payment signature
    const expectedSignature = await createHMAC(
      razorpayKeySecret,
      razorpay_order_id + "|" + razorpay_payment_id
    );

    console.log("Signature verification:", {
      expected: expectedSignature,
      received: razorpay_signature,
      match: expectedSignature === razorpay_signature
    });

    if (expectedSignature !== razorpay_signature) {
      return new Response(JSON.stringify({
        success: false,
        message: "Payment signature verification failed"
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    // 2️⃣ Verify payment with Razorpay API
    const authHeader = `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`;

    console.log("Verifying payment with Razorpay API:", razorpay_payment_id);

    const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      }
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error("Razorpay API error:", errorText);
      return new Response(JSON.stringify({
        success: false,
        message: `Payment verification failed: ${errorText}`
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    const paymentData = await paymentResponse.json();
    console.log("Payment verification successful:", {
      status: paymentData.status,
      amount: paymentData.amount,
      order_id: paymentData.order_id
    });

    // 3️⃣ Validate payment status and amount
    if (paymentData.status !== "captured") {
      return new Response(JSON.stringify({
        success: false,
        message: `Payment status is ${paymentData.status}, not captured`
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    // Validate payment amount
    const expectedAmount = Math.round((orderData.order_summary?.grandTotal || 0) * 100);
    if (paymentData.amount !== expectedAmount) {
      console.error("Amount mismatch:", {
        expected: expectedAmount,
        received: paymentData.amount,
        orderSummary: orderData.order_summary
      });
      return new Response(JSON.stringify({
        success: false,
        message: "Payment amount mismatch"
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    // 4️⃣ Initialize Supabase client
    const supabaseUrl = "https://vayisutwehvbjpkhzhcc.supabase.co";
    const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheWlzdXR3ZWh2Ympwa2h6aGNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDAwODY3NCwiZXhwIjoyMDc1NTg0Njc0fQ.l6nfm7EBXi0XaIwn7hzQIZoo6F5mT9P1ec7O0FjCljs";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 5️⃣ Check for duplicate orders (idempotency)
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("*")
      .eq("payment->razorpay_payment_id", razorpay_payment_id)
      .single();

    if (existingOrder) {
      console.log("Order already exists for payment:", razorpay_payment_id);
      return new Response(JSON.stringify({
        success: true,
        order_id: existingOrder.order_id,
        order_data: existingOrder,
        message: "Order already processed"
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    // 6️⃣ Create new order in database
    const finalOrderId = orderData.order_id || generateOrderId();

    const finalOrderData = {
      ...orderData,
      order_id: finalOrderId,
      payment: {
        ...orderData.payment,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        status: "Paid",
        transactionId: razorpay_payment_id
      },
      order_status: "Confirmed",
      delivery: {
        ...orderData.delivery,
        status: "Order Placed"
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log("Creating order in database:", finalOrderId);

    const { data: createdOrder, error: orderError } = await supabase
      .from("orders")
      .insert([finalOrderData])
      .select()
      .single();

    if (orderError) {
      console.error("Database error:", orderError);
      return new Response(JSON.stringify({
        success: false,
        message: `Failed to save order: ${orderError.message}`
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    console.log("Order created successfully:", finalOrderId);

    // 7️⃣ Send confirmation email (optional, in background)
    try {
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-order-confirmation-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceKey}`,
          apikey: supabaseServiceKey
        },
        body: JSON.stringify({ orderData: finalOrderData })
      });

      if (emailResponse.ok) {
        console.log("Order confirmation email sent");
      } else {
        console.log("Email sending failed (non-critical)");
      }
    } catch (emailError) {
      console.log("Email error (non-critical):", emailError);
    }

    return new Response(JSON.stringify({
      success: true,
      order_id: finalOrderId,
      order_data: createdOrder,
      payment_status: "verified",
      message: "Payment verified and order created successfully"
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    console.error("Error in test-verify-payment:", error);
    return new Response(JSON.stringify({
      success: false,
      message: error.message || "Internal server error"
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});