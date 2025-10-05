import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { AuthProvider } from "./context/AuthContext";
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
import PaymentPage from "./pages/PaymentPage";
import MyOrdersPage from "./pages/MyOrdersPage";

import "./styles/globals.css";

const { store, persistor } = makeStore();

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center h-96">
            <SpinnerLoader className="w-10 border-2 border-gray-300 border-r-gray-600" />
          </div>
        }
        persistor={persistor}
      >
        <AuthProvider>
          <ProductProvider>
            <FilterProvider>
              <WishlistProvider>
                <CartProvider>
                  <Router>
                    <ScrollToTop />
                    <div
                      className={cn(
                        satoshi.className,
                        "min-h-screen flex flex-col"
                      )}
                    >
                      <TopNavbar />
                      <div className="flex-1">
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/shop" element={<ShopPage />} />
                          <Route
                            path="/shop/product/:id"
                            element={<ProductPage />}
                          />
                          <Route path="/cart" element={<CartPage />} />
                          <Route
                            path="/wishlist"
                            element={<WishlistPage />}
                          />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/checkout/shipping" element={<ShippingPage />} />
                          <Route path="/checkout/payment" element={<PaymentPage />} />
                          <Route path="/my-orders" element={<MyOrdersPage />} />
                        </Routes>
                      </div>
                      <Footer />
                    </div>
                    <Toaster position="top-right" richColors />
                  </Router>
                </CartProvider>
              </WishlistProvider>
            </FilterProvider>
          </ProductProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
