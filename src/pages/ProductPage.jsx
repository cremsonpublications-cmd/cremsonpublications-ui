import { useParams, Navigate } from "react-router-dom";
import ProductListSec from "../components/common/ProductListSec";
import BreadcrumbProduct from "../components/product-page/BreadcrumbProduct";
import Header from "../components/product-page/Header";
import Tabs from "../components/product-page/Tabs";
import ProductReviews from "../components/product-page/ProductReviews";
import BoughtTogether from "../components/product-page/BoughtTogether";
import { useProducts } from "../context/ProductContext";
import ProductPageSkeleton from "../components/product-page/ProductPageSkeleton";

const newArrivalsData = [
  {
    id: 1,
    title: "T-shirt with Tape Details",
    srcUrl: "/images/pic1.png",
    gallery: ["/images/pic1.png", "/images/pic10.png", "/images/pic11.png"],
    price: 120,
    discount: { amount: 0, percentage: 0 },
    rating: 4.5,
  },
  {
    id: 2,
    title: "Skinny Fit Jeans",
    srcUrl: "/images/pic2.png",
    gallery: ["/images/pic2.png"],
    price: 260,
    discount: { amount: 0, percentage: 20 },
    rating: 3.5,
  },
  {
    id: 3,
    title: "Checkered Shirt",
    srcUrl: "/images/pic3.png",
    gallery: ["/images/pic3.png"],
    price: 180,
    discount: { amount: 0, percentage: 0 },
    rating: 4.5,
  },
  {
    id: 4,
    title: "Sleeve Striped T-shirt",
    srcUrl: "/images/pic4.png",
    gallery: ["/images/pic4.png", "/images/pic10.png", "/images/pic11.png"],
    price: 160,
    discount: { amount: 0, percentage: 30 },
    rating: 4.5,
  },
];

const topSellingData = [
  {
    id: 5,
    title: "Vertical Striped Shirt",
    srcUrl: "/images/pic5.png",
    gallery: ["/images/pic5.png", "/images/pic10.png", "/images/pic11.png"],
    price: 232,
    discount: { amount: 0, percentage: 20 },
    rating: 5.0,
  },
  {
    id: 6,
    title: "Courage Graphic T-shirt",
    srcUrl: "/images/pic6.png",
    gallery: ["/images/pic6.png", "/images/pic10.png", "/images/pic11.png"],
    price: 145,
    discount: { amount: 0, percentage: 0 },
    rating: 4.0,
  },
  {
    id: 7,
    title: "Loose Fit Bermuda Shorts",
    srcUrl: "/images/pic7.png",
    gallery: ["/images/pic7.png"],
    price: 80,
    discount: { amount: 0, percentage: 0 },
    rating: 3.0,
  },
  {
    id: 8,
    title: "Faded Skinny Jeans",
    srcUrl: "/images/pic8.png",
    gallery: ["/images/pic8.png"],
    price: 210,
    discount: { amount: 0, percentage: 0 },
    rating: 4.5,
  },
];

const relatedProductData = [
  {
    id: 12,
    title: "Polo with Contrast Trims",
    srcUrl: "/images/pic12.png",
    gallery: ["/images/pic12.png", "/images/pic10.png", "/images/pic11.png"],
    price: 242,
    discount: { amount: 0, percentage: 20 },
    rating: 4.0,
  },
  {
    id: 13,
    title: "Gradient Graphic T-shirt",
    srcUrl: "/images/pic13.png",
    gallery: ["/images/pic13.png", "/images/pic10.png", "/images/pic11.png"],
    price: 145,
    discount: { amount: 0, percentage: 0 },
    rating: 3.5,
  },
  {
    id: 14,
    title: "Polo with Tipping Details",
    srcUrl: "/images/pic14.png",
    gallery: ["/images/pic14.png"],
    price: 180,
    discount: { amount: 0, percentage: 0 },
    rating: 4.5,
  },
  {
    id: 15,
    title: "Black Striped T-shirt",
    srcUrl: "/images/pic15.png",
    gallery: ["/images/pic15.png"],
    price: 150,
    discount: { amount: 0, percentage: 30 },
    rating: 5.0,
  },
];

const data = [...newArrivalsData, ...topSellingData, ...relatedProductData];

export default function ProductPage() {
  const { productId } = useParams();
  const { products, loading, error, getProductById } = useProducts();

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Find product from Supabase data
  const productData = products.find((product) => product.id === Number(productId));

  if (!productData?.name) {
    return <Navigate to="/shop" replace />;
  }

  // Get 4 random products (excluding sold out products)
  const getRandomProducts = () => {
    // Filter out sold out products and current product
    const availableProducts = products.filter(product =>
      product.id !== productData.id && product.status !== "Out of Stock"
    );

    if (availableProducts.length >= 4) {
      // If we have enough available products, use them
      const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4);
    } else {
      // If not enough available products, use all available products
      const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(4, availableProducts.length));
    }
  };

  const randomProducts = getRandomProducts();

  // Debug logging
  console.log('ProductPage Debug:', {
    totalProducts: products.length,
    currentProductId: productData.id,
    randomProductsCount: randomProducts.length,
    randomProducts: randomProducts
  });

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={productData?.name ?? "product"} />
        <section className="mb-11">
          <Header data={productData} />
        </section>

        {/* Bought Together Section */}
        <section className="mb-11">
          <BoughtTogether currentProduct={productData} />
        </section>


        {/* Reviews Section */}
        <section className="mb-11">
          <ProductReviews productId={productData.id} />
        </section>
      </div>
      <div className="mb-[50px] sm:mb-20">
        <ProductListSec
          title="You might also like"
          data={randomProducts}
        />
      </div>
    </main>
  );
}
