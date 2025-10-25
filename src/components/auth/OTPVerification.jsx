import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const OTPVerification = ({ email, onVerificationSuccess, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  const { verifySignupOTP, resendSignupOTP } = useAuth();

  useEffect(() => {
    // Focus on first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Handle resend cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index, value) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);

    const newOtp = [...otp];
    for (let i = 0; i < digits.length && i < 6; i++) {
      newOtp[i] = digits[i];
    }
    setOtp(newOtp);

    // Focus on the next empty input or the last one
    const nextIndex = Math.min(digits.length, 5);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits");
      setLoading(false);
      return;
    }

    const { data, error } = await verifySignupOTP(email, otpString);

    if (error) {
      toast.error(error.message || "Invalid OTP. Please try again.");
    } else {
      toast.success("Email verified successfully! Redirecting...");
      setTimeout(() => {
        onVerificationSuccess();
      }, 1500);
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    const { error } = await resendSignupOTP(email);

    if (error) {
      toast.error(error.message || "Failed to resend OTP. Please try again.");
    } else {
      toast.success("OTP sent successfully! Please check your email.");
      setResendCooldown(60); // 60 seconds cooldown
    }

    setResendLoading(false);
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm">
        <div className="text-center mb-4 sm:mb-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-gray-900 font-medium text-sm sm:text-base break-all">{email}</p>
        </div>


        <form onSubmit={handleVerifyOTP} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 text-center">
              Enter verification code
            </label>
            <div className="flex justify-center space-x-1 sm:space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base sm:text-lg font-semibold"
                  placeholder="0"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 sm:py-3 px-4 rounded-md text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm text-gray-600">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading || resendCooldown > 0}
            className="inline-flex items-center space-x-2 text-red-500 hover:text-red-600 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${resendLoading ? "animate-spin" : ""}`} />
            <span>
              {resendCooldown > 0
                ? `Resend OTP (${resendCooldown}s)`
                : resendLoading
                ? "Sending..."
                : "Resend OTP"}
            </span>
          </button>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-xs sm:text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;