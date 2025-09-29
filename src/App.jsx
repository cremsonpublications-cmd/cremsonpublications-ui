import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { makeStore } from './lib/store';
import { satoshi } from './styles/fonts';
import { cn } from './lib/utils';

import TopBanner from './components/layout/Banner/TopBanner';
import TopNavbar from './components/layout/Navbar/TopNavbar';
import Footer from './components/layout/Footer';
import SpinnerLoader from './components/ui/SpinnerbLoader';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';

import './styles/globals.css';

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
        <Router>
          <div className={cn(satoshi.className, "min-h-screen flex flex-col")}>
            <TopBanner />
            <TopNavbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
