import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderData,
    } = await req.json();

    console.log("Processing payment validation (TEST MODE - SKIP RAZORPAY VERIFICATION)");
    console.log("Payment details:", { razorpay_payment_id, razorpay_order_id });

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

    // SKIP RAZORPAY VERIFICATION FOR TESTING
    console.log("SKIPPING Razorpay verification - assuming payment is valid");

    // Initialize Supabase client
    const supabaseUrl = "https://vayisutwehvbjpkhzhcc.supabase.co";
    const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheWlzdXR3ZWh2Ympwa2h6aGNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDAwODY3NCwiZXhwIjoyMDc1NTg0Njc0fQ.l6nfm7EBXi0XaIwn7hzQIZoo6F5mT9P1ec7O0FjCljs";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if order already exists
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("order_id")
      .eq("payment->razorpay_order_id", razorpay_order_id)
      .single();

    if (existingOrder) {
      console.log("Order already exists for payment:", razorpay_order_id);
      return new Response(
        JSON.stringify({
          success: true,
          status: "success",
          order_id: existingOrder.order_id,
          message: "Order already processed",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate order ID if not provided
    const finalOrderId = orderData.order_id || generateOrderId();

    // Prepare final order data with payment details
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

    // Create order in database
    console.log("Creating order in database...", finalOrderId);

    const { data: createdOrder, error: orderError } = await supabase
      .from("orders")
      .insert([finalOrderData])
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error(`Failed to save order to database: ${orderError.message}`);
    }

    console.log("Order created successfully:", finalOrderId);

    // Send confirmation email
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
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: "success",
        order_id: finalOrderId,
        order_data: createdOrder,
        message: "Payment validated and order created successfully (TEST MODE)",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in validate-payment-and-create-order-test:", error);
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