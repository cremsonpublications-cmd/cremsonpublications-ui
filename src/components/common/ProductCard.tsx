import React from "react";
import Rating from "../ui/Rating";
import { Link } from "react-router-dom";
import { Heart, Plus, Minus } from "lucide-react";
import { Product } from "@/types/product.types";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, getItemQuantity, incrementQuantity, decrementQuantity } =
    useCart();

  const cartQuantity = getItemQuantity(data.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(data);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productForCart = {
      id: data.id,
      name: data.name,
      price: finalPrice,
      main_image: data.main_image,
      author: data.author,
      isbn: data.isbn,
      status: data.status
    };
    addToCart(productForCart, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    incrementQuantity(data.id);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    decrementQuantity(data.id);
  };

  // Calculate actual price based on discounts
  const calculatePrice = () => {
    const mrp = data.mrp || 0;
    let finalPrice = mrp;
    let discountPercentage = 0;

    // Check if product has its own discount
    if (data.has_own_discount && data.own_discount_percentage) {
      discountPercentage = data.own_discount_percentage;
    }
    // Otherwise use category discount if enabled
    else if (data.use_category_discount && data.categories) {
      const category = data.categories;
      if (category.offer_type === "percentage" && category.offer_percentage) {
        discountPercentage = category.offer_percentage;
      } else if (
        category.offer_type === "flat_amount" &&
        category.offer_amount
      ) {
        finalPrice = mrp - category.offer_amount;
        return {
          finalPrice: Math.max(0, finalPrice),
          mrp,
          discountPercentage: 0,
        };
      }
    }

    // Apply percentage discount
    if (discountPercentage > 0) {
      finalPrice = mrp - (mrp * discountPercentage) / 100;
    }

    return {
      finalPrice: Math.round(finalPrice),
      mrp,
      discountPercentage: Math.round(discountPercentage),
    };
  };

  const { finalPrice, mrp, discountPercentage } = calculatePrice();
  const hasDiscount = finalPrice < mrp;
  const isOutOfStock = data.status === "Out of Stock";

  return (
    <Link
      to={`/shop/product/${data.id}`}
      className="flex flex-col items-start aspect-auto"
    >
      <div className="bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden relative p-4">
        <img
          src={data.main_image}
          className="w-full h-full object-contain hover:scale-102 transition-all duration-200"
          alt={data.name}
        />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Show SOLD OUT if out of stock, otherwise show discount badges */}
          {isOutOfStock ? (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded shadow-md">
              SOLD OUT
            </span>
          ) : (
            <>
              {/* Discount badge - only show if not sold out and has discount */}
              {discountPercentage > 0 && (
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded shadow-md">
                  -{discountPercentage}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist button - top right */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-150"
        >
          <Heart
            size={18}
            className={`transition-all duration-150 ${
              isInWishlist(data.id)
                ? "text-red-500 fill-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>
      </div>
      
      <div className="mb-1">
        <strong className="text-black xl:text-xl line-clamp-2 leading-tight">
          {data.name}
        </strong>
      </div>

      {/* Rating Section - Always show for debugging */}
      {true && (
        <div className="flex items-end gap-2 mb-2">
          <div className="flex items-end gap-1">
            <Rating
              initialValue={data.rating || 0}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-200"
              fillClassName="fill-yellow-400"
              size={14}
              readonly
            />
            <span className="text-sm font-medium text-gray-700">
              {data.rating ? data.rating.toFixed(1) : '0.0'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            ({data.review_count || 0} review{(data.review_count || 0) !== 1 ? 's' : ''})
          </span>
        </div>
      )}

      <div className="flex items-center justify-between w-full mt-auto">
        <div className="flex items-center space-x-[5px] xl:space-x-2.5">
          <span className="font-bold text-black text-xl xl:text-2xl">
            ₹{finalPrice}
          </span>
          {hasDiscount && (
            <>
              <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
                ₹{mrp}
              </span>
            </>
          )}
        </div>

        {/* Add to Cart Button - inline with price */}
        <div className="flex justify-end">
          {cartQuantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="h-10 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 rounded-full transition-all duration-150 text-sm whitespace-nowrap"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-orange-500 text-white rounded-full px-3 h-10 min-w-[100px]">
              <button
                onClick={handleDecrement}
                className="hover:bg-orange-600 rounded-full p-1 transition-all duration-150"
              >
                <Minus size={12} />
              </button>
              <span className="text-sm font-semibold">{cartQuantity}</span>
              <button
                onClick={handleIncrement}
                className="hover:bg-orange-600 rounded-full p-1 transition-all duration-150"
              >
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
