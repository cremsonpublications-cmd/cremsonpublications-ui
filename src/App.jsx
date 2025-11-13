import React, { Suspense } from "react";
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
import { GlobalSettingsProvider } from "./context/GlobalSettingsContext";
import { ShippingProvider } from "./context/ShippingContext";
import { AuthProvider } from "./context/AuthContext";
import TopNavbar from "./components/layout/Navbar/TopNavbar";
import Footer from "./components/layout/Footer";
import SpinnerLoader from "./components/ui/SpinnerbLoader";
import ScrollToTop from "./components/common/ScrollToTop";
import ScrollToTopButton from "./components/common/ScrollToTopButton";

// Lazy load all page components
const HomePage = React.lazy(() => import("./pages/HomePage"));
const ShopPage = React.lazy(() => import("./pages/ShopPage"));
const ProductPage = React.lazy(() => import("./pages/ProductPage"));
const CartPage = React.lazy(() => import("./pages/CartPage"));
const WishlistPage = React.lazy(() => import("./pages/WishlistPage"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));
const ShippingPage = React.lazy(() => import("./pages/ShippingPage"));
const PaymentStatusPage = React.lazy(() => import("./pages/PaymentStatusPage"));
const PaymentCallbackPage = React.lazy(() => import("./pages/PaymentCallbackPage"));
const PaymentVerification = React.lazy(() => import("./pages/PaymentVerification"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailed = React.lazy(() => import("./pages/PaymentFailed"));
const MyOrdersPage = React.lazy(() => import("./pages/MyOrdersPage"));
const TermsConditions = React.lazy(() => import("./pages/TermsConditions"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const SpecimenPage = React.lazy(() => import("./pages/SpecimenPage"));
const SignInPage = React.lazy(() => import("./pages/SignInPage"));
const SignUpPage = React.lazy(() => import("./pages/SignUpPage"));
const ForgotPasswordPage = React.lazy(() => import("./pages/ForgotPasswordPage"));
const AuthCallbackPage = React.lazy(() => import("./pages/AuthCallbackPage"));

import "./styles/globals.css";

const { store, persistor } = makeStore();

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <SpinnerLoader />
  </div>
);

// Always show the navbar - removed conditional hiding

// Component to conditionally render ScrollToTopButton
const ConditionalScrollToTopButton = () => {
  const location = useLocation();
  const authPages = ['/signin', '/signup', '/forgot-password', '/auth/callback'];
  const paymentPages = ['/payment-verification', '/payment-success', '/payment-failed'];

  if (authPages.includes(location.pathname) || paymentPages.includes(location.pathname)) {
    return null;
  }

  return <ScrollToTopButton />;
};

// Component to conditionally render Footer
const ConditionalFooter = () => {
  const location = useLocation();
  const authPages = ['/signin', '/signup', '/forgot-password', '/auth/callback'];
  const checkoutPages = ['/checkout', '/checkout/shipping', '/payment-verification', '/payment-success', '/payment-failed', '/payment-status', '/payment-callback'];

  if (authPages.includes(location.pathname) || checkoutPages.includes(location.pathname)) {
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
        <AuthProvider>
          <ProductProvider>
            <GlobalSettingsProvider>
              <ShippingProvider>
                <CouponProvider>
                  <OrderProvider>
                    <FilterProvider>
                      <WishlistProvider>
                        <CartProvider>
                  <Router>
                    <ScrollToTop />
                    <div className={cn([satoshi.className, "antialiased"])}>
                      <div className="relative">
                        <TopNavbar />
                        <Suspense fallback={<PageLoader />}>
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
                            <Route path="/payment-verification" element={<PaymentVerification />} />
                            <Route path="/payment-success" element={<PaymentSuccess />} />
                            <Route path="/payment-failed" element={<PaymentFailed />} />
                            <Route path="/payment-status" element={<PaymentStatusPage />} />
                            <Route path="/payment-callback" element={<PaymentCallbackPage />} />
                            <Route path="/my-orders" element={<MyOrdersPage />} />
                            <Route path="/terms-conditions" element={<TermsConditions />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/contact-us" element={<ContactPage />} />
                            <Route path="/specimen" element={<SpecimenPage />} />
                            <Route path="/signin" element={<SignInPage />} />
                            <Route path="/signup" element={<SignUpPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/auth/callback" element={<AuthCallbackPage />} />
                          </Routes>
                        </Suspense>
                      </div>
                      <ConditionalFooter />
                    </div>
                    <ConditionalScrollToTopButton />
                    <Toaster position="top-right" richColors />
                  </Router>
                        </CartProvider>
                      </WishlistProvider>
                    </FilterProvider>
                  </OrderProvider>
                </CouponProvider>
              </ShippingProvider>
            </GlobalSettingsProvider>
          </ProductProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
