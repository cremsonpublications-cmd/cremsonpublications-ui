import { Link } from "react-router-dom";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../../../context/CartContext";

const CartBtn = () => {
  const { cartItems } = useCart();
  const totalProducts = cartItems.length;

  return (
    <Link to="/cart" className="relative mr-[14px] p-1">
      <ShoppingCart size={22} className="" />
      {totalProducts > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {totalProducts}
        </span>
      )}
    </Link>
  );
};

export default CartBtn;
