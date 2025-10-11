"use client";

import React, { useState } from "react";
import { Product } from "@/types/product.types";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { Plus, Minus } from "lucide-react";

const AddToCardSection = ({ data }: { data: Product }) => {
  const navigate = useNavigate();
  const { 
    addToCart, 
    getItemQuantity, 
    incrementQuantity, 
    decrementQuantity, 
    isInCart 
  } = useCart();

  // Calculate actual price based on discounts (mirrors logic in Header/index.tsx)
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

  const { finalPrice } = calculatePrice();
  const cartQuantity = getItemQuantity(data.id);
  const isProductInCart = isInCart(data.id);
  const isOutOfStock = data.status === "Out of Stock";

  const handleBuyNow = () => {
    // If product is not in cart, add it first
    if (!isProductInCart) {
      const productForCart = {
        id: data.id,
        name: data.name,
        price: finalPrice,
        main_image: data.main_image,
        author: data.author,
        isbn: data.isbn,
        status: data.status,
        bulk_pricing: data.bulk_pricing,
        mrp: data.mrp,
        finalPrice: finalPrice
      };
      addToCart(productForCart, 1);
    }
    // Navigate to cart regardless
    navigate("/cart");
  };

  const handleAddToCart = () => {
    const productForCart = {
      id: data.id,
      name: data.name,
      price: finalPrice,
      main_image: data.main_image,
      author: data.author,
      isbn: data.isbn,
      status: data.status,
      bulk_pricing: data.bulk_pricing,
      mrp: data.mrp,
      finalPrice: finalPrice
    };
    addToCart(productForCart, 1);
  };

  const handleIncrement = () => {
    incrementQuantity(data.id);
  };

  const handleDecrement = () => {
    decrementQuantity(data.id);
  };

  return (
    <div className="fixed md:relative w-full bg-white border-t md:border-none border-black/5 bottom-0 left-0 p-4 md:p-0 z-10 flex items-center justify-between sm:justify-start md:justify-center">
      <div className="flex items-center gap-3 sm:gap-5 w-full">
        {/* Buy Now Button */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className={`flex-1 rounded-full h-11 md:h-[52px] text-sm sm:text-base transition-all ${
            isOutOfStock
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {isOutOfStock ? "Sold Out" : "Buy Now"}
        </button>

        {/* Add to Cart / Quantity Controls */}
        {isOutOfStock ? (
          cartQuantity === 0 ? (
            <button
              disabled
              className="bg-gray-400 text-white font-semibold px-6 rounded-full h-11 md:h-[52px] text-sm sm:text-base cursor-not-allowed whitespace-nowrap"
            >
              Sold Out
            </button>
          ) : (
            <div className="flex items-center justify-between bg-gray-400 text-white rounded-full px-4 h-11 md:h-[52px] min-w-[120px]">
              <button
                disabled
                className="rounded-full p-1 cursor-not-allowed opacity-50"
              >
                <Minus size={16} />
              </button>
              <span className="text-sm sm:text-base font-semibold mx-3">{cartQuantity}</span>
              <button
                disabled
                className="rounded-full p-1 cursor-not-allowed opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
          )
        ) : cartQuantity === 0 ? (
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 rounded-full h-11 md:h-[52px] text-sm sm:text-base transition-all duration-200 whitespace-nowrap"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between bg-orange-500 text-white rounded-full px-4 h-11 md:h-[52px] min-w-[120px]">
            <button
              onClick={handleDecrement}
              className="hover:bg-orange-600 rounded-full p-1 transition-all duration-200"
            >
              <Minus size={16} />
            </button>
            <span className="text-sm sm:text-base font-semibold mx-3">{cartQuantity}</span>
            <button
              onClick={handleIncrement}
              className="hover:bg-orange-600 rounded-full p-1 transition-all duration-200"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCardSection;
