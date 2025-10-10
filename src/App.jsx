import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { makeStore } from "./lib/store";
import { satoshi } from "./styles/fonts";
import { cn } from "./lib/utils";
import { Toaster } from "sonner";

import { ProductProvider } from "./context/ProductContext";
import { FilterProvider } from "./context/FilterContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { CouponProvider } from "./context/CouponContext";
import { OrderProvider } from "./context/OrderContext";
import ClerkProvider from "./providers/ClerkProvider";
import TopNavbar from "./components/layout/Navbar/TopNavbar";
import Footer from "./components/layout/Footer";
import SpinnerLoader from "./components/ui/SpinnerbLoader";
import ScrollToTop from "./components/common/ScrollToTop";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import ShippingPage from "./pages/ShippingPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import PricingPolicy from "./pages/PricingPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CancellationRefund from "./pages/CancellationRefund";
import ContactPage from "./pages/ContactPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

import "./styles/globals.css";

const { store, persistor } = makeStore();

// Component to conditionally render Footer
const ConditionalFooter = () => {
  const location = useLocation();
  const authPages = ['/signin', '/signup'];
  
  if (authPages.includes(location.pathname)) {
    return null;
  }
  
  return <Footer />;
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        }
        persistor={persistor}
      >
        <ClerkProvider>
          <ProductProvider>
            <CouponProvider>
              <OrderProvider>
                <FilterProvider>
                  <WishlistProvider>
                    <CartProvider>
                  <Router>
                    <div className={cn([satoshi.className, "antialiased"])}>
                      <div className="relative">
                        <TopNavbar />
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/shop" element={<ShopPage />} />
                          <Route
                            path="/shop/product/:productId"
                            element={<ProductPage />}
                          />
                          <Route path="/cart" element={<CartPage />} />
                          <Route
                            path="/wishlist"
                            element={<WishlistPage />}
                          />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/checkout/shipping" element={<ShippingPage />} />
                          <Route path="/my-orders" element={<MyOrdersPage />} />
                          <Route path="/pricing-policy" element={<PricingPolicy />} />
                          <Route path="/shipping-policy" element={<ShippingPolicy />} />
                          <Route path="/terms-conditions" element={<TermsConditions />} />
                          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                          <Route path="/cancellation-refund" element={<CancellationRefund />} />
                          <Route path="/contact-us" element={<ContactPage />} />
                          <Route path="/signin" element={<SignInPage />} />
                          <Route path="/signup" element={<SignUpPage />} />
                        </Routes>
                      </div>
                      <ConditionalFooter />
                    </div>
                    <Toaster position="top-right" richColors />
                  </Router>
                </CartProvider>
              </WishlistProvider>
            </FilterProvider>
            </OrderProvider>
            </CouponProvider>
          </ProductProvider>
        </ClerkProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
