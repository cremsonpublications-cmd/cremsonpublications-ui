import { useState, useCallback } from 'react';

const useLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Please wait');

  const startLoading = useCallback((message = 'Please wait') => {
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('Please wait');
  }, []);

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading
  };
};

export default useLoader;
