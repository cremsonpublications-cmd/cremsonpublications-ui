import React, { useState } from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import ColorSelection from "./ColorSelection";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";
import {
  Truck,
  HelpCircle,
  Smile,
  Share2,
  X,
  Twitter,
  Facebook,
  MessageCircle,
  Mail,
  Camera,
} from "lucide-react";

const Header = ({ data }: { data: Product }) => {
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <PhotoSection data={data} />
        </div>
        <div>
          <h1
            className={cn([
              integralCF.className,
              "text-2xl md:text-[40px] md:leading-[40px] mb-3 md:mb-3.5 capitalize",
            ])}
          >
            {data.name}
          </h1>

          {/* Author and Book Details */}
          <div className="mb-4">
            {data.author && (
              <p className="text-lg font-medium text-gray-700 mb-1">
                by {data.author}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {data.isbn && <span>ISBN: {data.isbn}</span>}
              {data.edition && <span>Edition: {data.edition}</span>}
              {data.classes && <span>Class: {data.classes}</span>}
              {data.categories?.name && (
                <span>Category: {data.categories.name}</span>
              )}
            </div>
          </div>

          <div className="flex items-center mb-3 sm:mb-3.5">
            <Rating
              initialValue={data.rating && data.rating > 0 ? data.rating : 4.5}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-50"
              size={25}
              readonly
            />
            <span className="text-black text-xs sm:text-sm ml-[11px] sm:ml-[13px] pb-0.5 sm:pb-0">
              {data.rating && data.rating > 0 ? data.rating.toFixed(1) : "4.5"}
              <span className="text-black/60">/5</span>
            </span>
          </div>

          {/* Status Badge */}
          <div className="mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                data.status === "In Stock"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {data.status}
            </span>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3 mb-5">
            <span className="font-bold text-black text-2xl sm:text-[32px]">
              ₹{data.price}
            </span>
            {data.old_price && (
              <>
                <span className="font-bold text-black/40 line-through text-2xl sm:text-[32px]">
                  ₹{data.old_price}
                </span>
                <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-green-100 text-green-800">
                  -
                  {Math.round(
                    ((data.old_price - data.price) / data.old_price) * 100
                  )}
                  %
                </span>
              </>
            )}
          </div>

          <p className="text-sm sm:text-base text-black/60 mb-5">
            {data.description ||
              "High-quality educational book designed for students and educators. Perfect for comprehensive learning and reference."}
          </p>

          {/* Bulk Pricing */}
          {data.bulk_pricing && data.bulk_pricing.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">Bulk Savings</h3>
                <span className="text-sm text-gray-500">(Buy more save more)</span>
              </div>
              <div className="flex gap-2 justify-start">
                {data.bulk_pricing.map((bulk: any, index: number) => (
                  <div
                    key={index}
                    className="border border-blue-200 rounded-md p-2 text-center bg-blue-50 hover:bg-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                    style={{width: '150px'}}
                  >
                    <div className="text-xs font-medium text-gray-700 mb-0.5">
                      BUY {bulk.quantity}{bulk.quantity === data.bulk_pricing[data.bulk_pricing.length - 1].quantity ? '+' : ''}
                    </div>
                    <div className="text-sm font-bold text-gray-900 mb-1">
                      ₹{bulk.price}.00 each
                    </div>
                    {bulk.price < data.price && (
                      <div className="text-sm font-bold text-green-600">
                        Save ₹{data.price - bulk.price}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr className="h-[1px] border-t-black/10 mb-5" />
          <AddToCardSection data={data} />

          {/* Additional Action Buttons */}
          <div className="mt-8 space-y-4">
            {/* Delivery & Return and Ask a Question */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowDeliveryModal(true)}
                className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors"
              >
                <Truck className="w-6 h-6" />
                <span className="text-base font-medium">Delivery & Return</span>
              </button>
              <button
                onClick={() => setShowQuestionModal(true)}
                className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors"
              >
                <HelpCircle className="w-6 h-6" />
                <span className="text-base font-medium">Ask a Question</span>
              </button>
            </div>

            {/* Viewing Count */}
            <div className="flex items-center gap-2 text-gray-600">
              <Smile className="w-5 h-5" />
              <span className="text-sm">
                16 people are viewing this right now
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-4">
              <Share2 className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Share</span>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Twitter">
                  <Twitter className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Facebook">
                  <Facebook className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Instagram">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C8.396 0 7.989.013 7.041.072 6.094.131 5.44.326 4.865.619c-.595.319-1.1.74-1.6 1.24S2.145 2.79 1.826 3.385C1.533 3.96 1.338 4.614 1.279 5.561.013 6.509 0 6.916 0 12.017s.013 5.508.072 6.456c.059.947.254 1.601.547 2.176.319.595.74 1.1 1.24 1.6s1.005.921 1.6 1.24c.575.293 1.229.488 2.176.547.948.059 1.355.072 6.456.072s5.508-.013 6.456-.072c.947-.059 1.601-.254 2.176-.547.595-.319 1.1-.74 1.6-1.24s.921-1.005 1.24-1.6c.293-.575.488-1.229.547-2.176.059-.948.072-1.355.072-6.456s-.013-5.508-.072-6.456c-.059-.947-.254-1.601-.547-2.176a4.294 4.294 0 00-1.24-1.6 4.294 4.294 0 00-1.6-1.24c-.575-.293-1.229-.488-2.176-.547C17.525.013 17.118 0 12.017 0zM12.017 2.162c4.015 0 4.49.016 6.075.071.923.042 1.425.196 1.76.326.442.172.758.378 1.089.709.331.331.537.647.709 1.089.13.335.284.837.326 1.76.055 1.585.071 2.06.071 6.075s-.016 4.49-.071 6.075c-.042.923-.196 1.425-.326 1.76a2.932 2.932 0 01-.709 1.089 2.932 2.932 0 01-1.089.709c-.335.13-.837.284-1.76.326-1.585.055-2.06.071-6.075.071s-4.49-.016-6.075-.071c-.923-.042-1.425-.196-1.76-.326a2.932 2.932 0 01-1.089-.709 2.932 2.932 0 01-.709-1.089c-.13-.335-.284-.837-.326-1.76-.055-1.585-.071-2.06-.071-6.075s.016-4.49.071-6.075c.042-.923.196-1.425.326-1.76.172-.442.378-.758.709-1.089a2.932 2.932 0 011.089-.709c.335-.13.837-.284 1.76-.326 1.585-.055 2.06-.071 6.075-.071z"/>
                    <path d="M12.017 5.838a6.179 6.179 0 100 12.358 6.179 6.179 0 000-12.358zM12.017 16a4 4 0 110-8 4 4 0 010 8z"/>
                    <path d="M19.846 5.594a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                  </svg>
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="WhatsApp">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                  </svg>
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Gmail">
                  <Mail className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery & Return Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                Delivery & Return Information
              </h2>
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {data.delivery_info && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Delivery Information
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm whitespace-pre-line">
                      {data.delivery_info}
                    </p>
                  </div>
                </div>
              )}
              {data.returns_info && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Returns & Exchanges
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 text-sm whitespace-pre-line">
                      {data.returns_info}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ask a Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Ask a Question</h2>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Question
                  </label>
                  <textarea
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ask your question about this product..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Submit Question
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
