import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
      orderData
    } = await req.json();

    console.log("Checking payment status for:", {
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id
    });

    // Validate input
    if (!razorpay_payment_id && !razorpay_order_id) {
      return new Response(
        JSON.stringify({
          success: false,
          status: "failed",
          message: "Payment ID or Order ID required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = "https://vayisutwehvbjpkhzhcc.supabase.co";
    const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheWlzdXR3ZWh2Ympwa2h6aGNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDAwODY3NCwiZXhwIjoyMDc1NTg0Njc0fQ.l6nfm7EBXi0XaIwn7hzQIZoo6F5mT9P1ec7O0FjCljs";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Check if order already exists in database
    let existingOrder = null;
    if (razorpay_payment_id) {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("payment->>razorpay_payment_id", razorpay_payment_id)
        .single();
      existingOrder = data;
    }

    if (!existingOrder && razorpay_order_id) {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("payment->>razorpay_order_id", razorpay_order_id)
        .single();
      existingOrder = data;
    }

    if (existingOrder) {
      console.log("Found existing order:", existingOrder.order_id);
      return new Response(
        JSON.stringify({
          success: true,
          status: "order_exists",
          order_id: existingOrder.order_id,
          order_data: existingOrder,
          message: "Order found in database",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. If no order exists but we have payment ID, verify payment status with Razorpay
    if (razorpay_payment_id) {
      const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || 'rzp_live_RZNaICiFgLKhW2';
      const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || 'opVmGuDHyNwjLmIYkguQjmL6';

      const authHeader = `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`;

      console.log("Checking payment status with Razorpay API...");

      const paymentResponse = await fetch(
        `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
        {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        }
      );

      if (!paymentResponse.ok) {
        console.error("Razorpay API error:", paymentResponse.status);
        return new Response(
          JSON.stringify({
            success: false,
            status: "payment_not_found",
            message: "Payment not found or invalid",
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
        order_id: paymentData.order_id
      });

      // 3. If payment is successful but no order exists, try to create order
      if (paymentData.status === "captured" || paymentData.status === "authorized") {
        if (orderData) {
          console.log("Payment successful, attempting to create order...");

          // Call the validation function to create the order
          try {
            const validateResponse = await fetch(
              `${supabaseUrl}/functions/v1/validate-payment-and-create-order`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${supabaseServiceKey}`,
                  apikey: supabaseServiceKey,
                },
                body: JSON.stringify({
                  razorpay_payment_id,
                  razorpay_order_id: paymentData.order_id || razorpay_order_id,
                  razorpay_signature: "", // Not available in status check
                  orderData,
                }),
              }
            );

            const validateResult = await validateResponse.json();

            if (validateResult.success) {
              console.log("Order created successfully via recovery");
              return new Response(
                JSON.stringify({
                  success: true,
                  status: "order_created",
                  order_id: validateResult.order_id,
                  order_data: validateResult.order_data,
                  message: "Payment was successful, order created via recovery",
                }),
                {
                  status: 200,
                  headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
              );
            } else {
              console.error("Failed to create order via recovery:", validateResult.message);
              return new Response(
                JSON.stringify({
                  success: false,
                  status: "recovery_failed",
                  payment_status: paymentData.status,
                  message: "Payment successful but order creation failed during recovery",
                }),
                {
                  status: 500,
                  headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
              );
            }
          } catch (recoveryError) {
            console.error("Recovery attempt failed:", recoveryError);
            return new Response(
              JSON.stringify({
                success: false,
                status: "recovery_failed",
                payment_status: paymentData.status,
                message: "Payment successful but order creation failed during recovery",
              }),
              {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          }
        } else {
          // Payment successful but no order data to create order
          return new Response(
            JSON.stringify({
              success: false,
              status: "payment_successful_no_order_data",
              payment_status: paymentData.status,
              message: "Payment successful but no order data available for creation",
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      } else {
        // Payment not successful
        return new Response(
          JSON.stringify({
            success: false,
            status: "payment_failed",
            payment_status: paymentData.status,
            message: `Payment status: ${paymentData.status}`,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // 4. No payment ID provided and no existing order
    return new Response(
      JSON.stringify({
        success: false,
        status: "no_data",
        message: "No payment information found",
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in check-payment-status:", error);
    return new Response(
      JSON.stringify({
        success: false,
        status: "error",
        message: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});