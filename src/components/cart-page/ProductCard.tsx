import React from "react";
import { PiTrashFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext";

type ProductCardProps = {
  data: any; // Cart item with quantity
};

const ProductCard = ({ data }: ProductCardProps) => {
  const { removeFromCart, incrementQuantity, decrementQuantity } = useCart();

  // Debug: Log the data to see what's available
  console.log('Cart item data:', data);

  // Get price from available fields
  const itemPrice = data.price || data.finalPrice || data.mrp || 0;
  const originalPrice = data.mrp || data.old_price || itemPrice;

  // Calculate discount percentage and amount
  const hasDiscount = originalPrice > itemPrice;
  const discountPercentage = hasDiscount ?
    Math.round(((originalPrice - itemPrice) / originalPrice) * 100) : 0;
  const discountAmount = hasDiscount ? originalPrice - itemPrice : 0;

  return (
    <div className="flex items-start space-x-4">
      <Link
        to={`/shop/product/${data.id}`}
        className="bg-[#F0EEED] rounded-lg w-full min-w-[100px] max-w-[100px] sm:max-w-[124px] aspect-square overflow-hidden"
      >
        <img
          src={data.main_image}
          className="rounded-md w-full h-full object-cover hover:scale-110 transition-all duration-500"
          alt={data.name}
        />
      </Link>
      <div className="flex w-full self-stretch flex-col">
        <div className="flex items-center justify-between">
          <Link
            to={`/shop/product/${data.id}`}
            className="text-black font-bold text-base xl:text-xl"
          >
            {data.name}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 md:h-9 md:w-9"
            onClick={() => removeFromCart(data.id)}
          >
            <PiTrashFill className="text-xl md:text-2xl text-red-600" />
          </Button>
        </div>

        {/* Author and Category info */}
        {data.author && (
          <div className="-mt-1">
            <span className="text-black text-xs md:text-sm mr-1">Author:</span>
            <span className="text-black/60 text-xs md:text-sm">
              {data.author}
            </span>
          </div>
        )}

        {data.categories?.main_category_name && (
          <div className="mb-auto -mt-1.5">
            <span className="text-black text-xs md:text-sm mr-1">Category:</span>
            <span className="text-black/60 text-xs md:text-sm">
              {data.categories.main_category_name}
            </span>
          </div>
        )}

        <div className="flex items-center flex-wrap justify-between">
          <div className="flex items-center space-x-[5px] xl:space-x-2.5">
            <span className="font-bold text-black text-xl xl:text-2xl">
              ₹{itemPrice}
            </span>
            {hasDiscount && (
              <>
                <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
                  ₹{originalPrice}
                </span>
                <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                  -{discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between bg-orange-500 text-white rounded-full px-3 h-8 md:h-10 min-w-[105px] max-w-[105px] sm:max-w-32">
            <button
              onClick={() => decrementQuantity(data.id)}
              className="hover:bg-orange-600 rounded-full p-1 transition-all duration-200"
            >
              <Minus size={12} />
            </button>
            <span className="text-sm font-semibold">{data.quantity}</span>
            <button
              onClick={() => incrementQuantity(data.id)}
              className="hover:bg-orange-600 rounded-full p-1 transition-all duration-200"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
