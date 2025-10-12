import React, { useState } from "react";
import { toast } from "sonner";

const Input = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
}) => {
  return (
    <div className="mb-3 md:mb-4">
      <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-1 md:mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs md:text-sm mt-1">{error}</p>}
    </div>
  );
};

const TextArea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}) => {
  return (
    <div className="mb-3 md:mb-4">
      <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-1 md:mb-2">
        {label}
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows="5"
        className={`w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs md:text-sm mt-1">{error}</p>}
    </div>
  );
};

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const showNotification = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) {
          return "Full name is required";
        }
        if (value.trim().length < 2) {
          return "Name must be at least 2 characters";
        }
        if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          return "Name can only contain letters, spaces, hyphens and apostrophes";
        }
        return "";

      case "phone":
        if (!value.trim()) {
          return "Phone number is required";
        }
        if (value.length < 10) {
          return "Phone number must be at least 10 digits";
        }
        if (value.length > 15) {
          return "Phone number cannot exceed 15 digits";
        }
        return "";

      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
        return "";

      case "message":
        if (!value.trim()) {
          return "Message is required";
        }
        if (value.trim().length < 10) {
          return "Message must be at least 10 characters";
        }
        if (value.trim().length > 1000) {
          return "Message cannot exceed 1000 characters";
        }
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow numbers for phone field
    if (name === "phone") {
      const numbersOnly = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: numbersOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const scriptURL =
        "https://script.google.com/macros/s/AKfycbyLhbTdabNEhyYXD0-3zhnHHGEOMTznH6-G0W_y0bFE8CyrGuoadS3C9oCbVokLO1VNLg/exec";
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      };

      const formBody = new URLSearchParams(payload).toString();

      try {
        const response = await fetch(scriptURL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody,
        });

        if (response.ok) {
          toast.success("Logged out successfully!");
          setFormData({ fullName: "", phone: "", email: "", message: "" });
          setErrors({});
        } else {
          showNotification(
            "Failed to send message. Please try again.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error sending data:", error);
        showNotification("Something went wrong! Please try again.", "error");
      } finally {
        setLoading(false);
      }
    } else {
      showNotification("Please fix all errors before submitting", "error");
    }
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() &&
      formData.phone.trim() &&
      formData.email.trim() &&
      formData.message.trim() &&
      Object.keys(errors).every((key) => !errors[key])
    );
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg ${
              toastType === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toastMessage}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 text-center">
          <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">
            Contact Us
          </h1>
          <p className="text-sm md:text-xl text-blue-100 max-w-2xl mx-auto">
            We're here to help you with all your educational needs. Get in touch
            with us today!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 pb-0">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-12 border border-gray-200">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-3">
              Send Us a Message
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Fill out the form below and we'll get back to you as soon as
              possible
            </p>
          </div>

          <div>
            <Input
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fullName}
            />
            <Input
              label="Phone Number"
              name="phone"
              placeholder="Enter your mobile number"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              type="tel"
            />
            <Input
              label="Email Address"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              type="email"
            />
            <TextArea
              label="Message"
              name="message"
              placeholder="Type your message here..."
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.message}
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
