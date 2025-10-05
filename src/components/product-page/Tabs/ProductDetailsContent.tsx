import React from "react";
import ProductDetails from "./ProductDetails";

const ProductDetailsContent = ({ productData }: { productData: any }) => {
  return (
    <section>
      <h3 className="text-xl sm:text-2xl font-bold text-black mb-5 sm:mb-6">
        Book Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-700">Author:</span>
            <span className="ml-2">{productData?.author || 'N/A'}</span>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-700">ISBN:</span>
            <span className="ml-2">{productData?.isbn || 'N/A'}</span>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-700">Edition:</span>
            <span className="ml-2">{productData?.edition || 'N/A'}</span>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-700">Class/Grade:</span>
            <span className="ml-2">{productData?.classes || 'N/A'}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-700">Category:</span>
            <span className="ml-2">{productData?.categories?.name || 'N/A'}</span>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-700">Status:</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              productData?.status === 'In Stock'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {productData?.status || 'N/A'}
            </span>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-700">Year:</span>
            <span className="ml-2">{productData?.year || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      {productData?.delivery_info && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Delivery Information</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-line">{productData.delivery_info}</p>
          </div>
        </div>
      )}

      {/* Returns Info */}
      {productData?.returns_info && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Returns & Exchanges</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-line">{productData.returns_info}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetailsContent;
