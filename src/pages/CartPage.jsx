import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BreadcrumbCart from "../components/cart-page/BreadcrumbCart";
import ProductCard from "../components/cart-page/ProductCard";
import { Button } from "../components/ui/button";
import InputGroup from "../components/ui/input-group";
import { cn } from "../lib/utils";
import { integralCF } from "../styles/fonts";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineLocalOffer } from "react-icons/md";
import { TbBasketExclamation } from "react-icons/tb";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getCoupons, validateCoupon } from "../services/couponService";
import { Tag, Check, X, Percent, ChevronDown, ChevronUp } from "lucide-react";
import SignInModal from "../components/auth/SignInModal";

export default function CartPage() {
  const { cartItems, getTotalPrice, getTotalItems, appliedCoupon, applyCoupon, removeCoupon, getCouponDiscount, getFinalTotal } = useCart();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Coupon state
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);

  // Sign-in modal state
  const [showSignInModal, setShowSignInModal] = useState(false);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const couponDiscount = getCouponDiscount();
  const finalTotal = getFinalTotal();

  // Load coupons on component mount
  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const coupons = await getCoupons();
        setAvailableCoupons(coupons);
      } catch (error) {
        console.error('Failed to load coupons:', error);
      }
    };

    loadCoupons();
  }, []);

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
    setCouponMessage('');

    try {
      const result = await validateCoupon(couponCode, totalPrice);

      if (result.valid) {
        applyCoupon(result.coupon);
        setCouponMessage(result.message);
        setCouponCode('');
        setShowCoupons(false);
      } else {
        setCouponMessage(result.message);
        removeCoupon();
      }
    } catch (error) {
      setCouponMessage('Error validating coupon');
      removeCoupon();
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMessage('');
  };

  // Apply coupon directly from list
  const handleSelectCoupon = async (coupon) => {
    setIsValidatingCoupon(true);
    setCouponMessage('');

    try {
      const result = await validateCoupon(coupon.code, totalPrice);

      if (result.valid) {
        applyCoupon(result.coupon);
        setCouponMessage(result.message);
        setShowCoupons(false);
      } else {
        setCouponMessage(result.message);
      }
    } catch (error) {
      setCouponMessage('Error applying coupon');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Handle checkout button click
  const handleCheckoutClick = () => {
    if (!isSignedIn()) {
      setShowSignInModal(true);
    } else {
      navigate('/checkout');
    }
  };

  // Handle sign-in modal close
  const handleSignInModalClose = () => {
    setShowSignInModal(false);
  };

  // Auto-navigate to checkout after successful sign-in
  useEffect(() => {
    if (isSignedIn() && showSignInModal) {
      setShowSignInModal(false);
      navigate('/checkout');
    }
  }, [isSignedIn, showSignInModal, navigate]);

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        {cartItems && cartItems.length > 0 ? (
          <>
            <BreadcrumbCart />
            <h2
              className={cn([
                integralCF.className,
                "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
              ])}
            >
              your cart
            </h2>
            <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 items-start">
              <div className="w-full p-3.5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
                {cartItems.map((product, idx, arr) => (
                  <React.Fragment key={idx}>
                    <ProductCard data={product} />
                    {arr.length - 1 !== idx && (
                      <hr className="border-t-black/10" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="w-full lg:max-w-[505px] p-5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
                <h6 className="text-xl md:text-2xl font-bold text-black">
                  Cart Summary
                </h6>
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">Total Items</span>
                    <span className="md:text-xl font-bold">{cartItems.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">Total Quantity</span>
                    <span className="md:text-xl font-bold">{totalItems}</span>
                  </div>
                  <hr className="border-t-black/10" />

                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">Subtotal</span>
                    <span className="text-xl md:text-2xl font-bold">
                      ₹{totalPrice}
                    </span>
                  </div>

                  {/* Applied Coupon Discount */}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="md:text-xl text-green-600">Coupon Discount</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {appliedCoupon.code}
                        </span>
                      </div>
                      <span className="text-xl md:text-2xl font-bold text-green-600">
                        -₹{couponDiscount}
                      </span>
                    </div>
                  )}

                  {/* Final Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-black/10">
                    <span className="md:text-xl text-black font-semibold">Total</span>
                    <span className="text-xl md:text-2xl font-bold">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>

                {/* Applied Coupon Display */}
                {appliedCoupon && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check size={18} className="text-green-600" />
                        <span className="font-semibold text-green-800">
                          {appliedCoupon.code} Applied
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-800 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-green-600 mt-1">{appliedCoupon.description}</p>
                  </div>
                )}

                {/* Coupon Input Section */}
                {!appliedCoupon && (
                  <div className="space-y-4">
                    <div className="flex space-x-3">
                      <InputGroup className="bg-[#F0F0F0] flex-1">
                        <InputGroup.Text>
                          <MdOutlineLocalOffer className="text-black/40 text-2xl" />
                        </InputGroup.Text>
                        <InputGroup.Input
                          type="text"
                          name="code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Add promo code"
                          className="bg-transparent placeholder:text-black/40"
                        />
                      </InputGroup>
                      <Button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="bg-black rounded-full w-full max-w-[119px] h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isValidatingCoupon ? 'Checking...' : 'Apply'}
                      </Button>
                    </div>

                    {/* Coupon Message */}
                    {couponMessage && (
                      <p className={`text-sm ${appliedCoupon ? 'text-green-600' : 'text-red-600'}`}>
                        {couponMessage}
                      </p>
                    )}

                    {/* Available Coupons Toggle */}
                    <div className="border-t border-gray-200 pt-4">
                      <button
                        onClick={() => setShowCoupons(!showCoupons)}
                        className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-black"
                      >
                        <span className="flex items-center gap-2">
                          <Tag size={16} />
                          Available Coupons ({availableCoupons.length})
                        </span>
                        {showCoupons ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {/* Available Coupons List */}
                      {showCoupons && (
                        <div className="mt-3 space-y-2">
                          {availableCoupons.length > 0 ? (
                            availableCoupons.map((coupon) => (
                              <div
                                key={coupon.id}
                                className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => handleSelectCoupon(coupon)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Percent size={14} className="text-blue-600" />
                                    <span className="font-mono text-sm font-bold text-blue-600">
                                      {coupon.code}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    ₹{coupon.discount_value} OFF
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{coupon.description}</p>
                                {coupon.minimum_order_amount && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Min. order: ₹{coupon.minimum_order_amount}
                                  </p>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 py-2">No coupons available</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <Button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="text-sm md:text-base font-medium bg-black rounded-full w-full py-4 h-[54px] md:h-[60px] group"
                >
                  Go to Checkout{" "}
                  <FaArrowRight className="text-xl ml-2 group-hover:translate-x-1 transition-all" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center flex-col text-gray-300 mt-32">
            <TbBasketExclamation strokeWidth={1} className="text-6xl" />
            <span className="block mb-4">Your shopping cart is empty.</span>
            <Button className="rounded-full w-24" asChild>
              <Link to="/shop">Shop</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={handleSignInModalClose}
      />
    </main>
  );
}