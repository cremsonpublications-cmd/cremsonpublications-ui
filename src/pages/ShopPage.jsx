import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BreadcrumbShop from "../components/shop-page/BreadcrumbShop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import MobileFilters from "../components/shop-page/filters/MobileFilters";
import Filters from "../components/shop-page/filters";
import { FiSliders } from "react-icons/fi";
import { ChevronLeft, ChevronRight, BookOpen, Search, RefreshCw } from "lucide-react";
import ProductCard from "../components/common/ProductCard";
import CartPopup from "../components/common/CartPopup";
import ChatbotTrigger from "../components/common/ChatbotTrigger";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useFilters } from "../context/FilterContext";
import ProductListSecSkeleton from "../components/common/ProductListSecSkeleton";

export default function ShopPage() {
  const { products, loading, error } = useProducts();
  const { showCartPopup, popupProduct, hidePopup } = useCart();
  const { getFilteredProducts, filters, updateFilter } = useFilters();

  // Responsive products per page
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = isMobile ? 8 : 9;

  // Get filtered products
  const filteredProducts = getFilteredProducts(products);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Reset to first page when products per page changes (mobile/desktop switch)
  useEffect(() => {
    setCurrentPage(1);
  }, [productsPerPage]);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    // Scroll to top of products section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          <BreadcrumbShop />
          <div className="flex md:space-x-5 items-start">
            <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-bold text-black text-xl">Filters</span>
                <FiSliders className="text-2xl text-black/40" />
              </div>
              <Filters />
            </div>
            <div className="flex flex-col w-full space-y-5">
              <div className="flex flex-col lg:flex-row lg:justify-between">
                <div className="flex items-center justify-between">
                  <h1 className="font-bold text-2xl md:text-[32px]">
                    All Books
                  </h1>
                  <MobileFilters />
                </div>
              </div>
              <ProductListSecSkeleton />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <div className="flex items-center justify-center h-96">
            <div className="text-lg text-red-500">Error: {error}</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters />
          </div>
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px]">All Books</h1>
                <MobileFilters />
              </div>
              <div className="flex flex-col sm:items-center sm:flex-row">
                <span className="text-sm md:text-base text-black/60 mr-3">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} Products
                </span>
                <div className="flex items-center">
                  Sort by:{" "}
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => updateFilter("sortBy", value)}
                  >
                    <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low-price">Low Price</SelectItem>
                      <SelectItem value="high-price">High Price</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="name-asc">Name A-Z</SelectItem>
                      <SelectItem value="name-desc">Name Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center max-w-md mx-auto">
                  <div className="mb-6">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {filteredProducts.length === 0 && products.length > 0 
                        ? "No products match your filters" 
                        : "No products available"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {filteredProducts.length === 0 && products.length > 0 
                        ? "Try adjusting your search criteria or clearing some filters to see more results."
                        : "We're working hard to add new books to our collection. Please check back soon!"}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {filteredProducts.length === 0 && products.length > 0 ? (
                      <>
                        <button
                          onClick={() => window.location.reload()}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Clear All Filters
                        </button>
                        <Link
                          to="/"
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
                        >
                          <Search className="w-4 h-4" />
                          Browse All Categories
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/"
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                          Back to Home
                        </Link>
                        <Link
                          to="/contact-us"
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          Contact Us
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                {/* Previous Button */}
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!showPage) {
                      // Show ellipsis for gaps
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 py-1 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          currentPage === page
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Popup */}
      <CartPopup
        isOpen={showCartPopup}
        product={popupProduct}
        onClose={hidePopup}
      />

      {/* Chatbot */}
      {/* <ChatbotTrigger /> */}
    </main>
  );
}




