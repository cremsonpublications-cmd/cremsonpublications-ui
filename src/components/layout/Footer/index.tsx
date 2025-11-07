import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import React, { useState } from "react";
import { PaymentBadge, SocialNetworks } from "./footer.types";
// Replaced react-icons with SVG components to reduce bundle size
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Heart, User, ShoppingCart, Instagram, Youtube, CreditCard } from "lucide-react";
import LinksSection from "./LinksSection";
import NewsLetterSection from "./NewsLetterSection";
import LayoutSpacing from "./LayoutSpacing";
import websiteLogo from "../../../assets/CP-Logo.png";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import SearchDropdown from "../../ui/SearchDropdown";
import { useUser } from "../../../context/AuthContext";
import { MapPin, Phone, Smartphone, Mail, Clock } from "lucide-react";

const socialsData: SocialNetworks[] = [
  {
    id: 1,
    icon: <Instagram size={20} />,
    url: "https://www.instagram.com/cremsonbooks/?igsh=MTFweXAwYnk3c2wyOQ%3D%3D",
  },
  {
    id: 2,
    icon: <Youtube size={20} />,
    url: "https://www.youtube.com/@cremson_publications",
  },
];

const Footer = () => {
  const { cartItems } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Define routes where map should be hidden
  const hideMapRoutes = ['/cart', '/checkout', '/payment', '/payment-status', '/payment-callback'];
  const shouldHideMap = hideMapRoutes.some(route => location.pathname.startsWith(route));

  return (
    <footer className="mt-10">
      {/* Contact Section Above Footer */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 xl:px-0">
          <div className={`grid gap-6 md:gap-12 items-start ${shouldHideMap ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {/* Company Information */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                  <img
                    className="max-w-[70px] md:max-w-[100px]"
                    src={websiteLogo}
                    alt=""
                  />
                </h3>

                {/* Address */}
                <div className="mb-4 md:mb-6">
                  <div className="flex items-start gap-3 md:gap-4 mb-2">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
                        Address:
                      </h4>
                      <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
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
                <div className="mb-4 md:mb-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs md:text-lg font-semibold text-gray-900">
                        Phone:{" "}
                      </span>
                      <a
                        href="tel:011-4578594"
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-xs md:text-base"
                      >
                        011-4578594
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                    <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs md:text-lg font-semibold text-gray-900">
                        Mobile:{" "}
                      </span>
                      <a
                        href="tel:+917982645175"
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-xs md:text-base"
                      >
                        +91 79826 45175
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4 md:mb-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs md:text-lg font-semibold text-gray-900">
                        Email:{" "}
                      </span>
                      <a
                        href="mailto:info@cremsonpublications.com"
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-xs md:text-base"
                      >
                        info@cremsonpublications.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="mb-6 md:mb-8">
                  <div className="flex items-start gap-3 md:gap-4">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
                        Working Hours:
                      </h4>
                      <p className="text-xs md:text-sm text-gray-700">
                        Monday - Saturday, 09:00 AM - 06:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Container - Hidden on cart/payment pages */}
            {!shouldHideMap && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-[300px] md:h-[500px] relative">
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
            )}
          </div>
        </div>
      </section>

      <div className="relative">
        <div className="absolute bottom-0 w-full h-1/2 bg-[#F0F0F0]"></div>
        <div className="px-4">
          <NewsLetterSection />
        </div>
      </div>
      <div className="pt-4 md:pt-8 lg:pt-[50px] bg-[#F0F0F0] px-4 pb-2 md:pb-4">
        <div className="max-w-frame mx-auto">
          <div className="lg:grid lg:grid-cols-12 mb-6 md:mb-8">
            <div className="flex flex-col lg:col-span-3 lg:max-w-[248px] mb-4 md:mb-0">
              {/* Logo Section - using image instead of name */}
              <div className="mb-4">
                <img
                  src={websiteLogo}
                  alt="Cremson Publications"
                  className="max-w-[80px] md:max-w-[120px] mb-3 md:mb-4"
                />
              </div>

              <p className="text-black/60 text-xs md:text-sm mb-4 md:mb-6">
                Discover quality educational books and publications that enhance
                learning and inspire knowledge. From textbooks to reference
                materials.
              </p>

              {/* Social media */}
              <div className="flex items-center">
                {socialsData.map((social) => (
                  <Link
                    to={social.url}
                    key={social.id}
                    className="bg-white hover:bg-black hover:text-white transition-all mr-2 md:mr-3 w-6 h-6 md:w-7 md:h-7 rounded-full border border-black/20 flex items-center justify-center p-1"
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
          </div>

          <hr className="h-[1px] border-t-black/10 mb-3 md:mb-6" />
          <div className="flex flex-col items-center text-center space-y-1 md:space-y-2 mb-1 md:mb-2">
            <p className="text-xs md:text-sm text-black/60">
              Design and developed by{" "}
              <a
                href="https://www.oratechsolution.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-700 hover:underline font-medium"
              >
                Oratech Solution
              </a>
            </p>
            <p className="text-xs md:text-sm text-black/60">
              © {new Date().getFullYear()} Cremson Publications. All rights
              reserved.
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
    </footer>
  );
};

export default Footer;
