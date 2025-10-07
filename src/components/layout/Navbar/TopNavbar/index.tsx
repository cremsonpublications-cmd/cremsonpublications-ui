import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { NavMenu } from "../navbar.types";
import { MenuList } from "./MenuList";
import websiteLogo from "@/assets/CP-Logo.png";
import { Search, Heart, User } from "lucide-react";
import { useWishlist } from "../../../../context/WishlistContext";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MenuItem } from "./MenuItem";

import InputGroup from "@/components/ui/input-group";
import ResTopNavbar from "./ResTopNavbar";
import CartBtn from "./CartBtn";
import SearchDropdown from "@/components/ui/SearchDropdown";
import SignInModal from "../../../auth/SignInModal";
import { useAuth } from "../../../../context/AuthContext";

const data: NavMenu = [
  {
    id: 1,
    type: "MenuItem",
    label: "Home",
    url: "/",
    children: [],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "Shop",
    url: "/shop",
    children: [],
  },
  {
    id: 3,
    type: "MenuItem",
    label: "About Us",
    url: "/about-us",
    children: [],
  },
  {
    id: 4,
    type: "MenuItem",
    label: "Contact Us",
    url: "/contact-us",
    children: [],
  },
];

const TopNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getWishlistCount } = useWishlist();
  const { user, signOut, isSignedIn } = useAuth();
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const [showSignInModal, setShowSignInModal] = React.useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const isActiveRoute = (url) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(url);
  };

  return (
    <nav className="sticky top-0 bg-white z-20">
      <div className="flex relative max-w-frame mx-auto items-center justify-between py-5 md:py-6 px-4 xl:px-0">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center flex-shrink-0">
          <div className="block md:hidden mr-4">
            <ResTopNavbar data={data} />
          </div>
          <Link to="/" className="mb-2 mr-4 lg:mr-8">
            <img
              src={websiteLogo}
              alt="Cremson Publications"
              className="max-w-[100px]"
            />
          </Link>
        </div>

        {/* Center Section - Navigation Menu and Search */}
        <div className="hidden md:flex items-center flex-1 gap-4 lg:gap-8">
          <NavigationMenu className="flex-shrink-0">
            <NavigationMenuList>
              {data.map((item) => (
                <React.Fragment key={item.id}>
                  {item.type === "MenuItem" && (
                    <MenuItem
                      label={item.label}
                      url={item.url}
                      isActive={isActiveRoute(item.url)}
                    />
                  )}
                  {item.type === "MenuList" && (
                    <MenuList data={item.children} label={item.label} />
                  )}
                </React.Fragment>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Section - Takes remaining space */}
          <div className="flex-1 max-w-lg">
            <SearchDropdown className="w-full" />
          </div>
        </div>

        {/* Right Section - Action Icons */}
        <div className="flex items-center flex-shrink-0 gap-3">
          <button
            onClick={() => setShowMobileSearch(true)}
            className="block md:hidden p-1"
          >
            <Search size={22} className="text-red-500" />
          </button>
          <Link to="/wishlist" className="p-1 relative">
            <Heart size={22} className="text-red-500" />
            {getWishlistCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {getWishlistCount()}
              </span>
            )}
          </Link>
          <CartBtn />
          {isSignedIn() ? (
            <div className="relative group">
              <button className="p-1 flex items-center gap-2">
                {user?.name ? (
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center border border-gray-300">
                    <span className="text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <User size={22} className="text-red-500" />
                )}
                {user?.given_name && (
                  <span className="hidden sm:block text-sm text-gray-700">
                    {user.given_name}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/my-orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowSignInModal(true)}
              className="p-1"
            >
              <User size={22} className="text-red-500" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setShowMobileSearch(false)}
        >
          <div
            className="bg-white p-4 m-4 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Search Products</h3>
              <button
                onClick={() => setShowMobileSearch(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Search size={24} className="text-gray-400" />
              </button>
            </div>
            <SearchDropdown
              className="w-full"
              onResultClick={() => setShowMobileSearch(false)}
            />
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </nav>
  );
};

export default TopNavbar;
