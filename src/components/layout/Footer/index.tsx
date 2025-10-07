import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import React, { useState } from "react";
import { PaymentBadge, SocialNetworks } from "./footer.types";
import { FaFacebookF, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import { SiGooglepay, SiPaytm, SiPhonepe } from "react-icons/si";
import { MdPayment } from "react-icons/md";
import { Link } from "react-router-dom";
import { Search, Heart, User, ShoppingCart } from "lucide-react";
import LinksSection from "./LinksSection";
import NewsLetterSection from "./NewsLetterSection";
import LayoutSpacing from "./LayoutSpacing";
import websiteLogo from "../../../assets/CP-Logo.png";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import SearchDropdown from "../../ui/SearchDropdown";
import SignInModal from "../../auth/SignInModal";
import { useAuth } from "../../../context/AuthContext";

const socialsData: SocialNetworks[] = [
  {
    id: 1,
    icon: <FaTwitter />,
    url: "https://twitter.com",
  },
  {
    id: 2,
    icon: <FaFacebookF />,
    url: "https://facebook.com",
  },
  {
    id: 3,
    icon: <FaInstagram />,
    url: "https://instagram.com",
  },
  {
    id: 4,
    icon: <FaGithub />,
    url: "https://github.com/mohammadoftadeh",
  },
];

const paymentBadgesData = [
  {
    id: 1,
    name: "Google Pay",
    icon: <SiGooglepay className="text-2xl" />,
  },
  {
    id: 2,
    name: "Paytm",
    icon: <SiPaytm className="text-2xl text-blue-600" />,
  },
  {
    id: 3,
    name: "PhonePe",
    icon: <SiPhonepe className="text-2xl text-purple-600" />,
  },
  {
    id: 4,
    name: "UPI",
    icon: <MdPayment className="text-2xl text-orange-500" />,
  },
  {
    id: 5,
    name: "Cashfree",
    icon: <MdPayment className="text-2xl text-green-500" />,
  },
];

const Footer = () => {
  const { cartItems } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, isSignedIn } = useAuth();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <footer className="mt-10">
      <div className="relative">
        <div className="absolute bottom-0 w-full h-1/2 bg-[#F0F0F0]"></div>
        <div className="px-4">
          <NewsLetterSection />
        </div>
      </div>
      <div className="pt-8 md:pt-[50px] bg-[#F0F0F0] px-4 pb-4">
        <div className="max-w-frame mx-auto">
          <nav className="lg:grid lg:grid-cols-12 mb-8">
            <div className="flex flex-col lg:col-span-3 lg:max-w-[248px]">
              {/* Logo Section - matching header */}
              <div className="mb-6">
                <img
                  src={websiteLogo}
                  alt="Cremson Publications"
                  className="max-w-[120px] mb-4"
                />
              </div>

              <p className="text-black/60 text-sm mb-6">
                Discover quality educational books and publications that enhance
                learning and inspire knowledge. From textbooks to reference
                materials.
              </p>

              {/* Header-style navigation icons */}
              <div className="flex items-center mb-6 space-x-4">
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="p-2 hover:bg-white/50 rounded-full transition-all"
                >
                  <Search size={20} className="text-red-500" />
                </button>
                <Link
                  to="/wishlist"
                  className="p-2 hover:bg-white/50 rounded-full transition-all relative"
                >
                  <Heart size={20} className="text-red-500" />
                  {getWishlistCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {getWishlistCount()}
                    </span>
                  )}
                </Link>
                <Link
                  to="/cart"
                  className="p-2 hover:bg-white/50 rounded-full transition-all relative"
                >
                  <ShoppingCart size={20} className="text-red-500" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                {isSignedIn() ? (
                  <div className="p-2">
                    {user?.name ? (
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center border border-gray-300">
                        <span className="text-white text-xs font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    ) : (
                      <User size={20} className="text-red-500" />
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSignInModal(true)}
                    className="p-2 hover:bg-white/50 rounded-full transition-all"
                  >
                    <User size={20} className="text-red-500" />
                  </button>
                )}
              </div>

              {/* Social media */}
              <div className="flex items-center">
                {socialsData.map((social) => (
                  <Link
                    to={social.url}
                    key={social.id}
                    className="bg-white hover:bg-black hover:text-white transition-all mr-3 w-7 h-7 rounded-full border border-black/20 flex items-center justify-center p-1.5"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden lg:grid col-span-9 lg:grid-cols-4 lg:pl-10">
              <LinksSection />
            </div>
            <div className="grid lg:hidden grid-cols-2 sm:grid-cols-4">
              <LinksSection />
            </div>
          </nav>

          <hr className="h-[1px] border-t-black/10 mb-6" />
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-2">
            <p className="text-sm text-center sm:text-left text-black/60 mb-4 sm:mb-0 sm:mr-1">
              Cremson Publications © {new Date().getFullYear()} - Quality
              Educational Materials
            </p>
          </div>
        </div>
        <LayoutSpacing />
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className="bg-white p-4 m-4 rounded-lg max-w-md mx-auto mt-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Search Products</h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Search size={24} className="text-gray-400" />
              </button>
            </div>
            <SearchDropdown
              className="w-full"
              onResultClick={() => setShowSearchModal(false)}
            />
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </footer>
  );
};

export default Footer;
