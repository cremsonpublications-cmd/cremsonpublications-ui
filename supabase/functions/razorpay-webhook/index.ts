import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Webhook received:', req.method)

    // Get webhook body
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    console.log('Webhook signature:', signature)

    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify webhook signature
    const razorpayWebhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')

    if (razorpayWebhookSecret) {
      // Verify signature using crypto
      const crypto = await import('node:crypto')
      const expectedSignature = crypto.createHmac('sha256', razorpayWebhookSecret)
        .update(body)
        .digest('hex')

      if (expectedSignature !== signature) {
        console.error('Invalid webhook signature')
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Parse webhook data
    const webhookData = JSON.parse(body)
    console.log('Webhook event:', webhookData.event)

    // Handle payment success events
    if (webhookData.event === 'payment.captured' || webhookData.event === 'payment.authorized') {
      const payment = webhookData.payload.payment.entity

      console.log('Payment successful:', {
        payment_id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
        status: payment.status
      })

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      // Check if order already exists
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('order_id')
        .eq('payment->razorpay_order_id', payment.order_id)
        .single()

      if (existingOrder) {
        console.log('Order already exists for payment:', payment.order_id)
        return new Response(
          JSON.stringify({ message: 'Order already processed' }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Store webhook notification for manual processing if needed
      const webhookRecord = {
        payment_id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount / 100, // Convert from paise to rupees
        status: payment.status,
        method: payment.method,
        webhook_event: webhookData.event,
        webhook_data: webhookData,
        processed: false,
        created_at: new Date().toISOString()
      }

      // Store in a webhook_notifications table (you'll need to create this)
      await supabase
        .from('webhook_notifications')
        .insert([webhookRecord])

      console.log('Webhook notification stored')

      // Note: Actual order creation should be done by the frontend after payment
      // This webhook serves as a backup notification system
    }

    return new Response(
      JSON.stringify({ message: 'Webhook processed successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})