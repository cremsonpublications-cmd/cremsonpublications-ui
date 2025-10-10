import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { X } from 'lucide-react';
import websiteLogo from '@/assets/CP-Logo.png';

const ClerkAuthModal = ({ isOpen, onClose, mode = 'signin' }) => {
  const [currentMode, setCurrentMode] = useState(mode);

  if (!isOpen) return null;

  const commonAppearance = {
    elements: {
      formButtonPrimary: 'bg-red-500 hover:bg-red-600 text-white border-0 rounded-md',
      footerActionLink: 'text-red-500 hover:text-red-600 font-medium',
      identityPreviewEditButton: 'text-red-500 hover:text-red-600',
      formFieldInput: 'border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md',
      dividerLine: 'bg-gray-200',
      dividerText: 'text-gray-500 text-sm',
      socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50 rounded-md',
      socialButtonsBlockButtonText: 'text-gray-700',
      card: 'shadow-none border-0 p-0',
      headerTitle: 'hidden', // Hide default header
      headerSubtitle: 'hidden', // Hide default subtitle
      socialButtonsProviderIcon: 'filter-none',
      formFieldLabel: 'text-gray-700 font-medium',
      footerActionText: 'text-gray-600',
      footer: 'hidden', // Hide default footer to add custom one
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Website Logo */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src={websiteLogo}
            alt="Cremson Publications"
            className="max-w-[120px] h-auto"
          />
        </div>

        {/* Custom Header */}
        <div className="text-center px-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentMode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-gray-600">
            {currentMode === 'signin' 
              ? 'Sign in to your account to continue' 
              : 'Join us to start your learning journey'
            }
          </p>
        </div>

        {/* Clerk Auth Component */}
        <div className="px-6 pb-6">
          {currentMode === 'signin' ? (
            <SignIn
              appearance={commonAppearance}
              redirectUrl={window.location.origin}
              afterSignInUrl={window.location.href}
            />
          ) : (
            <SignUp
              appearance={commonAppearance}
              redirectUrl={window.location.origin}
              afterSignUpUrl={window.location.href}
            />
          )}
        </div>

        {/* Custom Footer for Mode Switching */}
        <div className="px-6 pb-6 text-center border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            {currentMode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setCurrentMode('signup')}
                  className="text-red-500 hover:text-red-600 font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setCurrentMode('signin')}
                  className="text-red-500 hover:text-red-600 font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClerkAuthModal;
