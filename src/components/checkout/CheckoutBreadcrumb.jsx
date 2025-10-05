import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';

const CheckoutBreadcrumb = ({ currentStep = 1, completedSteps = [] }) => {
  const navigate = useNavigate();
  const steps = [
    { id: 1, name: 'Cart', path: '/cart' },
    { id: 2, name: 'Information', path: '/checkout' },
    { id: 3, name: 'Shipping', path: '/checkout/shipping' },
    { id: 4, name: 'Payment', path: '/checkout/payment' }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep || completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const handleStepClick = (step) => {
    const stepStatus = getStepStatus(step.id);
    // Allow navigation to completed steps and current step, but not upcoming steps
    if (stepStatus === 'completed' || stepStatus === 'current') {
      navigate(step.path);
    }
  };

  const isClickable = (stepId) => {
    const status = getStepStatus(stepId);
    return status === 'completed' || status === 'current';
  };

  return (
    <nav className="mb-8" aria-label="Checkout progress">
      <ol className="flex items-center justify-center space-x-2 md:space-x-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className="flex items-center">
              <div
                className={`flex items-center ${isClickable(step.id) ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => handleStepClick(step)}
              >
                {/* Step Circle */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                    status === 'completed'
                      ? 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                      : status === 'current'
                      ? 'bg-black border-black text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  } ${isClickable(step.id) ? 'hover:scale-105' : ''}`}
                >
                  {status === 'completed' ? (
                    <Check size={16} />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>

                {/* Step Name */}
                <span
                  className={`ml-2 text-sm font-medium transition-colors ${
                    status === 'completed'
                      ? 'text-green-600 hover:text-green-700'
                      : status === 'current'
                      ? 'text-black'
                      : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>

              {/* Arrow Separator */}
              {!isLast && (
                <ChevronRight
                  size={16}
                  className="mx-2 md:mx-4 text-gray-400"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Progress Bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-black h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Current Step Description */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Step {currentStep} of {steps.length}: {steps.find(s => s.id === currentStep)?.name}
        </p>
      </div>
    </nav>
  );
};

export default CheckoutBreadcrumb;