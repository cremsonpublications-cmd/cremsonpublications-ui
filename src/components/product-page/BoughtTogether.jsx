import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";

const BoughtTogether = ({ currentProduct }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();
  const { products } = useProducts();

  useEffect(() => {
    if (currentProduct && products.length > 0) {
      // Find products with same class or subcategories, excluding sold out products
      const related = products
        .filter((product) => {
          if (product.id === currentProduct.id) return false;

          // Exclude sold out products
          if (product.status === "Out of Stock") return false;

          // Check if same class
          const sameClass =
            currentProduct.classes &&
            product.classes &&
            currentProduct.classes === product.classes;

          // Check if same subcategories
          const sameSubCategory =
            currentProduct.sub_categories &&
            product.sub_categories &&
            currentProduct.sub_categories.some((subCat) =>
              product.sub_categories.includes(subCat)
            );

          return sameClass || sameSubCategory;
        })
        .slice(0, 3); // Limit to 3 related products

      setRelatedProducts(related);

      // Pre-select current product and first related product
      if (related.length > 0) {
        setSelectedProducts([currentProduct, related[0]]);
      } else {
        setSelectedProducts([currentProduct]);
      }
    }
  }, [currentProduct, products]);

  const calculatePrice = (product) => {
    const mrp = product.mrp || 0;
    let finalPrice = mrp;

    // Check if product has its own discount
    if (product.has_own_discount && product.own_discount_percentage) {
      finalPrice = mrp - (mrp * product.own_discount_percentage) / 100;
    }
    // Otherwise use category discount if enabled
    else if (product.use_category_discount && product.categories) {
      const category = product.categories;
      if (category.offer_type === "percentage" && category.offer_percentage) {
        finalPrice = mrp - (mrp * category.offer_percentage) / 100;
      } else if (
        category.offer_type === "flat_amount" &&
        category.offer_amount
      ) {
        finalPrice = mrp - category.offer_amount;
      }
    }

    return Math.round(finalPrice);
  };

  const toggleProductSelection = (product) => {
    if (product.id === currentProduct.id) return; // Can't deselect current product

    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const getTotalPrice = () => {
    return selectedProducts.reduce((total, product) => {
      return total + calculatePrice(product);
    }, 0);
  };

  const handleAddAllToCart = () => {
    selectedProducts.forEach((product) => {
      const productForCart = {
        id: product.id,
        name: product.name,
        price: calculatePrice(product),
        main_image: product.main_image,
        author: product.author,
        isbn: product.isbn,
        status: product.status,
      };
      addToCart(productForCart, 1);
    });
  };

  // Don't show "Bought Together" if current product is out of stock
  if (currentProduct?.status === "Out of Stock") return null;

  if (relatedProducts.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 mb-8">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">Bought Together</h2>

      {/* Products Visual Row */}
      <div className="flex items-center justify-start sm:justify-center gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8 p-3 sm:p-4 lg:p-6 bg-gray-50 rounded-xl overflow-x-auto">
        {/* Current Product */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="relative group">
            <div className="w-24 h-32 sm:w-28 sm:h-36 lg:w-32 lg:h-40 bg-white rounded-lg shadow-md overflow-hidden border-2 border-green-500">
              <img
                src={currentProduct.main_image}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-center max-w-[100px] sm:max-w-[120px] lg:max-w-[140px]">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
              {currentProduct.name}
            </p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-green-600 mt-1">
              ₹{calculatePrice(currentProduct)}
            </p>
          </div>
        </div>

        {/* Plus Icon */}
        <div className="flex-shrink-0 bg-white rounded-full p-2 sm:p-3 shadow-sm border border-gray-200">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
        </div>

        {/* Related Products */}
        {relatedProducts.map((product, index) => {
          const isSelected = selectedProducts.some((p) => p.id === product.id);

          return (
            <React.Fragment key={product.id}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => toggleProductSelection(product)}
                >
                  <div
                    className={`w-24 h-32 sm:w-28 sm:h-36 lg:w-32 lg:h-40 bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-blue-500 ring-2 sm:ring-4 ring-blue-100 transform scale-105"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-lg"
                    }`}
                  >
                    <img
                      src={product.main_image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`absolute -top-2 -right-2 rounded-full p-1 transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-600 group-hover:bg-blue-400 group-hover:text-white"
                    }`}
                  >
                    {isSelected ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 text-center max-w-[100px] sm:max-w-[120px] lg:max-w-[140px]">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                    {product.name}
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600 mt-1">
                    ₹{calculatePrice(product)}
                  </p>
                </div>
              </div>

              {index < relatedProducts.length - 1 && (
                <div className="flex-shrink-0 bg-white rounded-full p-2 sm:p-3 shadow-sm border border-gray-200">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Products Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Selected Items:
        </h3>
        <div className="space-y-3">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className={`flex items-center justify-between bg-white rounded-lg p-4 shadow-sm ${
                product.id === currentProduct.id
                  ? 'animate-pulse border-2 border-green-300'
                  : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    product.id === currentProduct.id
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {product.author && (
                      <span className="text-sm text-gray-500">
                        by {product.author}
                      </span>
                    )}
                    {product.classes && (
                      <span className="text-sm text-blue-600 font-medium">
                        Class {product.classes}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  ₹{calculatePrice(product)}
                </p>
                {product.id !== currentProduct.id && (
                  <button
                    onClick={() => toggleProductSelection(product)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 mt-1"
                    title="Remove from selection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total and Add to Cart */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-gray-100">
        <div className="text-center sm:text-left">
          <p className="text-2xl font-bold text-gray-900">
            Total Price:{" "}
            <span className="text-blue-600">
              ₹{getTotalPrice().toLocaleString()}
            </span>
          </p>
        </div>
        <button
          onClick={handleAddAllToCart}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          ADD ALL TO CART
        </button>
      </div>
    </div>
  );
};

export default BoughtTogether;
