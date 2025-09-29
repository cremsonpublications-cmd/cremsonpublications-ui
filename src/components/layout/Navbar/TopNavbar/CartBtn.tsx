"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { Link } from "react-router-dom";
import React from "react";

const CartBtn = () => {
  const { cart } = useAppSelector((state: RootState) => state.carts);

  return (
    <Link to="/cart" className="relative mr-[14px] p-1">
      <img src="/icons/cart.svg" alt="" className="max-w-[22px] max-h-[22px]" />
      {cart && cart.totalQuantities > 0 && (
        <span className="border bg-black text-white rounded-full w-fit-h-fit px-1 text-xs absolute -top-3 left-1/2 -translate-x-1/2">
          {cart.totalQuantities}
        </span>
      )}
    </Link>
  );
};

export default CartBtn;
