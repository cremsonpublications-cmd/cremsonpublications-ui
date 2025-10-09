import { useState, useEffect } from "react";
import ProductListSec from "../components/common/ProductListSec";
import ProductListSecSkeleton from "../components/common/ProductListSecSkeleton";
import Header from "../components/homepage/Header";
import Reviews from "../components/homepage/Reviews";
import { useProducts } from "../context/ProductContext";
import { reviewsApi } from "../services/reviewApi";

export default function HomePage() {
  const { products, loading, error } = useProducts();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

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
    </>
  );
}
