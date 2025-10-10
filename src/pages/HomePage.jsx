import { useState, useEffect } from "react";
import ProductListSec from "../components/common/ProductListSec";
import ProductListSecSkeleton from "../components/common/ProductListSecSkeleton";
import Header from "../components/homepage/Header";
import Reviews from "../components/homepage/Reviews";
import CouponPopup from "../components/CouponPopup";
import { useProducts } from "../context/ProductContext";
import { useCoupons } from "../context/CouponContext";
import { reviewsApi } from "../services/reviewApi";

export default function HomePage() {
  const { products, loading, error } = useProducts();
  const { hasAvailableCoupons, selectedCoupons } = useCoupons();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showCouponPopup, setShowCouponPopup] = useState(false);

  // Debug: Add console logs to check coupon data
  console.log('HomePage - selectedCoupons:', selectedCoupons);
  console.log('HomePage - hasAvailableCoupons():', hasAvailableCoupons());

  // Function to transform database reviews to UI format
  const transformReviewsForUI = (dbReviews) => {
    return dbReviews.map((review) => ({
      id: review.id,
      user: review.user_name,
      content: review.comment,
      rating: review.rating,
      date: new Date(review.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));
  };

  // Fetch reviews for homepage
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const featuredReviews = await reviewsApi.getFeaturedReviews(6);
        const transformedReviews = transformReviewsForUI(featuredReviews);
        setReviews(transformedReviews);
      } catch (error) {
        console.error("Error fetching homepage reviews:", error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Show coupon popup after 4 seconds, but only once per day and only if coupons are available
  useEffect(() => {
    const checkAndShowPopup = () => {
      const lastShown = localStorage.getItem('couponPopupLastShown');
      const now = new Date().getTime();
      const twoHoursInMs = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

      // Check if popup was never shown or if 2 hours have passed
      if (!lastShown || (now - parseInt(lastShown)) > twoHoursInMs) {
        // Check if there are any available coupons before showing popup
        if (hasAvailableCoupons()) {
          const timer = setTimeout(() => {
            setShowCouponPopup(true);
            // Mark popup as shown with current timestamp
            localStorage.setItem('couponPopupLastShown', now.toString());
          }, 4000); // Show after 4 seconds

          return () => clearTimeout(timer);
        } else {
          console.log('No coupons available, skipping popup');
        }
      }
    };

    checkAndShowPopup();
  }, [hasAvailableCoupons]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="my-[50px] sm:my-[72px]">
          <ProductListSecSkeleton title="Best Selling Books" />
          {/* Don't show reviews section during loading */}
        </main>
      </>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="my-[50px] sm:my-[72px]">
        <ProductListSec
          title="Best Selling Books"
          data={products.slice(0, 4)} // Show first 4 products
          viewAllLink="/shop"
        />
      </main>
      
      {/* Coupon Popup */}
      <CouponPopup 
        isOpen={showCouponPopup} 
        onClose={() => {
          setShowCouponPopup(false);
          // Update timestamp when manually closed to prevent showing again today
          const now = new Date().getTime();
          localStorage.setItem('couponPopupLastShown', now.toString());
        }} 
      />
    </>
  );
}
