import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStep, setVerificationStep] = useState('Initializing...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [
      'Verifying payment signature...',
      'Checking with Razorpay...',
      'Validating payment amount...',
      'Creating your order...',
      'Finalizing details...'
    ];

    let currentStep = 0;
    let currentProgress = 0;

    const stepInterval = setInterval(async () => {
      if (currentStep < steps.length) {
        setVerificationStep(steps[currentStep]);
        currentStep++;
        currentProgress += 20;
        setProgress(currentProgress);
      } else {
        clearInterval(stepInterval);

        // After steps complete, process the actual payment verification
        const paymentId = searchParams.get('razorpay_payment_id');
        const orderId = searchParams.get('razorpay_order_id');
        const signature = searchParams.get('razorpay_signature');

        if (paymentId && orderId && signature) {
          // Get stored order data
          const storedOrderData = localStorage.getItem('payment_order_data');
          if (!storedOrderData) {
            navigate('/payment-failed?error=missing_order_data');
            return;
          }

          try {
            const orderData = JSON.parse(storedOrderData);

            // Verify payment with backend
            const SUPABASE_URL = 'https://vayisutwehvbjpkhzhcc.supabase.co';
            const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheWlzdXR3ZWh2Ympwa2h6aGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDg2NzQsImV4cCI6MjA3NTU4NDY3NH0.368e_Tz9pWhTevzXmwXJI3bZ3G9OktrlZzy6lBA8oL4';

            const verifyResponse = await fetch(`${SUPABASE_URL}/functions/v1/test-verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'apikey': SUPABASE_ANON_KEY
              },
              body: JSON.stringify({
                razorpay_payment_id: paymentId,
                razorpay_order_id: orderId,
                razorpay_signature: signature,
                orderData: orderData
              })
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              // Clear stored data
              localStorage.removeItem('pending_payment_order');
              localStorage.removeItem('payment_success_data');
              localStorage.removeItem('payment_order_data');

              // Redirect to success page with order details
              navigate(`/payment-success?order_id=${verifyResult.order_id}&payment_id=${paymentId}`);
            } else {
              throw new Error(verifyResult.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            navigate(`/payment-failed?error=${encodeURIComponent(error.message)}`);
          }
        } else {
          // No payment data found
          navigate('/payment-failed?error=missing_payment_data');
        }
      }
    }, 1000); // Each step takes 1 second

    // Cleanup interval on unmount
    return () => clearInterval(stepInterval);
  }, [searchParams, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '60px 40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        margin: '20px'
      }}>
        {/* Main Icon */}
        <div style={{
          fontSize: '64px',
          marginBottom: '30px',
          animation: 'pulse 2s infinite'
        }}>
          💳
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '20px'
        }}>
          Processing Your Payment
        </h1>

        {/* Current Step */}
        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '40px',
          minHeight: '20px'
        }}>
          {verificationStep}
        </p>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          backgroundColor: '#e9ecef',
          borderRadius: '10px',
          height: '8px',
          marginBottom: '30px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            backgroundColor: '#F37254',
            height: '100%',
            borderRadius: '10px',
            transition: 'width 0.5s ease-in-out'
          }} />
        </div>

        {/* Progress Percentage */}
        <div style={{
          fontSize: '14px',
          color: '#888',
          marginBottom: '30px'
        }}>
          {progress}% Complete
        </div>

        {/* Security Notice */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '10px'
          }}>
            🔒 Secure Payment Processing
          </div>
          <div style={{
            fontSize: '12px',
            color: '#999',
            lineHeight: '1.5'
          }}>
            Please do not close this window or press the back button.
            <br />
            Your payment is being securely processed with Razorpay.
          </div>
        </div>

        {/* Powered by */}
        <div style={{
          marginTop: '30px',
          fontSize: '12px',
          color: '#999'
        }}>
          Powered by Razorpay • Cremson Publications
        </div>

        {/* CSS Animation */}
        <style>
          {`
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.1);
                opacity: 0.8;
              }
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            .loading-dots::after {
              content: '';
              animation: loading-dots 1.5s infinite;
            }

            @keyframes loading-dots {
              0%, 20% { content: ''; }
              40% { content: '.'; }
              60% { content: '..'; }
              80%, 100% { content: '...'; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default PaymentVerification;