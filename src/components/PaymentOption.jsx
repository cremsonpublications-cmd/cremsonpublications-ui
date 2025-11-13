import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

import LoadingSpinner from "./common/LoadingSpinner/LoadingSpinner";
import useLoader from "../hooks/useLoader";

// Use the test Razorpay key that matches the backend
const PAYMENT_CLIENT_ID = "rzp_test_RfJyHQFLVPUrXK";

const PaymentOption = () => {
  const showToast = () => (options) => {
    if (options.status === "failure") {
      toast.error(options.content);
    } else {
      toast.success(options.content);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [profileData, setProfileData] = useState({});
  const { isLoading, loadingMessage, startLoading, stopLoading } = useLoader();

  // Extract data from location state
  const buyPlaceOrderApiData = location.state?.buyPlaceOrderApiData;
  const checkoutData = location.state?.checkoutData;

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const startPayment = async (orderResponse) => {
    const options = {
      key: PAYMENT_CLIENT_ID,
      amount: orderResponse.amount,
      currency: orderResponse.currency,
      name: buyPlaceOrderApiData?.bond_details?.issuer_name || "",
      description: "Test Transaction",
      image: buyPlaceOrderApiData?.bond_details?.issuer_logo || "",
      order_id: orderResponse.id,
      handler: function (response) {
        verifyPayment(response);
      },
      prefill: {
        name: profileData?.full_name,
        email: profileData?.email,
        contact: profileData?.phone_no
      },
      notes: {
        address: profileData?.address || ""
      },
      theme: {
        color: "#3399cc"
      },
      modal: {
        ondismiss: () => {
          buyConfirm();
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const postBuyPlaceOrderApi = async () => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      startLoading("Creating payment order...");

      // Use the test-order edge function to create the order
      const { data: orderResponse, error } = await supabase.functions.invoke('test-order', {
        body: {
          amount: buyPlaceOrderApiData?.total_buy_amount || 100,
          currency: 'INR',
          receipt: `order_${Date.now()}`
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create order');
      }

      console.log(orderResponse, "createOrderResponse");

      if (orderResponse.id) {
        fetchProfile();
        await startPayment(orderResponse);
      } else {
        showToast()({
          status: "failure",
          content: "Something Went Wrong"
        });
      }
    } catch (err) {
      console.error("Error creating order:", err);
      sessionStorage.setItem("paymentFail", "true");
      stopLoading();
    }
  };

  const verifyPayment = async (response) => {
    try {
      startLoading("Verifying payment...");

      // Prepare the orderData using checkout data instead of mock data
      const orderData = {
        total: checkoutData?.orderSummary?.total || buyPlaceOrderApiData.total_buy_amount,
        transaction_id: buyPlaceOrderApiData.transaction_id,
        customerInfo: checkoutData?.customerInfo || profileData,
        cartItems: checkoutData?.cartItems || [],
        orderSummary: checkoutData?.orderSummary || {
          total: buyPlaceOrderApiData.total_buy_amount,
          subtotal: buyPlaceOrderApiData.total_buy_amount,
          couponDiscount: 0,
          deliveryCharge: 0
        },
        shippingAddress: checkoutData?.customerInfo?.address || profileData.address || {},
        bond_details: buyPlaceOrderApiData.bond_details
      };

      const { data: verificationResponse, error } = await supabase.functions.invoke('test-verify-payment', {
        body: {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderData: orderData
        }
      });

      if (error) {
        throw new Error(error.message || 'Payment verification failed');
      }

      console.log(verificationResponse, "paymentresponse");
      buyConfirm(verificationResponse.order);

    } catch (err) {
      console.error("Payment verification failed:", err);
      stopLoading();
    }
  };

  const userId = localStorage.getItem("userId");

  const fetchProfile = async () => {
    try {
      // Mock profile fetch - replace with actual API call
      console.log("Fetching profile for user:", userId);
      setProfileData({
        full_name: "Test User",
        email: "test@example.com",
        phone_no: "1234567890",
        address: "Test Address"
      });
    } catch (err) {
      console.log(err);
    }
  };

  const buyConfirm = async (order) => {
    try {
      startLoading("Confirming your order...");

      // Mock order confirmation - replace with actual API call
      console.log("Confirming order with transaction:", sessionStorage.getItem("transactionId"));

      // Simulate successful confirmation
      setTimeout(() => {
        sessionStorage.setItem("paymentSuccess", "true");
        stopLoading();
        navigate("/payment-success", { state: { order } });
      }, 2000);

    } catch (err) {
      console.error("Payment verification failed:", err);
      sessionStorage.setItem("paymentFail", "true");
      stopLoading();
      navigate("/payment-fail", { state: buyPlaceOrderApiData });
    }
  };

  useEffect(() => {
    postBuyPlaceOrderApi();
  }, []);

  return (
    <div className="payment-container">
      {isLoading && (
        <div className="loader">
          <LoadingSpinner title={loadingMessage} />
        </div>
      )}
    </div>
  );
};

export default PaymentOption;
