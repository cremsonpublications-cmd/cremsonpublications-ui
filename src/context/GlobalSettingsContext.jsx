import React, { createContext, useContext } from 'react';
import { useProducts } from './ProductContext';

const GlobalSettingsContext = createContext();

export const useGlobalSettings = () => {
  const context = useContext(GlobalSettingsContext);
  if (!context) {
    throw new Error('useGlobalSettings must be used within a GlobalSettingsProvider');
  }
  return context;
};

export const GlobalSettingsProvider = ({ children }) => {
  const { categories } = useProducts();

  // Extract global settings from categories data
  const getGlobalSettingsFromCategories = () => {
    if (!categories || categories.length === 0) {
      return {
        delivery_info: '',
        returns_info: '',
      };
    }

    // Find the SYSTEM_GLOBAL_SETTINGS record
    const globalSettingsRecord = categories.find(
      category => category.main_category_name === 'SYSTEM_GLOBAL_SETTINGS'
    );

    if (globalSettingsRecord) {
      return {
        delivery_info: globalSettingsRecord.global_delivery_info || '',
        returns_info: globalSettingsRecord.global_returns_info || '',
      };
    }

    return {
      delivery_info: '',
      returns_info: '',
    };
  };

  const globalSettings = getGlobalSettingsFromCategories();

  // Get delivery information with priority logic
  const getDeliveryInfo = (productDeliveryInfo) => {
    // Priority: Product-specific info > Global settings > Default message
    if (productDeliveryInfo && productDeliveryInfo.trim()) {
      return productDeliveryInfo;
    }

    if (globalSettings.delivery_info && globalSettings.delivery_info.trim()) {
      return globalSettings.delivery_info;
    }

    return 'Delivery information will be updated soon.';
  };

  // Get returns information with priority logic
  const getReturnsInfo = (productReturnsInfo) => {
    // Priority: Product-specific info > Global settings > Default message
    if (productReturnsInfo && productReturnsInfo.trim()) {
      return productReturnsInfo;
    }

    if (globalSettings.returns_info && globalSettings.returns_info.trim()) {
      return globalSettings.returns_info;
    }

    return 'Returns information will be updated soon.';
  };

  // Format text for display (convert \n to line breaks)
  const formatText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const value = {
    globalSettings,
    getDeliveryInfo,
    getReturnsInfo,
    formatText,
  };

  return (
    <GlobalSettingsContext.Provider value={value}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export default GlobalSettingsContext;