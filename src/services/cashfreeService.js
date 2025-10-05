import { toast } from 'sonner';

export const startCashfreePayment = async (paymentData) => {
  const { amount, customerInfo, orderDetails, onSuccess, onFailure, onDismiss } = paymentData;

  try {
    // Generate unique order ID
    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Simple frontend-only payment simulation with user interaction
    console.log('Starting Cashfree payment simulation...');
    console.log('Payment Data:', { amount, customerInfo, orderDetails });

    // Show payment confirmation dialog
    const userConfirmed = window.confirm(
      `Complete payment of ₹${amount}?\n\n` +
      `Customer: ${customerInfo.firstName} ${customerInfo.lastName}\n` +
      `Email: ${customerInfo.email}\n` +
      `Items: ${orderDetails.items}\n\n` +
      `Click OK to simulate successful payment, or Cancel to abort.`
    );

    if (!userConfirmed) {
      console.log('Payment cancelled by user');
      toast.info('Payment cancelled');
      if (onDismiss) {
        onDismiss();
      }
      return;
    }

    // Show processing message
    toast.info('Processing payment...');

    // Simulate payment processing with a delay
    setTimeout(() => {
      // Simulate successful payment
      toast.success('Payment completed successfully! (Simulation)');

      if (onSuccess) {
        onSuccess({
          cashfree_payment_id: `pay_${Date.now()}`,
          cashfree_order_id: orderId,
          cashfree_signature: `sig_${Date.now()}`
        });
      }
    }, 1500); // 1.5 second delay to simulate processing

  } catch (error) {
    console.error('Error during payment simulation:', error);
    toast.error('Payment failed: ' + error.message);

    if (onFailure) {
      onFailure({
        error: 'PAYMENT_SIMULATION_FAILED',
        error_description: error.message || 'Payment simulation failed'
      });
    }
  }
};

export const verifyCashfreePayment = async (paymentDetails) => {
  // In production, this should make an API call to your backend
  // to verify the payment with Cashfree's verification API

  // For now, we'll return success for testing
  console.log('Verifying Cashfree payment:', paymentDetails);

  // You should implement proper verification here
  return {
    success: true,
    verified: true,
    order_id: paymentDetails.cashfree_order_id,
    payment_id: paymentDetails.cashfree_payment_id
  };
};