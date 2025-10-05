import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import websiteLogo from '../../assets/CP-Logo.png';

const SignInModal = ({ isOpen, onClose }) => {
  const { signInWithGoogle } = useAuth();

  // Google Client ID - directly applied where needed
  const GOOGLE_CLIENT_ID = "726941109596-r9nns932ohhkfsp75d15773v57jjandh.apps.googleusercontent.com";

  const handleGoogleSuccess = (credentialResponse) => {
    signInWithGoogle(credentialResponse);
    onClose();
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          {/* Website Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={websiteLogo}
              alt="Cremson Publications"
              className="max-w-[120px] h-auto"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Cremson Publications
          </h2>
          <p className="text-gray-600">
            Sign in or sign up with one tap using Google
          </p>
        </div>

        {/* Google One-Tap Login */}
        <div className="flex justify-center">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="googleButton">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                ux_mode="popup"
                size="large"
                width="300"
                text="continue_with"
                theme="outline"
                shape="rectangular"
              />
            </div>
          </GoogleOAuthProvider>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            This will automatically create an account if you don't have one.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;