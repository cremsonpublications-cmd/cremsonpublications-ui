import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OTPVerification from "../components/auth/OTPVerification";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);

  const { signUp, checkUserExists } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time password validation
    if (name === "password") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("at least 8 characters");
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("one uppercase letter");
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("one lowercase letter");
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push("one number");
    }

    if (!/(?=.*[!@#$%^&*()_+\-=[\]{}|;':",.<>?])/.test(password)) {
      errors.push("one special character");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      toast.error(`Password must contain: ${passwordErrors.join(", ")}`);
      setLoading(false);
      return;
    }

    // Check if user already exists
    const { exists, emailConfirmed } = await checkUserExists(formData.email);

    if (exists && emailConfirmed) {
      toast.error(
        "User already exists with this email. Please sign in instead."
      );
      setLoading(false);
      return;
    }

    if (exists && !emailConfirmed) {
      toast.error(
        "User already exists but email not verified. Please check your email for the verification link or contact support."
      );
      setLoading(false);
      return;
    }

    // Proceed with signup
    const { error } = await signUp(formData.email, formData.password, {
      fullName: `${formData.firstName} ${formData.lastName}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setUserEmail(formData.email);
      setShowOTPVerification(true);
      toast.success(
        "Account created! Please check your email for the verification code."
      );
    }

    setLoading(false);
  };

  const handleVerificationSuccess = () => {
    navigate("/signin", {
      state: {
        message: "Email verified successfully! You can now sign in.",
        type: "success",
      },
    });
  };

  const handleBackToSignup = () => {
    setShowOTPVerification(false);
    setUserEmail("");
  };

  return (
    <div className="md:h-screen pt-[100px] bg-gray-50 flex items-center justify-center py-3 px-3 sm:py-5 sm:px-4 lg:px-8">
      {showOTPVerification ? (
        <OTPVerification
          email={userEmail}
          onVerificationSuccess={handleVerificationSuccess}
          onBack={handleBackToSignup}
        />
      ) : (
        <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
          {/* Sign Up Form */}
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Create your account
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">
                Join us to get started with your learning journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-2 sm:py-2.5 pr-8 sm:pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="sm:w-5 sm:h-5" />
                    ) : (
                      <Eye size={16} className="sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                {passwordErrors.length > 0 && (
                  <div className="mt-1">
                    <ul className="text-xs text-red-600 space-y-1">
                      {passwordErrors.map((error, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-1">•</span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-2 sm:py-2.5 pr-8 sm:pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} className="sm:w-5 sm:h-5" />
                    ) : (
                      <Eye size={16} className="sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 sm:py-3 px-4 rounded-md text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Already have an account?{" "}
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
      )}
    </div>
  );
};

export default SignUpPage;
