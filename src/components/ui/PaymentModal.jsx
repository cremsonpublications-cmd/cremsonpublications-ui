import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const PaymentModal = ({ isOpen, status, onClose, orderId = null, errorMessage = null }) => {
  const navigate = useNavigate();

  const getModalContent = () => {
    switch (status) {
      case 'processing':
        return {
          icon: <Loader2 className="animate-spin w-12 h-12 text-blue-600" />,
          title: "Processing Payment",
          message: "Please wait while we verify your payment and create your order...",
          showProgress: true
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          title: "Payment Successful!",
          message: orderId
            ? `Your order ${orderId} has been confirmed and you'll receive an email confirmation shortly.`
            : "Your order has been confirmed and you'll receive an email confirmation shortly.",
          buttonText: "View My Orders",
          buttonAction: () => navigate('/my-orders')
        };
      case 'failed':
        return {
          icon: <XCircle className="w-12 h-12 text-red-500" />,
          title: "Payment Failed",
          message: errorMessage || "There was an issue processing your payment. Please try again or contact support.",
          buttonText: "Try Again",
          buttonAction: onClose,
          secondaryButtonText: "Contact Support",
          secondaryButtonAction: () => navigate('/contact')
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-12 h-12 text-orange-500" />,
          title: "Something Went Wrong",
          message: errorMessage || "We encountered an unexpected error. Our team has been notified. Please try again.",
          buttonText: "Try Again",
          buttonAction: onClose
        };
      default:
        return {
          icon: <Loader2 className="animate-spin w-12 h-12 text-blue-600" />,
          title: "Processing...",
          message: "Please wait..."
        };
    }
  };

  // Auto-close success modal after 5 seconds and redirect
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        onClose?.();
        navigate('/my-orders');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, onClose, navigate]);

  // Prevent closing modal during processing
  const handleModalClose = () => {
    if (status !== 'processing' && onClose) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && status !== 'processing') {
        handleModalClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, status]);

  if (!isOpen) return null;

  const content = getModalContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleModalClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Close button - only show when not processing */}
        {status !== 'processing' && onClose && (
          <button
            onClick={handleModalClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <XCircle className="w-6 h-6" />
          </button>
        )}

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            {content.icon}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {content.title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {content.message}
          </p>

          {/* Progress indicator for processing */}
          {content.showProgress && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments...</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            {content.buttonText && content.buttonAction && (
              <button
                onClick={content.buttonAction}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {content.buttonText}
              </button>
            )}

            {content.secondaryButtonText && content.secondaryButtonAction && (
              <button
                onClick={content.secondaryButtonAction}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {content.secondaryButtonText}
              </button>
            )}
          </div>

          {/* Auto-redirect message for success */}
          {status === 'success' && (
            <p className="text-sm text-gray-500 mt-4">
              Redirecting to your orders in 5 seconds...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;