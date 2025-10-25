import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: email, 2: otp + new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { sendPasswordResetOTP, verifyOtpAndUpdatePassword } = useAuth();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await sendPasswordResetOTP(email);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        "Verification code sent! Check your email for the 6-digit code."
      );
      setStep(2);
    }

    setLoading(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      setLoading(false);
      return;
    }

    const { error } = await verifyOtpAndUpdatePassword(email, otp, password);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <div className="md:h-screen pt-[100px] bg-gray-50 flex items-center justify-center py-3 px-3 sm:py-5 sm:px-4 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
        {/* Back to signin link */}
        <div className="flex justify-center">
          <Link
            to="/signin"
            className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-red-500 transition-colors"
          >
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
            Back to Sign In
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              {step === 1 ? "Forgot Password?" : "Reset Password"}
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              {step === 1
                ? "Enter your email address and we'll send you a verification code."
                : "Enter the verification code and your new password."}
            </p>
          </div>

          {step === 1 ? (
            <form
              onSubmit={handleEmailSubmit}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 text-white py-2.5 sm:py-3 px-4 rounded-md text-sm sm:text-base hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handlePasswordReset}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label
                  htmlFor="otp"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center text-base sm:text-lg font-mono"
                  placeholder="000000"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Check your email for the 6-digit code
                </p>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 sm:py-2.5 pr-8 sm:pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 sm:py-2.5 pr-8 sm:pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 text-white py-2.5 sm:py-3 px-4 rounded-md text-sm sm:text-base hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs sm:text-sm text-gray-600 hover:text-red-500 transition-colors"
              >
                Back to email entry
              </button>
            </form>
          )}

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/signin"
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
