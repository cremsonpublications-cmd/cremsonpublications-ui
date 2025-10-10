import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '@clerk/clerk-react';
import { toast } from "sonner";
import {
  MapPin,
  User,
  Mail,
  ShoppingBag
} from 'lucide-react';
import SearchableSelect from '../components/ui/SearchableSelect';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';
import { Link } from 'react-router-dom';

const countries = ['India'];

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep', 'Delhi', 'Puducherry', 'Ladakh', 'Jammu and Kashmir'
];

const CheckoutPage = () => {
  const {
    cartItems,
    getTotalPrice,
    getTotalItems,
    getCouponDiscount,
    appliedCoupon,
    customerInfo,
    updateCustomerInfo,
    updateCustomerAddress
  } = useCart();
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Load data from navigation state if returning from shipping page
  useEffect(() => {
    if (location.state?.customerInfo && location.state?.returnFromShipping) {
      const { customerInfo: navCustomerInfo } = location.state;
      updateCustomerInfo({
        email: navCustomerInfo.email,
        firstName: navCustomerInfo.firstName,
        lastName: navCustomerInfo.lastName,
        phone: navCustomerInfo.phone
      });
      updateCustomerAddress(navCustomerInfo.address);
    }
  }, [location.state, updateCustomerInfo, updateCustomerAddress]);


  // Check if user is logged in, redirect to signin if not
  useEffect(() => {
    if (!isSignedIn) {
      navigate('/signin');
    }
  }, [isSignedIn, navigate]);

  // Initialize customer info with user data if available
  useEffect(() => {
    if (user && !customerInfo.email) {
      updateCustomerInfo({
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    }
  }, [user, customerInfo.email, updateCustomerInfo]);

  const [deliverToDifferentAddress, setDeliverToDifferentAddress] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showValidation, setShowValidation] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    country: 'India',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    pincode: ''
  });


  // Order summary state
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    couponDiscount: 0,
    deliveryCharge: 0,
    total: 0
  });


  // Calculate order summary
  useEffect(() => {
    const subtotal = getTotalPrice();
    const couponDiscount = getCouponDiscount();
    const deliveryCharge = 0; // Always free delivery
    const total = subtotal - couponDiscount + deliveryCharge;

    setOrderSummary({
      subtotal,
      couponDiscount,
      deliveryCharge,
      total: Math.max(0, total)
    });
  }, [cartItems, getTotalPrice, getCouponDiscount]);

  // Handle form input changes
  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    updateCustomerInfo({ [name]: value });
  };

  const handleBillingDetailsChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.') || ['streetAddress', 'apartment', 'city', 'state', 'pincode', 'country'].includes(name)) {
      const addressField = name.replace('address.', '');
      const mappedField = name === 'streetAddress' ? 'street' : addressField;
      updateCustomerAddress({ [mappedField]: value });
    } else {
      const mappedField = name === 'firstName' ? 'firstName' : name === 'lastName' ? 'lastName' : name === 'phone' ? 'phone' : name;
      updateCustomerInfo({ [mappedField]: value });
    }
  };

  const handleShippingDetailsChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // Validation function
  const validateCustomerInfo = () => {
    const errors = [];

    // Validate billing/customer information
    if (!customerInfo.email?.trim()) {
      errors.push('Email is required');
    }
    if (!customerInfo.firstName?.trim()) {
      errors.push('First name is required');
    }
    if (!customerInfo.lastName?.trim()) {
      errors.push('Last name is required');
    }
    if (!customerInfo.address?.street?.trim()) {
      errors.push('Billing street address is required');
    }
    if (!customerInfo.address?.city?.trim()) {
      errors.push('Billing city is required');
    }
    if (!customerInfo.address?.state?.trim()) {
      errors.push('Billing state is required');
    }
    if (!customerInfo.address?.pincode?.trim()) {
      errors.push('Billing pincode is required');
    }
    if (!customerInfo.phone?.trim()) {
      errors.push('Phone number is required');
    }

    // Validate shipping address if different delivery address is selected
    if (deliverToDifferentAddress) {
      if (!shippingDetails.firstName?.trim()) {
        errors.push('Shipping first name is required');
      }
      if (!shippingDetails.lastName?.trim()) {
        errors.push('Shipping last name is required');
      }
      if (!shippingDetails.streetAddress?.trim()) {
        errors.push('Shipping street address is required');
      }
      if (!shippingDetails.city?.trim()) {
        errors.push('Shipping city is required');
      }
      if (!shippingDetails.state?.trim()) {
        errors.push('Shipping state is required');
      }
      if (!shippingDetails.pincode?.trim()) {
        errors.push('Shipping pincode is required');
      }
      if (!shippingDetails.country?.trim()) {
        errors.push('Shipping country is required');
      }
    }

    return errors;
  };

  // Check if form is valid (all required fields filled)
  const isFormValid = () => {
    return validateCustomerInfo().length === 0;
  };


  // Handle continue to shipping (legacy function - keeping for navigation)
  const handleContinueToShipping = () => {
    const errors = validateCustomerInfo();

    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidation(true);

      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Show toast for immediate feedback
      toast.error('Please fill in all required fields to continue to shipping.');
      return;
    }

    // Clear any previous validation errors
    setValidationErrors([]);
    setShowValidation(false);

    console.log('Proceeding to shipping with:', {
      customer: customerInfo,
      shipping: deliverToDifferentAddress ? shippingDetails : customerInfo
    });

    // Navigate to shipping page using React Router with state
    navigate('/checkout/shipping', {
      state: {
        customerInfo: customerInfo,
        shippingDetails: deliverToDifferentAddress ? shippingDetails : null
      }
    });
  };

  // If user is not signed in, show only the sign-in modal (no checkout content)
  if (!isSignedIn) {
    return (
      <div className="max-w-frame mx-auto px-4 py-8">
        <div className="text-center">
          <User size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in required</h2>
          <p className="text-gray-600 mb-4">Please sign in to access checkout</p>
          <button
            onClick={() => navigate('/cart')}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Return to Cart
          </button>
        </div>

      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-frame mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some books to get started!</p>
          <a href="/shop" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-frame mx-auto px-4 py-8">
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
            <BreadcrumbPage>Information</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-muted-foreground cursor-not-allowed">
              Shipping
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-muted-foreground cursor-not-allowed">
              Payment
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Validation Errors */}
      {showValidation && validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-semibold mb-2">Please complete the following required fields:</h3>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Mail size={20} />
              Contact Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address *
              </label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleContactInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                required
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Billing Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User size={20} />
              Billing Details
            </h2>

            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerInfo.firstName}
                    onChange={handleBillingDetailsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                    required
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerInfo.lastName}
                    onChange={handleBillingDetailsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                    required
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company name (optional)
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={customerInfo.companyName}
                  onChange={handleBillingDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                  placeholder="Company name"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country/Region *
                </label>
                <SearchableSelect
                  options={countries}
                  value={customerInfo.address.country}
                  onChange={(value) => handleBillingDetailsChange({ target: { name: 'country', value } })}
                  placeholder="Select country..."
                  searchPlaceholder="Search countries..."
                  required
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street address *
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  value={customerInfo.address.street}
                  onChange={handleBillingDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                  required
                  placeholder="House number and street name"
                />
              </div>

              {/* Apartment/Suite */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Flat, suite, unit, etc. (optional)
                </label>
                <input
                  type="text"
                  name="apartment"
                  value={customerInfo.address.apartment}
                  onChange={handleBillingDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                />
              </div>

              {/* City, State, PIN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Town / City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={customerInfo.address.city}
                    onChange={handleBillingDetailsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                    required
                    placeholder="Town / City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <SearchableSelect
                    options={indianStates}
                    value={customerInfo.address.state}
                    onChange={(value) => handleBillingDetailsChange({ target: { name: 'state', value } })}
                    placeholder="Select an option…"
                    searchPlaceholder="Search states..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={customerInfo.address.pincode}
                    onChange={handleBillingDetailsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                    required
                    placeholder="PIN Code"
                    maxLength="6"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleBillingDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                  required
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>

          {/* Deliver to Different Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="differentAddress"
                checked={deliverToDifferentAddress}
                onChange={(e) => setDeliverToDifferentAddress(e.target.checked)}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="differentAddress" className="ml-2 text-sm font-medium text-gray-700">
                Deliver to a different address?
              </label>
            </div>

            {deliverToDifferentAddress && (
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <MapPin size={18} />
                  Shipping Address
                </h3>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingDetails.firstName}
                      onChange={handleShippingDetailsChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                      required
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingDetails.lastName}
                      onChange={handleShippingDetailsChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                      required
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company name (optional)
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={shippingDetails.companyName}
                    onChange={handleShippingDetailsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="Company name"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country/Region *
                  </label>
                  <SearchableSelect
                    options={countries}
                    value={shippingDetails.country}
                    onChange={(value) => handleShippingDetailsChange({ target: { name: 'country', value } })}
                    placeholder="Select country..."
                    searchPlaceholder="Search countries..."
                    required
                  />
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street address *
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={shippingDetails.streetAddress}
                    onChange={handleShippingDetailsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                    required
                    placeholder="House number and street name"
                  />
                </div>

                {/* Apartment/Suite */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flat, suite, unit, etc. (optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={shippingDetails.apartment}
                    onChange={handleShippingDetailsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="Apartment, suite, unit, etc. (optional)"
                  />
                </div>

                {/* City, State, PIN */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Town / City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingDetails.city}
                      onChange={handleShippingDetailsChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                      required
                      placeholder="Town / City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <SearchableSelect
                      options={indianStates}
                      value={shippingDetails.state}
                      onChange={(value) => handleShippingDetailsChange({ target: { name: 'state', value } })}
                      placeholder="Select an option…"
                      searchPlaceholder="Search states..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingDetails.pincode}
                      onChange={handleShippingDetailsChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                      required
                      placeholder="PIN Code"
                      maxLength="6"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

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
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
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
                <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                <span className="text-gray-900">₹{orderSummary.subtotal.toFixed(2)}</span>
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
                  <span className="text-green-600">-₹{orderSummary.couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="text-gray-900">
                  {orderSummary.deliveryCharge === 0 ? 'FREE' : `₹${orderSummary.deliveryCharge.toFixed(2)}`}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₹{orderSummary.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Continue to Shipping Button */}
            <button
              onClick={handleContinueToShipping}
              disabled={!isFormValid()}
              className={`w-full mt-6 py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                isFormValid()
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to shipping →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;