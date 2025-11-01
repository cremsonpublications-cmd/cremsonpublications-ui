export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the payment data from the request body (form data)
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log('Razorpay callback received:', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    // Validate that we have the required payment data
    if (!razorpay_payment_id || !razorpay_order_id) {
      console.error('Missing required payment data');
      return res.status(400).json({ error: 'Missing payment data' });
    }

    // Construct the redirect URL to the client-side payment callback page
    const redirectUrl = new URL(`${req.headers.origin || 'https://www.cremsonpublications.com'}/payment-callback`);

    // Add the payment parameters as query parameters
    redirectUrl.searchParams.set('razorpay_payment_id', razorpay_payment_id);
    redirectUrl.searchParams.set('razorpay_order_id', razorpay_order_id);
    if (razorpay_signature) {
      redirectUrl.searchParams.set('razorpay_signature', razorpay_signature);
    }

    console.log('Redirecting to:', redirectUrl.toString());

    // Redirect to the client-side payment callback page
    res.redirect(302, redirectUrl.toString());

  } catch (error) {
    console.error('Error processing Razorpay callback:', error);

    // On error, redirect to payment status with error
    const errorUrl = new URL(`${req.headers.origin || 'https://www.cremsonpublications.com'}/payment-status`);
    errorUrl.searchParams.set('status', 'error');
    errorUrl.searchParams.set('message', 'callback_processing_failed');

    res.redirect(302, errorUrl.toString());
  }
}
