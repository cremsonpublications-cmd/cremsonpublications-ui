import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [retryData, setRetryData] = useState(null);

  useEffect(() => {
    // Get error message from URL params
    const error = searchParams.get('error');
    setErrorMessage(error || 'Payment was not completed successfully');

    // Check for retry data in localStorage
    const pendingOrder = localStorage.getItem('pending_payment_order');
    if (pendingOrder) {
      try {
        const orderData = JSON.parse(pendingOrder);
        setRetryData(orderData);
      } catch (e) {
        console.error('Failed to parse retry data:', e);
      }
    }
  }, [searchParams]);

  const handleRetryPayment = () => {
    if (retryData) {
      // Clear the failed attempt data
      localStorage.removeItem('payment_success_data');

      // Navigate back to checkout or wherever payment should be retried
      navigate('/checkout', {
        state: {
          orderData: retryData.order_data,
          retry: true
        }
      });
    } else {
      // If no retry data, go back to cart or home
      navigate('/cart');
    }
  };

  const clearStoredData = () => {
    localStorage.removeItem('pending_payment_order');
    localStorage.removeItem('payment_success_data');
  };

  const handleGoHome = () => {
    clearStoredData();
    navigate('/');
  };

  const handleContactSupport = () => {
    // You can implement a support contact form or redirect to support page
    const supportEmail = 'support@cremsonpublications.com';
    const subject = 'Payment Issue - Need Help';
    const body = `Hi,\n\nI encountered a payment issue:\n\nError: ${errorMessage}\nTime: ${new Date().toLocaleString()}\n\nPlease help me resolve this.\n\nThanks`;

    window.open(`mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        padding: '40px 20px',
        borderRadius: '12px',
        border: '2px solid #dc3545'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>
          ❌
        </div>

        <h1 style={{
          color: '#dc3545',
          marginBottom: '10px',
          fontSize: '28px'
        }}>
          Payment Failed
        </h1>

        <p style={{
          color: '#666',
          marginBottom: '20px',
          fontSize: '16px'
        }}>
          We're sorry, but your payment could not be processed.
        </p>

        {errorMessage && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <strong style={{ color: '#856404' }}>Error Details:</strong>
            <p style={{
              color: '#856404',
              margin: '5px 0 0 0',
              fontSize: '14px'
            }}>
              {errorMessage}
            </p>
          </div>
        )}

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
            What went wrong?
          </h3>

          <ul style={{
            color: '#666',
            fontSize: '14px',
            lineHeight: '1.6',
            paddingLeft: '20px'
          }}>
            <li>Payment was cancelled or interrupted</li>
            <li>Insufficient funds or card declined</li>
            <li>Network connectivity issues</li>
            <li>Browser or app-related problems</li>
          </ul>
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          {retryData && (
            <button
              onClick={handleRetryPayment}
              style={{
                backgroundColor: '#F37254',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Retry Payment
            </button>
          )}

          <button
            onClick={handleGoHome}
            style={{
              backgroundColor: 'white',
              color: '#F37254',
              padding: '12px 24px',
              border: '2px solid #F37254',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Go to Home
          </button>

          <button
            onClick={() => navigate('/cart')}
            style={{
              backgroundColor: 'white',
              color: '#666',
              padding: '12px 24px',
              border: '2px solid #666',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Back to Cart
          </button>
        </div>

        <div style={{
          borderTop: '1px solid #ddd',
          paddingTop: '20px'
        }}>
          <p style={{
            color: '#666',
            fontSize: '14px',
            marginBottom: '15px'
          }}>
            Still having trouble? We're here to help!
          </p>

          <button
            onClick={handleContactSupport}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Contact Support
          </button>
        </div>

        <div style={{
          marginTop: '20px',
          fontSize: '12px',
          color: '#999'
        }}>
          💡 No money has been deducted from your account for failed payments.
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;