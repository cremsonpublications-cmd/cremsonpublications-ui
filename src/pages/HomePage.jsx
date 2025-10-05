import ProductListSec from "../components/common/ProductListSec";
import ProductListSecSkeleton from "../components/common/ProductListSecSkeleton";
import Header from "../components/homepage/Header";
import Reviews from "../components/homepage/Reviews";
import { reviewsData } from "../data/reviewsData";
import { useProducts } from "../context/ProductContext";

export default function HomePage() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <>
        <Header />
        <main className="my-[50px] sm:my-[72px]">
          <ProductListSecSkeleton title="Best Selling Books" />

          <Reviews data={reviewsData} />
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

        <Reviews data={reviewsData} />
      </main>
    </>
  );
}
