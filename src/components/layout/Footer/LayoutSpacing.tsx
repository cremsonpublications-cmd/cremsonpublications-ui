import { useLocation } from "react-router-dom";
import React from "react";

const LayoutSpacing = () => {
  const location = useLocation();
  const pathname = location.pathname;

  if (!pathname.includes("product")) return;

  return <div className="mb-20 md:mb-0" />;
};

export default LayoutSpacing;
