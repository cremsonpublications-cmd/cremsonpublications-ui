import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/AuthContext";
import useRazorpay from "react-razorpay";
import Confetti from "react-confetti";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { sendOrderConfirmationEmailDirect } from "../services/emailService";
import {
  CreditCard,
  MapPin,
  Mail,
  ShoppingBag,
  Truck,
  Edit,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Link } from "react-router-dom";

const ShippingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error, Razorpay } = useRazorpay();
  const {
    cartItems,
    getTotalPrice,
    getTotalItems,
    getCouponDiscount,
    appliedCoupon,
    customerInfo,
    shippingInfo,
    updateShippingMethod,
    updateShippingNotes,
    clearCart,
    clearCheckoutData,
  } = useCart();
  const { user } = useUser();

  // Get data from navigation state
  const navigationData = location.state;
  const displayCustomerInfo = navigationData?.customerInfo || customerInfo;
  const shippingDetails = navigationData?.shippingDetails; // Only exists if different delivery address

  // Order summary state
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    couponDiscount: 0,
    deliveryCharge: 0,
    total: 0,
  });

  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Confetti celebration state
  const [showConfetti, setShowConfetti] = useState(false);

  // Shipping methods
  const shippingMethods = [
    {
      id: "free",
      name: "Free shipping",
      description: "Standard delivery (5-7 business days)",
      price: 0,
      icon: <Truck size={20} />,
    },
  ];

  // Calculate order summary
  useEffect(() => {
    const subtotal = getTotalPrice();
    const couponDiscount = getCouponDiscount();
    const deliveryCharge = getShippingCharge(); // Use calculated shipping charge
    const total = subtotal - couponDiscount + deliveryCharge;

    setOrderSummary({
      subtotal,
      couponDiscount,
      deliveryCharge,
      total: Math.max(0, total),
    });
  }, [cartItems, getTotalPrice, getCouponDiscount, getShippingCharge, shippingInfo.method]);

  // Calculate final order values
  const subtotal = getTotalPrice();
  const couponDiscount = getCouponDiscount();
  const deliveryCharge = getShippingCharge(); // Use calculated shipping charge
  const total = subtotal - couponDiscount + deliveryCharge;

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BOOK${timestamp}${random}`;
  };

  const createOrderInDatabase = async (paymentDetails) => {
    try {
      const orderId = generateOrderId();
      const currentDate = new Date().toISOString().split("T")[0];

      // Determine which address to use for delivery
      const deliveryAddress = shippingDetails ? {
        // Use shipping address if different delivery address was selected
        street: shippingDetails.streetAddress,
        apartment: shippingDetails.apartment,
        city: shippingDetails.city,
        state: shippingDetails.state,
        pincode: shippingDetails.pincode,
        country: shippingDetails.country,
      } : {
        // Use billing address if same as billing
        street: displayCustomerInfo.address.street,
        apartment: displayCustomerInfo.address.apartment,
        city: displayCustomerInfo.address.city,
        state: displayCustomerInfo.address.state,
        pincode: displayCustomerInfo.address.pincode,
        country: displayCustomerInfo.address.country,
      };

      // Prepare order data according to database schema
      const orderData = {
        order_id: orderId,
        user_info: {
          userId: user?.id || "guest",
          name: `${displayCustomerInfo.firstName} ${displayCustomerInfo.lastName}`,
          email: displayCustomerInfo.email,
          phone: displayCustomerInfo.phone,
          address: deliveryAddress,
        },
        // Add billing address separately if different from delivery
        ...(shippingDetails && {
          billing_info: {
            name: `${displayCustomerInfo.firstName} ${displayCustomerInfo.lastName}`,
            email: displayCustomerInfo.email,
            phone: displayCustomerInfo.phone,
            address: {
              street: displayCustomerInfo.address.street,
              apartment: displayCustomerInfo.address.apartment,
              city: displayCustomerInfo.address.city,
              state: displayCustomerInfo.address.state,
              pincode: displayCustomerInfo.address.pincode,
              country: displayCustomerInfo.address.country,
            }
          }
        }),
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          author: item.author || "Unknown Author",
          quantity: item.quantity,
          currentPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
        order_summary: {
          subTotal: subtotal,
          couponDiscount: couponDiscount,
          discountTotal: couponDiscount,
          deliveryCharge: deliveryCharge,
          grandTotal: total,
        },
        payment: {
          method: "Razorpay",
          status: "Paid",
          transactionId: paymentDetails.razorpay_payment_id,
          razorpay_order_id: paymentDetails.razorpay_order_id || null,
          razorpay_signature: paymentDetails.razorpay_signature || null,
          amount: total,
        },
        delivery: {
          status: "Order Placed",
          notes: shippingInfo.notes || "",
        },
        order_status: "Confirmed",
        order_date: currentDate,
      };

      // Insert order into database
      const { error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to save order to database");
      }

      return { orderId, orderData };
    } catch (error) {
      console.error("Error in createOrderInDatabase:", error);
      throw error;
    }
  };

  const handleContinueToPayment = () => {
    console.log("Payment button clicked");
    console.log("useRazorpay error:", error);
    console.log("Razorpay from hook:", Razorpay);
    console.log("window.Razorpay:", window.Razorpay);

    if (error) {
      console.error("useRazorpay error:", error);
      toast.error("Razorpay failed to load. Please refresh and try again.");
      return;
    }

    if (isProcessingPayment) {
      return;
    }

    setIsProcessingPayment(true);

    const options = {
      key: "rzp_live_lslxYYP0RMxOyr",
      amount: Math.round(total * 100), // Amount in paise
      currency: "INR",
      name: "Cremson Publications",
      description: `Order for ${cartItems.length} books`,
      handler: async (response) => {
        console.log("Payment Success:", response);

        try {
          // Create order in database after successful payment
          const { orderId, orderData } = await createOrderInDatabase(response);

          // Send order confirmation email
          try {
            const emailData = {
              customerEmail: orderData.user_info.email,
              customerName: orderData.user_info.name,
              orderId: orderId,
              items: orderData.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.currentPrice
              })),
              totalAmount: orderData.order_summary.grandTotal,
              shippingAddress: {
                name: orderData.user_info.name,
                phone: orderData.user_info.phone,
                address: orderData.user_info.address.street + (orderData.user_info.address.apartment ? ', ' + orderData.user_info.address.apartment : ''),
                city: orderData.user_info.address.city,
                state: orderData.user_info.address.state,
                pincode: orderData.user_info.address.pincode
              }
            };

            // Use direct Brevo API method (bypassing Supabase function to avoid CORS)
            console.log("Sending email via direct Brevo API...");
            const directEmailResult = await sendOrderConfirmationEmailDirect(emailData);
            
            if (!directEmailResult.success) {
              console.error("Email sending failed:", directEmailResult.error);
              // Don't fail the order, just log the email failure
              toast.warning("Order placed successfully, but confirmation email failed to send.");
            } else {
              console.log("Email sent successfully via direct Brevo API");
              toast.success("Order confirmation email sent!");
            }
          } catch (emailError) {
            console.error("Email service error:", emailError);
            // Don't fail the order, just log the email failure
            toast.warning("Order placed successfully, but confirmation email failed to send.");
          }

          // Clear cart and checkout data
          clearCart();
          clearCheckoutData();

          // Trigger confetti celebration
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000); // Show for 4 seconds

          // Navigate to my orders page after a short delay to show confetti
          setTimeout(() => {
            navigate("/my-orders");
          }, 1500);

          toast.success("Payment successful! Order placed. 🎉");
        } catch (error) {
          console.error("Error saving order to database:", error);
          toast.error(
            "Payment successful but failed to save order. Please contact support with payment ID: " +
              response.razorpay_payment_id
          );
        } finally {
          setIsProcessingPayment(false);
        }
      },
      prefill: {
        name: `${displayCustomerInfo.firstName} ${displayCustomerInfo.lastName}`,
        email: displayCustomerInfo.email,
        contact: displayCustomerInfo.phone,
      },
      notes: {
        address: `${displayCustomerInfo.address.street}, ${displayCustomerInfo.address.city}, ${displayCustomerInfo.address.state} - ${displayCustomerInfo.address.pincode}`,
        items: cartItems
          .map((item) => `${item.name} (${item.quantity})`)
          .join(", "),
      },
      theme: {
        color: "#000000", // Black theme to match your site
      },
      modal: {
        ondismiss: () => {
          console.log("Payment dismissed");
          toast.info("Payment cancelled");
          setIsProcessingPayment(false);
        },
      },
    };

    // Check if Razorpay is available
    if (!window.Razorpay) {
      console.error("Razorpay script not loaded");
      toast.error("Payment system not loaded. Please refresh the page and try again.");
      setIsProcessingPayment(false);
      return;
    }

    console.log("Creating Razorpay instance with options:", options);

    try {
      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on("payment.failed", (response) => {
        console.error("Payment Failed:", response.error);
        toast.error(
          `Payment failed: ${response.error.description || "Unknown error"}`
        );
        setIsProcessingPayment(false);
      });

      console.log("Opening Razorpay checkout...");
      razorpayInstance.open();
    } catch (error) {
      console.error("Error creating Razorpay instance:", error);
      toast.error("Failed to initialize payment. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  const handleChangeContact = () => {
    navigate("/checkout", {
      state: {
        customerInfo: displayCustomerInfo,
        returnFromShipping: true,
      },
    });
  };

  const handleChangeAddress = () => {
    navigate("/checkout", {
      state: {
        customerInfo: displayCustomerInfo,
        returnFromShipping: true,
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-frame mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-4">Add some books to get started!</p>
          <a
            href="/shop"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-frame mx-auto px-4 py-8">
      {/* Confetti Effect for Order Success - Left to Right Burst Wave */}
      {showConfetti && (
        <>
          {/* Far Left Burst */}
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={120}
            gravity={0.2}
            friction={0.97}
            wind={0.03}
            initialVelocityX={{ min: 8, max: 35 }}
            initialVelocityY={{ min: -35, max: -8 }}
            confettiSource={{
              x: window.innerWidth * 0.05,
              y: window.innerHeight * 0.35,
              w: 8,
              h: 8
            }}
            colors={['#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e', '#84cc16']}
          />
          {/* Left-Center Burst */}
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={140}
            gravity={0.2}
            friction={0.97}
            wind={0.03}
            initialVelocityX={{ min: 5, max: 40 }}
            initialVelocityY={{ min: -40, max: -10 }}
            confettiSource={{
              x: window.innerWidth * 0.25,
              y: window.innerHeight * 0.25,
              w: 8,
              h: 8
            }}
            colors={['#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e', '#84cc16']}
          />
          {/* Center Burst */}
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={160}
            gravity={0.2}
            friction={0.97}
            wind={0.03}
            initialVelocityX={{ min: 0, max: 45 }}
            initialVelocityY={{ min: -45, max: -12 }}
            confettiSource={{
              x: window.innerWidth * 0.5,
              y: window.innerHeight * 0.2,
              w: 8,
              h: 8
            }}
            colors={['#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e', '#84cc16']}
          />
          {/* Right-Center Burst */}
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={140}
            gravity={0.2}
            friction={0.97}
            wind={0.03}
            initialVelocityX={{ min: -5, max: 40 }}
            initialVelocityY={{ min: -40, max: -10 }}
            confettiSource={{
              x: window.innerWidth * 0.75,
              y: window.innerHeight * 0.25,
              w: 8,
              h: 8
            }}
            colors={['#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e', '#84cc16']}
          />
          {/* Far Right Burst */}
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={120}
            gravity={0.2}
            friction={0.97}
            wind={0.03}
            initialVelocityX={{ min: -10, max: 35 }}
            initialVelocityY={{ min: -35, max: -8 }}
            confettiSource={{
              x: window.innerWidth * 0.95,
              y: window.innerHeight * 0.35,
              w: 8,
              h: 8
            }}
            colors={['#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e', '#84cc16']}
          />
        </>
      )}
      
      {/* Checkout Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/cart">Cart</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/checkout">Information</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Shipping</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information Display */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail size={18} />
                Contact
              </h2>
              <button
                onClick={handleChangeContact}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <Edit size={14} />
                Change
              </button>
            </div>
            <p className="text-gray-700">
              {displayCustomerInfo.email || (
                <span className="text-gray-500 italic">
                  No email provided. Please go back to add your email.
                </span>
              )}
            </p>
          </div>

          {/* Shipping Address Display */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin size={18} />
                Ship to
              </h2>
              <button
                onClick={handleChangeAddress}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <Edit size={14} />
                Change
              </button>
            </div>
            <div className="text-gray-700">
              {displayCustomerInfo.address?.street ? (
                <>
                  <p>{displayCustomerInfo.address.street}</p>
                  {displayCustomerInfo.address.apartment && (
                    <p>{displayCustomerInfo.address.apartment}</p>
                  )}
                  <p>
                    {displayCustomerInfo.address.city}{" "}
                    {displayCustomerInfo.address.pincode},{" "}
                    {displayCustomerInfo.address.state}
                  </p>
                  <p>{displayCustomerInfo.address.country}</p>
                </>
              ) : (
                <p className="text-gray-500 italic">
                  No shipping address provided. Please go back to add your
                  address.
                </p>
              )}
            </div>
          </div>

          {/* Shipping Methods */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck size={18} />
              Shipping Methods
            </h2>
            <div className="space-y-3">
              {shippingMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    shippingInfo.method === method.id
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={shippingInfo.method === method.id}
                    onChange={(e) => updateShippingMethod(e.target.value)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {method.icon}
                        <span className="font-medium text-gray-900">
                          {method.name}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {method.price === 0 ? "FREE" : `₹${method.price}`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {method.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order notes (optional)
            </h2>
            <textarea
              value={shippingInfo.notes}
              onChange={(e) => updateShippingNotes(e.target.value)}
              placeholder="Special instructions for your order..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
            />
          </div>

          {/* Return to Information Button */}
          <div className="flex justify-start">
            <button
              onClick={() => navigate("/checkout")}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← Return to information
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.main_image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal ({getTotalItems()} items)
                </span>
                <span className="text-gray-900">
                  ₹{orderSummary.subtotal.toFixed(2)}
                </span>
              </div>

              {orderSummary.couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">Coupon Discount</span>
                    {appliedCoupon && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {appliedCoupon.code}
                      </span>
                    )}
                  </div>
                  <span className="text-green-600">
                    -₹{orderSummary.couponDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {orderSummary.deliveryCharge === 0
                    ? "FREE"
                    : `₹${orderSummary.deliveryCharge.toFixed(2)}`}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  ₹{orderSummary.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Pay Now Button */}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600 text-sm">
                  Error loading Razorpay: {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-red-600 underline mt-2 text-sm"
                >
                  Refresh Page
                </button>
              </div>
            )}

            <button
              onClick={handleContinueToPayment}
              disabled={isProcessingPayment || error}
              className={`w-full mt-6 py-3 px-4 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 ${
                isProcessingPayment || error
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <CreditCard size={16} />
              {isProcessingPayment
                ? "Processing..."
                : `Pay ₹${orderSummary.total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
