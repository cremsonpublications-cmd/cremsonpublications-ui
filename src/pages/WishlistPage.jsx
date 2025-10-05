import React from "react";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/common/ProductCard";
import { Button } from "../components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { wishlistItems, clearWishlist, getWishlistCount } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-600 mb-6">
                Start browsing and add books you love to your wishlist!
              </p>
              <Link to="/shop">
                <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full">
                  Browse Books
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="font-bold text-2xl md:text-[32px] mb-2">
              My Wishlist
            </h1>
            <p className="text-sm md:text-base text-black/60">
              {getWishlistCount()} item{getWishlistCount() !== 1 ? 's' : ''} in your wishlist
            </p>
          </div>

          {/* Clear Wishlist Button */}
          <Button
            onClick={clearWishlist}
            variant="outline"
            className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Clear Wishlist
          </Button>
        </div>

        {/* Wishlist Items Grid */}
        <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <hr className="border-t-black/10 mb-8" />
          <h3 className="text-xl font-semibold mb-4">
            Want to discover more books?
          </h3>
          <Link to="/shop">
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}