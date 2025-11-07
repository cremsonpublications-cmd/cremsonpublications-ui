import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface PaymentDetails {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface OrderData {
  order_id: string;
  user_info: {
    userId: string;
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
  order_summary: {
    subTotal: number;
    couponDiscount: number;
    deliveryCharge: number;
    grandTotal: number;
  };
  payment: {
    method: string;
    amount: number;
  };
  order_date: string;
}

const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `BOOK${timestamp}${random}`;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderData,
    }: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
      orderData: OrderData;
    } = await req.json();

    // Validate input
    if (!razorpay_payment_id || !razorpay_order_id || !orderData) {
      return new Response(
        JSON.stringify({
          success: false,
          status: "failed",
          message: "Missing required payment details or order data",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get Razorpay credentials from environment
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || 'rzp_live_RZNaICiFgLKhW2';
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || 'opVmGuDHyNwjLmIYkguQjmL6';

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(
        JSON.stringify({
          success: false,
          status: "failed",
          message: "Razorpay credentials not configured",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 1. Verify payment with Razorpay API
    const authHeader = `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`;

    console.log("Fetching payment details from Razorpay...", {
      payment_id: razorpay_payment_id,
      key_id: razorpayKeyId?.substring(0, 10) + "..." // Log partial key for debugging
    });

    const paymentResponse = await fetch(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Razorpay response status:", paymentResponse.status);

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error("Razorpay API error:", {
        status: paymentResponse.status,
        statusText: paymentResponse.statusText,
        error: errorText,
        headers: Object.fromEntries(paymentResponse.headers.entries())
      });

      return new Response(
        JSON.stringify({
          success: false,
          status: "failed",
          message: `Failed to verify payment with Razorpay: ${paymentResponse.status} ${errorText}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const paymentData = await paymentResponse.json();
    console.log("Payment data from Razorpay:", {
      status: paymentData.status,
      amount: paymentData.amount,
      order_id: paymentData.order_id,
    });

    // 2. Validate payment status
    if (
      paymentData.status !== "captured" &&
      paymentData.status !== "authorized"
    ) {
      console.log("Payment not successful:", paymentData.status);
      return new Response(
        JSON.stringify({
          success: false,
          status: "failed",
          message: `Payment status is ${paymentData.status}, not successful`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3. Validate payment amount matches order amount
    const expectedAmount = Math.round(orderData.order_summary.grandTotal * 100); // Convert to paise
    if (paymentData.amount !== expectedAmount) {
      console.error("Amount mismatch:", {
        expected: expectedAmount,
        received: paymentData.amount,
      });
      return new Response(
        JSON.stringify({
          success: false,
          status: "failed",
          message: "Payment amount does not match order total",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 4. Initialize Supabase client
    const supabaseUrl = "https://vayisutwehvbjpkhzhcc.supabase.co";
    const supabaseServiceKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheWlzdXR3ZWh2Ympwa2h6aGNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDAwODY3NCwiZXhwIjoyMDc1NTg0Njc0fQ.l6nfm7EBXi0XaIwn7hzQIZoo6F5mT9P1ec7O0FjCljs";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 5. Check if order already exists (idempotency check)
    const { data: existingOrders } = await supabase
      .from("orders")
      .select("order_id, order_status, payment")
      .or(`payment->>razorpay_order_id.eq.${razorpay_order_id},payment->>razorpay_payment_id.eq.${razorpay_payment_id}`);

    if (existingOrders && existingOrders.length > 0) {
      const existingOrder = existingOrders[0];
      console.log("Order already exists for payment:", {
        razorpay_order_id,
        razorpay_payment_id,
        existing_order_id: existingOrder.order_id
      });
      return new Response(
        JSON.stringify({
          success: true,
          status: "success",
          order_id: existingOrder.order_id,
          order_data: existingOrder,
          message: "Order already processed - idempotent response",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 6. Generate order ID if not provided
    const finalOrderId = orderData.order_id || generateOrderId();

    // 7. Prepare final order data with payment details
    const finalOrderData = {
      ...orderData,
      order_id: finalOrderId,
      payment: {
        ...orderData.payment,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        status: "Paid",
        payment_confirmed: true,
        payment_date: new Date().toISOString(),
      },
      order_status: "Confirmed",
      delivery: {
        status: "Order Placed",
        notes: "",
      },
      created_at: new Date().toISOString(),
    };

    // 8. Create order in database with retry logic
    console.log("Creating order in database...", finalOrderId);

    let createdOrder;
    let orderError;
    let retryAttempts = 0;
    const maxRetries = 3;

    while (retryAttempts < maxRetries) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .insert([finalOrderData])
          .select()
          .single();

        createdOrder = data;
        orderError = error;

        if (!error) {
          break; // Success, exit retry loop
        }

        // Check if it's a duplicate key error (order already exists)
        if (error.code === '23505' || error.message?.includes('duplicate')) {
          console.log("Duplicate order detected, checking existing order");
          const { data: existingOrder } = await supabase
            .from("orders")
            .select("*")
            .eq("order_id", finalOrderId)
            .single();

          if (existingOrder) {
            createdOrder = existingOrder;
            orderError = null;
            break;
          }
        }

        retryAttempts++;
        if (retryAttempts < maxRetries) {
          console.log(`Retry attempt ${retryAttempts} for order creation`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryAttempts));
        }
      } catch (err) {
        console.error(`Order creation attempt ${retryAttempts + 1} failed:`, err);
        retryAttempts++;
        if (retryAttempts < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retryAttempts));
        } else {
          orderError = err;
        }
      }
    }

    if (orderError) {
      console.error("Error creating order after retries:", orderError);
      throw new Error(
        `Failed to save order to database after ${maxRetries} attempts: ${orderError.message}`
      );
    }

    console.log("Order created successfully:", finalOrderId);

    // 9. Send confirmation email (background, don't fail order creation if this fails)
    try {
      const emailResponse = await fetch(
        `${supabaseUrl}/functions/v1/send-order-confirmation-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseServiceKey}`,
            apikey: supabaseServiceKey,
          },
          body: JSON.stringify({ orderData: finalOrderData }),
        }
      );

      if (emailResponse.ok) {
        console.log("Order confirmation email sent successfully");
      } else {
        const emailError = await emailResponse.text();
        console.error("Failed to send order confirmation email:", emailError);
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the order creation for email issues
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: "success",
        order_id: finalOrderId,
        order_data: createdOrder,
        message: "Payment validated and order created successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in validate-payment-and-create-order:", error);
    return new Response(
      JSON.stringify({
        success: false,
        status: "failed",
        message: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
