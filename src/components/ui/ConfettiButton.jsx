import React from 'react';
import confetti from 'canvas-confetti';

const ConfettiButton = ({ 
  children, 
  onClick, 
  className = "",
  confettiConfig = {},
  ...props 
}) => {
  const defaultConfettiConfig = {
    particleCount: 150,
    spread: 60,
    origin: { y: 0.6 }
  };

  const handleClick = (e) => {
    // Trigger confetti effect
    confetti({
      ...defaultConfettiConfig,
      ...confettiConfig
    });

    // Call the original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button 
      onClick={handleClick} 
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

// Preset configurations for different effects
export const ConfettiPresets = {
  // Basic burst
  burst: {
    particleCount: 150,
    spread: 60,
    origin: { y: 0.6 }
  },

  // Left to right wave
  leftToRightWave: {
    particleCount: 100,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.6 },
    colors: ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
  },

  // Celebration burst
  celebration: {
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e', '#84cc16']
  },

  // Side burst
  sideBurst: {
    particleCount: 100,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
  },

  // Double side burst
  doubleSideBurst: (callback) => {
    // Left side
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
    });
    // Right side
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
    });
    if (callback) callback();
  }
};

// Specialized confetti button variants
export const BurstConfettiButton = ({ children, onClick, className, ...props }) => (
  <ConfettiButton 
    confettiConfig={ConfettiPresets.burst}
    onClick={onClick}
    className={className}
    {...props}
  >
    {children}
  </ConfettiButton>
);

export const CelebrationConfettiButton = ({ children, onClick, className, ...props }) => (
  <ConfettiButton 
    confettiConfig={ConfettiPresets.celebration}
    onClick={onClick}
    className={className}
    {...props}
  >
    {children}
  </ConfettiButton>
);

export const SideBurstConfettiButton = ({ children, onClick, className, ...props }) => {
  const handleClick = (e) => {
    ConfettiPresets.doubleSideBurst();
    if (onClick) onClick(e);
  };

  return (
    <button 
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export default ConfettiButton;
