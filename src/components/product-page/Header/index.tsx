import React, { useState, useEffect } from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import ColorSelection from "./ColorSelection";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";
import { useCart } from "../../../context/CartContext";
import { useGlobalSettings } from "../../../context/GlobalSettingsContext";
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
  RotateCcw,
} from "lucide-react";

const Header = ({ data }: { data: Product }) => {
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [viewingCount, setViewingCount] = useState(Math.floor(Math.random() * 20) + 1);
  const { addToCart } = useCart();
  const { getDeliveryInfo, getReturnsInfo, formatText } = useGlobalSettings();

  // Update viewing count every 4 seconds with gradual change
  useEffect(() => {
    const interval = setInterval(() => {
      setViewingCount(prevCount => {
        // Random change between -3 to +3
        const change = Math.floor(Math.random() * 7) - 3; // -3, -2, -1, 0, 1, 2, 3
        let newCount = prevCount + change;

        // Keep within bounds 1-20
        if (newCount < 1) newCount = 1;
        if (newCount > 20) newCount = 20;

        return newCount;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showDeliveryModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDeliveryModal]);

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
  const hasMRP = data.mrp && data.mrp > 0;

  // Get current page URL for sharing
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const productTitle = encodeURIComponent(data.name);
  const productDescription = encodeURIComponent(data.short_description || "");

  // Share handlers
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${productTitle}&url=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${productTitle}%20${encodeURIComponent(
      currentUrl
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out: ${data.name}`);
    const body = encodeURIComponent(
      `I thought you might be interested in this product:\n\n${data.name}\n${currentUrl}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    // You can add a toast notification here if you have toast setup
    alert("Link copied to clipboard!");
  };

  // Function to get bulk price based on quantity
  const getBulkPrice = (quantity: number) => {
    if (!data.bulk_pricing || data.bulk_pricing.length === 0) {
      return finalPrice;
    }

    // Sort bulk pricing by quantity (ascending)
    const sortedBulkPricing = [...data.bulk_pricing].sort((a, b) => a.quantity - b.quantity);

    // Find the highest tier that the quantity qualifies for
    let applicablePrice = finalPrice;
    for (const bulk of sortedBulkPricing) {
      if (quantity >= bulk.quantity) {
        applicablePrice = bulk.price;
      }
    }

    return applicablePrice;
  };

  const handleBulkPurchase = (quantity: number, price: number) => {
    if (isOutOfStock) {
      alert("This product is currently out of stock.");
      return;
    }

    const productForCart = {
      id: data.id,
      name: data.name,
      price: price,
      main_image: data.main_image,
      author: data.author,
      isbn: data.isbn,
      status: data.status,
      bulk_pricing: data.bulk_pricing, // Include bulk pricing data
      mrp: data.mrp,
      finalPrice: finalPrice
    };

    addToCart(productForCart, quantity);
  };

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
              {data.categories?.main_category_name && (
                <span>Category: {data.categories.main_category_name}</span>
              )}
            </div>
          </div>

          {/* Rating & Reviews - Always show for debugging */}
          {true && (
            <div className="flex items-end mb-4">
              <Rating
                initialValue={data.rating > 0 ? data.rating : 0}
                allowFraction
                SVGclassName="inline-block"
                emptyClassName="fill-gray-50"
                size={19}
                readonly
              />
              <span className="text-black text-xs ml-[11px] pb-0.5">
                {data.rating > 0 ? data.rating.toFixed(1) : "0.0"}
                <span className="text-black/60">/5</span>
                {data.review_count && data.review_count > 0 && (
                  <span className="text-black/60 ml-1">({data.review_count} review{data.review_count !== 1 ? 's' : ''})</span>
                )}
              </span>
            </div>
          )}

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

          {hasMRP && (
            <div className="flex items-center space-x-2.5 sm:space-x-3 mb-5">
              <span className="font-bold text-black text-2xl sm:text-[32px]">
                ₹{finalPrice}
              </span>
              {hasDiscount && (
                <>
                  <span className="font-bold text-black/40 line-through text-2xl sm:text-[32px]">
                    ₹{mrp}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-green-100 text-green-800">
                      -{discountPercentage}%
                    </span>
                  )}
                </>
              )}
            </div>
          )}

          {!hasMRP && (
            <div className="mb-5">
              <p className="text-gray-600 text-lg">
                Pricing information not available
              </p>
            </div>
          )}

          {data.short_description && (
            <p className="text-sm sm:text-base text-black/60 mb-5">
              {data.short_description}
            </p>
          )}

          {/* Bulk Pricing */}
          {hasMRP && data.bulk_pricing && data.bulk_pricing.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">
                  Bulk Savings
                </h3>
                <span className="text-sm text-gray-500">
                  (Buy more save more)
                </span>
              </div>
              <div className="flex gap-2 justify-start">
                {data.bulk_pricing.map((bulk: any, index: number) => (
                  <div
                    key={index}
                    onClick={isOutOfStock ? undefined : () => handleBulkPurchase(bulk.quantity, bulk.price)}
                    className={`border rounded-md p-2 text-center transition-all duration-200 ${
                      isOutOfStock
                        ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                        : "border-blue-200 bg-blue-50 hover:bg-blue-200 hover:shadow-md cursor-pointer"
                    }`}
                    style={{ width: "150px" }}
                  >
                    <div className={`text-xs font-medium mb-0.5 ${
                      isOutOfStock ? "text-gray-500" : "text-gray-700"
                    }`}>
                      BUY {bulk.quantity}
                      {bulk.quantity ===
                      data.bulk_pricing[data.bulk_pricing.length - 1].quantity
                        ? "+"
                        : ""}
                    </div>
                    <div className={`text-sm font-bold mb-1 ${
                      isOutOfStock ? "text-gray-600" : "text-gray-900"
                    }`}>
                      ₹{bulk.price}.00 each
                    </div>
                    {bulk.price < finalPrice && (
                      <div className={`text-sm font-bold ${
                        isOutOfStock ? "text-gray-500" : "text-green-600"
                      }`}>
                        Save ₹{(finalPrice - bulk.price) * bulk.quantity}
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
                {viewingCount} people are viewing this right now
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-4">
              <Share2 className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Share</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTwitterShare}
                  className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors"
                  title="Share on Twitter"
                >
                  <Twitter className="w-5 h-5 text-gray-600 hover:text-blue-500" />
                </button>
                <button
                  onClick={handleFacebookShare}
                  className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors"
                  title="Share on Facebook"
                >
                  <Facebook className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                </button>
                <button
                  onClick={handleWhatsAppShare}
                  className="p-2 rounded-full bg-gray-100 hover:bg-green-100 transition-colors"
                  title="Share on WhatsApp"
                >
                  <svg
                    className="w-5 h-5 text-gray-600 hover:text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                  </svg>
                </button>
                <button
                  onClick={handleEmailShare}
                  className="p-2 rounded-full bg-gray-100 hover:bg-red-100 transition-colors"
                  title="Share via Email"
                >
                  <Mail className="w-5 h-5 text-gray-600 hover:text-red-600" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors"
                  title="Copy Link"
                >
                  <Share2 className="w-5 h-5 text-gray-600 hover:text-purple-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Description Section */}
      {data.description && (
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
          <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {data.description}
          </div>
        </div>
      )}

      {/* Tags Section */}
      {data.tags && data.tags.length > 0 && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Delivery & Return Modal */}
      {showDeliveryModal && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center z-[200] p-4"
          onClick={() => setShowDeliveryModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
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
            <div className="p-6 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-gray-600" />
                  Delivery Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-gray-700 text-sm leading-relaxed">
                    {formatText(getDeliveryInfo(data.delivery_information))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <RotateCcw className="w-5 h-5 mr-2 text-gray-600" />
                  Returns & Exchanges
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-gray-700 text-sm leading-relaxed">
                    {formatText(getReturnsInfo(data.returns_information))}
                  </div>
                </div>
              </div>
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
