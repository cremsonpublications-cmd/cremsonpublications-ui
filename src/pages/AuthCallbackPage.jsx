import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    // Handle the OAuth or email confirmation callback
    const handleAuthCallback = async () => {
      try {
        // The supabase client will automatically handle the token in the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('Authentication failed. Please try again.');
          // Redirect to sign in page after a delay
          setTimeout(() => navigate('/signin'), 2000);
          return;
        }

        if (data?.session) {
          setStatus('Authentication successful! Redirecting...');
          // Redirect to home page or dashboard
          setTimeout(() => navigate('/'), 1000);
        } else {
          // If no session but no error, might be a different type of callback
          setStatus('Processing complete. Redirecting...');
          setTimeout(() => navigate('/'), 1000);
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setStatus('An unexpected error occurred. Please try again.');
        setTimeout(() => navigate('/signin'), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h1>
          <div className="animate-pulse mb-4">
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded mt-2"></div>
          </div>
          <p className="text-gray-600">{status}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;