import React from 'react';
import { Truck, RotateCcw } from 'lucide-react';
import { useGlobalSettings } from '../../context/GlobalSettingsContext';

const DeliveryReturnsInfo = ({ productData }) => {
  const { getDeliveryInfo, getReturnsInfo, formatText } = useGlobalSettings();

  const deliveryInfo = getDeliveryInfo(productData?.delivery_information);
  const returnsInfo = getReturnsInfo(productData?.returns_information);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery & Return Information</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Delivery Information</h3>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {formatText(deliveryInfo)}
            </div>
          </div>
        </div>

        {/* Returns Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <RotateCcw className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Return Information</h3>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {formatText(returnsInfo)}
            </div>
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
          </div>
          <p className="text-sm text-gray-600">
            The information above applies to this specific product. For any additional questions about delivery or returns,
            please contact our customer support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryReturnsInfo;