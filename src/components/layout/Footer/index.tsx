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
import { MapPin, Phone, Smartphone, Mail, Clock } from "lucide-react";

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
      {/* Contact Section Above Footer */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 xl:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Company Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  CREMSON PUBLICATIONS
                </h3>

                {/* Address */}
                <div className="mb-6">
                  <div className="flex items-start gap-4 mb-2">
                    <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Address:
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        4578/15 (Basement), Aggarwal Road,
                        <br />
                        Opp. Happy School, Darya Ganj,
                        <br />
                        New Delhi – 110002
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-3">
                    <Phone className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="text-lg font-semibold text-gray-900">
                        Phone (Landline):{" "}
                      </span>
                      <a
                        href="tel:011-4578594"
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        011-4578594
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <Smartphone className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="text-lg font-semibold text-gray-900">
                        Mobile:{" "}
                      </span>
                      <a
                        href="tel:+917982645175"
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        +91 79826 45175
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="text-lg font-semibold text-gray-900">
                        Email:{" "}
                      </span>
                      <a
                        href="mailto:info@cremsonpublications.com"
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        info@cremsonpublications.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="mb-8">
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Working Hours:
                      </h4>
                      <p className="text-gray-700">
                        Monday - Saturday, 09:00 AM - 06:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-[500px] relative">
                <iframe
                  title="Cremson Publications Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.674920656613!2d77.243199!3d28.6489313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfdb930b05529%3A0xc91931c5625f55a3!2sCremson%20Publications%204578%2F15%2C%20Ansari%20Rd%20opp.%20Happy%20School%2C%20Daryaganj%20New%20Delhi%2C%20Delhi%2C%20110002!5e0!3m2!1sen!2sin!4v1750450282497!5m2!1sen!2sin"
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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
