import React from 'react';
import RazorpayPaymentOption from '../components/RazorpayPaymentOption';

const BuyOrderPayment = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Complete Your Payment
          </h1>
          <RazorpayPaymentOption />
        </div>
      </div>
    </div>
  );
};

export default BuyOrderPayment;
