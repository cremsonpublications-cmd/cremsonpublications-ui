import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Bot,
  User,
  Book,
  ArrowRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  ShoppingCart,
  Minus,
  Plus,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCoupons } from "../../context/CouponContext";
import { useUser } from "../../context/AuthContext";

const ProductCard = ({ product }) => (
  <Link
    to={`/shop/product/${product.id}`}
    className="block bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-3 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group"
  >
    <div className="flex gap-3">
      <div className="relative">
        <img
          src={product.main_image}
          alt={product.name}
          className="w-16 h-16 object-contain bg-white rounded-lg border border-gray-100 group-hover:scale-105 transition-transform"
        />
        <div className="absolute -top-1 -right-1">
          <Book size={12} className="text-blue-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-700 transition-colors">
          {product.name}
        </h4>
        <div className="flex flex-wrap gap-1 mb-2">
          {product.classes && product.classes.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Class {product.classes.join(", ")}
            </span>
          )}
          {product.sub_categories && product.sub_categories.length > 0 && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {product.sub_categories[0]}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600 mb-2">
          {product.author && `By ${product.author}`}
          {product.edition && ` • Edition: ${product.edition}`}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-blue-600 text-sm">
              ₹{product.mrp}
            </span>
            {product.rating > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-yellow-600">
                  ⭐ {product.rating}
                </span>
                {product.review_count > 0 && (
                  <span className="text-xs text-gray-500">
                    ({product.review_count})
                  </span>
                )}
              </div>
            )}
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              product.status === "In Stock"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.status}
          </span>
        </div>
        {product.weight && (
          <p className="text-xs text-gray-500 mt-1">📦 {product.weight}</p>
        )}
      </div>
    </div>
  </Link>
);

// Wishlist Item Card Component for displaying wishlist items
const WishlistItemCard = ({ item, onRemove }) => {
  return (
    <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-3 hover:shadow-lg hover:border-pink-200 transition-all duration-200 group">
      <div className="flex gap-3">
        <div className="relative">
          <img
            src={item.main_image}
            alt={item.name}
            className="w-14 h-14 object-contain bg-white rounded-lg border border-gray-100 group-hover:scale-105 transition-transform"
          />
          <div className="absolute -top-1 -right-1">
            <Heart size={12} className="text-pink-600 fill-current" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-pink-700 transition-colors">
            {item.name}
          </h4>
          <div className="flex flex-wrap gap-1 mb-2">
            {item.classes && item.classes.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Class {item.classes.join(", ")}
              </span>
            )}
            {item.sub_categories && item.sub_categories.length > 0 && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {item.sub_categories[0]}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-pink-600 text-sm">
                ₹{item.mrp || item.price}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  item.status === "In Stock"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.status}
              </span>
            </div>

            <button
              onClick={() => onRemove && onRemove(item.id)}
              className="ml-2 px-3 py-1.5 rounded-lg font-medium transition-all text-sm bg-pink-600 hover:bg-pink-700 text-white"
            >
              <div className="flex items-center gap-1">
                <X size={12} />
                <span className="hidden sm:inline">Remove</span>
              </div>
            </button>
          </div>

          {item.author && (
            <p className="text-xs text-gray-600 mt-1">By {item.author}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Cart Item Card Component for displaying cart items
const CartItemCard = ({ item, onUpdateQuantity }) => {
  return (
    <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-3 hover:shadow-lg hover:border-orange-200 transition-all duration-200 group">
      <div className="flex gap-3">
        <div className="relative">
          <img
            src={item.main_image}
            alt={item.name}
            className="w-14 h-14 object-contain bg-white rounded-lg border border-gray-100 group-hover:scale-105 transition-transform"
          />
          <div className="absolute -top-1 -right-1">
            <ShoppingCart size={12} className="text-orange-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-orange-700 transition-colors">
            {item.name}
          </h4>
          <div className="flex flex-wrap gap-1 mb-2">
            {item.classes && item.classes.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Class {item.classes.join(", ")}
              </span>
            )}
            {item.sub_categories && item.sub_categories.length > 0 && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {item.sub_categories[0]}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-orange-600 text-sm">
                ₹{item.price} × {item.quantity}
              </span>
              <span className="text-xs font-semibold text-gray-700">
                Total: ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onUpdateQuantity &&
                  onUpdateQuantity(item.id, item.quantity - 1)
                }
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-orange-200 flex items-center justify-center text-gray-600 hover:text-orange-700 transition-colors"
                disabled={item.quantity <= 1}
              >
                <Minus size={12} />
              </button>
              <span className="text-sm font-medium min-w-[20px] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  onUpdateQuantity &&
                  onUpdateQuantity(item.id, item.quantity + 1)
                }
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-orange-200 flex items-center justify-center text-gray-600 hover:text-orange-700 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {item.author && (
            <p className="text-xs text-gray-600 mt-1">By {item.author}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Order Card Component for displaying order information
const OrderCard = ({ order }) => {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "processing":
        return <Clock size={16} className="text-blue-600" />;
      case "shipped":
        return <Truck size={16} className="text-purple-600" />;
      case "delivered":
        return <CheckCircle size={16} className="text-green-700" />;
      default:
        return <Package size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-blue-600 bg-blue-100";
      case "shipped":
        return "text-purple-600 bg-purple-100";
      case "delivered":
        return "text-green-700 bg-green-200";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Link
      to="/my-orders"
      className="block bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
            Order #{order.order_id || order.id}
          </p>
          <p className="text-sm text-gray-600">
            {new Date(order.order_date).toLocaleDateString("en-IN")}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            order.delivery?.status || order.order_status
          )}`}
        >
          {getStatusIcon(order.delivery?.status || order.order_status)}
          {order.delivery?.status || order.order_status || "Processing"}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Amount:</span>
          <span className="font-semibold text-blue-600">
            ₹{order.order_summary?.grandTotal || order.total_amount || 0}
          </span>
        </div>

        {order.order_summary?.items && (
          <div className="text-sm text-gray-600">
            {order.order_summary.items.length} item
            {order.order_summary.items.length > 1 ? "s" : ""}
          </div>
        )}

        {order.delivery?.tracking_id && (
          <div className="text-xs text-gray-500">
            Tracking: {order.delivery.tracking_id}
          </div>
        )}
      </div>
    </Link>
  );
};

const Chatbot = ({ isOpen, onClose }) => {
  const { products } = useProducts(); // Get dynamic product data
  const { user: clerkUser } = useUser(); // Clerk auth
  const {
    orders,
    loading: ordersLoading,
    fetchUserOrders,
    hasOrdersLoaded,
  } = useOrders();
  const { selectedCoupons, loading: couponsLoading } = useCoupons();
  const {
    cartItems,
    getTotalItems,
    getTotalPrice,
    updateQuantity,
    removeFromCart,
    addToCart,
    clearCart,
    appliedCoupon,
    getFinalTotal,
  } = useCart();
  const {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    getWishlistCount,
    isInWishlist,
  } = useWishlist();

  const [messages, setMessages] = useState([]);

  // Prevent body scroll when chatbot is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Initialize greeting when products load
  useEffect(() => {
    if (products.length > 0 && messages.length === 0) {
      const now = new Date();
      const hour = now.getHours();
      let greeting = "Good morning";

      if (hour >= 12 && hour < 17) greeting = "Good afternoon";
      else if (hour >= 17) greeting = "Good evening";

      // Get dynamic data from API
      const availableClasses = [
        ...new Set(products.flatMap((p) => p.classes || [])),
      ].sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        return numA - numB;
      });

      const inStockCount = products.filter(
        (p) => p.status === "In Stock"
      ).length;
      const soldOutCount = products.filter(
        (p) => p.status === "Out of Stock"
      ).length;

      // Get available categories from actual data
      const availableCategories = [
        ...new Set(
          products
            .map((p) => p.categories?.main_category_name || p.category)
            .filter(Boolean)
        ),
      ].slice(0, 2); // Show top 2 categories

      // Format classes text
      let classesText = "Various classes";
      if (availableClasses.length > 0) {
        const displayClasses = availableClasses.slice(0, 4);
        classesText = displayClasses.map((cls) => `Class ${cls}`).join(", ");
        if (availableClasses.length > 4) {
          classesText += ` and ${availableClasses.length - 4} more`;
        }
      }

      // Format categories text
      let categoriesText = "available categories";
      if (availableCategories.length > 0) {
        categoriesText = availableCategories
          .map((cat) => `"${cat} books"`)
          .join(" or ");
      }

      const initialGreeting = `${greeting}! 😊 I'm your AI Book Assistant. I can help you find books by:\n\n1️⃣ **Price** - "low price",  or amount "₹278"\n2️⃣ **Availability** - "${inStockCount} in stock" or "${soldOutCount} sold out"\n3️⃣ **Class** - ${classesText}\n4️⃣ **Author** - "by author name"\n5️⃣ **Category** - ${categoriesText}\n6️⃣ **ISBN** - "9789394691957"\n\nWhat would you like to explore today?`;

      setMessages([
        {
          id: 1,
          type: "bot",
          text: initialGreeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [products, messages.length]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getTimeBasedGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const generateContextualResponse = (query, foundProducts) => {
    const queryLower = query.toLowerCase();
    const productCount = foundProducts.length;

    // Analyze the found products to provide contextual information
    const classes = [...new Set(foundProducts.flatMap((p) => p.classes || []))];
    const subjects = [
      ...new Set(foundProducts.flatMap((p) => p.sub_categories || [])),
    ];
    const authors = [
      ...new Set(foundProducts.map((p) => p.author).filter(Boolean)),
    ];
    const inStockCount = foundProducts.filter(
      (p) => p.status === "In Stock"
    ).length;
    const priceRange = {
      min: Math.min(...foundProducts.map((p) => p.mrp)),
      max: Math.max(...foundProducts.map((p) => p.mrp)),
    };

    let responseText = `📖 I found ${productCount} book${
      productCount > 1 ? "s" : ""
    } matching your search:`;

    // Add contextual information based on query and results
    if (queryLower.includes("lab manual")) {
      responseText = `🔬 Found ${productCount} Lab Manual${
        productCount > 1 ? "s" : ""
      } with comprehensive worksheets and practical exercises:`;
    } else if (queryLower.includes("made easy")) {
      responseText = `✨ Found ${productCount} "Made Easy" book${
        productCount > 1 ? "s" : ""
      } - simplified learning with practical examples:`;
    } else if (queryLower.includes("sample paper")) {
      responseText = `📝 Found ${productCount} Sample Paper${
        productCount > 1 ? "s" : ""
      } for exam preparation:`;
    } else if (queryLower.includes("worksheet")) {
      responseText = `📋 Found ${productCount} book${
        productCount > 1 ? "s" : ""
      } with worksheets for practice:`;
    } else if (classes.length > 0 && queryLower.match(/\d+/)) {
      const classText = classes.map((c) => `Class ${c}`).join(", ");
      responseText = `🎓 Found ${productCount} book${
        productCount > 1 ? "s" : ""
      } for ${classText}:`;
    } else if (subjects.length > 0) {
      responseText = `📚 Found ${productCount} ${subjects
        .slice(0, 2)
        .join(" & ")} book${productCount > 1 ? "s" : ""}:`;
    }

    // Add helpful context about the results
    const contextInfo = [];

    if (inStockCount > 0 && inStockCount < productCount) {
      contextInfo.push(`✅ ${inStockCount} available for immediate delivery`);
    } else if (inStockCount === productCount) {
      contextInfo.push("✅ All books in stock");
    }

    if (priceRange.min !== priceRange.max) {
      contextInfo.push(
        `💰 Price range: ₹${priceRange.min} - ₹${priceRange.max}`
      );
    } else {
      contextInfo.push(`💰 Price: ₹${priceRange.min}`);
    }

    if (authors.length > 0 && authors.length <= 3) {
      contextInfo.push(`✍️ By ${authors.join(", ")}`);
    }

    if (contextInfo.length > 0) {
      responseText += `\n\n${contextInfo.join(" • ")}`;
    }

    return responseText;
  };

  const generateSmartRecommendations = (query) => {
    const queryLower = query.toLowerCase();

    // Class-based recommendations
    const classMatch = queryLower.match(/(\d+)(?:th|st|nd|rd)?/);
    if (classMatch) {
      const classNum = classMatch[1];
      const classBooks = products.filter(
        (p) =>
          p.classes && p.classes.includes(classNum) && p.status === "In Stock"
      );

      if (classBooks.length > 0) {
        // Recommend different types of books for the class
        const labManuals = classBooks.filter((p) =>
          p.name.toLowerCase().includes("lab manual")
        );
        const madeEasy = classBooks.filter((p) =>
          p.name.toLowerCase().includes("made easy")
        );
        const samplePapers = classBooks.filter((p) =>
          p.name.toLowerCase().includes("sample paper")
        );

        const recommendations = [];

        if (labManuals.length > 0) recommendations.push(labManuals[0]);
        if (madeEasy.length > 0) recommendations.push(madeEasy[0]);
        if (samplePapers.length > 0) recommendations.push(samplePapers[0]);

        // Fill remaining slots with top-rated books
        const remaining = classBooks
          .filter((p) => !recommendations.includes(p))
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 4 - recommendations.length);

        return [...recommendations, ...remaining];
      }
    }

    // Subject-based recommendations
    const subjects = [
      "physics",
      "chemistry",
      "mathematics",
      "biology",
      "science",
      "psychology",
      "sociology",
      "political",
      "economics",
      "business",
      "commerce",
      "marketing",
      "entrepreneurship",
    ];

    const matchedSubject = subjects.find((subject) =>
      queryLower.includes(subject)
    );
    if (matchedSubject) {
      return products
        .filter(
          (p) =>
            (p.sub_categories?.some((cat) =>
              cat.toLowerCase().includes(matchedSubject)
            ) ||
              p.name.toLowerCase().includes(matchedSubject)) &&
            p.status === "In Stock"
        )
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);
    }

    // General recommendations - top rated in-stock books
    if (queryLower.includes("best") || queryLower.includes("top")) {
      return products
        .filter(
          (p) =>
            p.status === "In Stock" && (p.rating >= 4.0 || p.review_count > 0)
        )
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);
    }

    // Default: popular in-stock books
    return products
      .filter((p) => p.status === "In Stock")
      .sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
      .slice(0, 4);
  };

  // Enhanced product search with better matching (updated for API structure)
  const enhancedSearchProducts = (query) => {
    const searchTerms = query.toLowerCase();

    return products.filter((product) => {
      const productName = product.name?.toLowerCase() || "";
      const authorName = product.author?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";
      const shortDescription = product.short_description?.toLowerCase() || "";
      const isbn = product.isbn?.toLowerCase() || "";

      // Enhanced matching patterns
      const searchWords = searchTerms
        .split(/\s+/)
        .filter((word) => word.length > 2);

      return (
        searchWords.some(
          (word) =>
            productName.includes(word) ||
            authorName.includes(word) ||
            description.includes(word) ||
            shortDescription.includes(word) ||
            isbn.includes(word) ||
            product.classes?.some((cls) => cls.toString().includes(word)) ||
            product.sub_categories?.some((cat) =>
              cat.toLowerCase().includes(word)
            ) ||
            product.categories?.main_category_name?.toLowerCase().includes(word)
        ) ||
        // Full phrase matching
        productName.includes(searchTerms) ||
        authorName.includes(searchTerms) ||
        description.includes(searchTerms) ||
        shortDescription.includes(searchTerms)
      );
    });
  };

  // Helper function to check if user is logged in
  const isUserLoggedIn = () => {
    return clerkUser && clerkUser.id;
  };

  // Helper function to get user email
  const getUserEmail = () => {
    return clerkUser?.primaryEmailAddress?.emailAddress;
  };

  // Helper function to get user name
  const getUserName = () => {
    return (
      clerkUser?.firstName ||
      clerkUser?.fullName ||
      getUserEmail()?.split("@")[0] ||
      "there"
    );
  };

  // Function to handle wishlist-related queries
  const handleWishlistQuery = (query) => {
    const totalWishlistItems = getWishlistCount();

    // Handle wishlist operations first

    // 1. Add to wishlist operations
    const addToWishlistPatterns = [
      /add\s+(.*?)\s+to\s+wishlist/i,
      /put\s+(.*?)\s+in\s+wishlist/i,
      /wishlist\s+add\s+(.*)/i,
      /add\s+(.*?)\s+to\s+favorites?/i,
      /save\s+(.*?)\s+for\s+later/i,
    ];

    for (const pattern of addToWishlistPatterns) {
      const match = query.match(pattern);
      if (match) {
        const searchTerm = match[1].trim();
        const foundBooks = enhancedSearchProducts(searchTerm);

        if (foundBooks.length > 0) {
          const bookToAdd = foundBooks[0]; // Take the first match

          if (isInWishlist(bookToAdd.id)) {
            return {
              text: `💝 **Already in Wishlist!**\n\n"${bookToAdd.name}" is already saved in your wishlist.\n\n💡 **Try saying:** "My wishlist" to see all saved items`,
              products: [bookToAdd],
              orders: [],
              cartItems: [],
              wishlistItems: [],
            };
          }

          addToWishlist(bookToAdd);

          return {
            text: `💝 **Added to Wishlist!**\n\n"${
              bookToAdd.name
            }" has been saved to your wishlist.\n\n❤️ **Wishlist Summary:**\n• Items: ${
              totalWishlistItems + 1
            }\n• Price: ₹${
              bookToAdd.mrp || bookToAdd.price
            }\n\n💡 **Try saying:** "My wishlist" to see all items`,
            products: [bookToAdd],
            orders: [],
            cartItems: [],
            wishlistItems: [],
          };
        } else {
          return {
            text: `❌ **Book Not Found**\n\nI couldn't find "${searchTerm}" in our collection.\n\n💡 **Try being more specific:**\n• "Add Class 12 Physics book to wishlist"\n• "Add Economics textbook to wishlist"\n• "Put NCERT Chemistry in wishlist"\n\n🔍 Search our collection first to see available books!`,
            products: [],
            orders: [],
            cartItems: [],
            wishlistItems: [],
          };
        }
      }
    }

    // 2. Remove from wishlist operations
    const removePatterns = [
      /remove\s+(.*?)\s+from\s+wishlist/i,
      /delete\s+(.*?)\s+from\s+wishlist/i,
      /wishlist\s+remove\s+(.*)/i,
      /take\s+out\s+(.*?)\s+from\s+wishlist/i,
      /remove\s+(.*?)\s+from\s+favorites?/i,
    ];

    for (const pattern of removePatterns) {
      const match = query.match(pattern);
      if (match) {
        const searchTerm = match[1].trim();
        const wishlistItem = wishlistItems.find(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.author?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (wishlistItem) {
          removeFromWishlist(wishlistItem.id);
          return {
            text: `🗑️ **Removed from Wishlist!**\n\n"${
              wishlistItem.name
            }" has been removed from your wishlist.\n\n💝 **Updated Wishlist:**\n• Items: ${
              totalWishlistItems - 1
            }`,
            products: [],
            orders: [],
            cartItems: [],
            wishlistItems: wishlistItems
              .filter((item) => item.id !== wishlistItem.id)
              .slice(0, 3),
          };
        } else {
          return {
            text: `❌ **Item Not Found in Wishlist**\n\nI couldn't find "${searchTerm}" in your wishlist.\n\n💡 **Try:** "My wishlist" to see all items first`,
            products: [],
            orders: [],
            cartItems: [],
            wishlistItems: wishlistItems.slice(0, 3),
          };
        }
      }
    }

    // 3. Clear entire wishlist
    if (
      query.includes("clear wishlist") ||
      query.includes("empty wishlist") ||
      query.includes("delete my wishlist")
    ) {
      if (totalWishlistItems > 0) {
        clearWishlist();
        return {
          text: `🗑️ **Wishlist Cleared!**\n\nAll items have been removed from your wishlist.\n\n💝 **Your wishlist is now empty.**\n\n📚 **Start Exploring:**\n• Browse our book collection\n• Search for specific subjects\n• Save books you like for later`,
          products: [],
          orders: [],
          cartItems: [],
          wishlistItems: [],
        };
      } else {
        return {
          text: `💝 **Wishlist Already Empty**\n\nYour wishlist is already empty.\n\n📚 **Start Exploring:**\n• Browse our book collection\n• Search for specific subjects\n• Save books to your wishlist`,
          products: [],
          orders: [],
          cartItems: [],
          wishlistItems: [],
        };
      }
    }

    // 4. Recent wishlist / last added
    if (
      query.includes("recent wishlist") ||
      query.includes("last added to wishlist") ||
      query.includes("newest in wishlist")
    ) {
      if (totalWishlistItems > 0) {
        const recentItem = wishlistItems[wishlistItems.length - 1]; // Last item (most recent)
        return {
          text: `🕒 **Most Recent Wishlist Item**\n\nYour latest addition to wishlist:`,
          products: [],
          orders: [],
          cartItems: [],
          wishlistItems: [recentItem],
        };
      } else {
        return {
          text: `💝 **No Recent Items**\n\nYour wishlist is empty.\n\n📚 **Start Exploring:** Add some books to see recent items!`,
          products: [],
          orders: [],
          cartItems: [],
          wishlistItems: [],
        };
      }
    }

    // Empty wishlist case (after all operations)
    if (totalWishlistItems === 0) {
      return {
        text: `💝 **Your Wishlist is Empty**\n\nYour wishlist is currently empty.\n\n📚 **Start Exploring:**\n• Browse our book collection\n• Search for specific subjects\n• Save books to your wishlist\n• Get personalized recommendations\n\n💡 **Try saying:** "Add Economics book to wishlist"`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    // Handle specific wishlist queries
    if (
      query.includes("wishlist item") ||
      query.includes("my wishlist") ||
      query.includes("wishlist")
    ) {
      return {
        text: `💝 **Your Wishlist Items**\n\nYou have ${totalWishlistItems} item${
          totalWishlistItems > 1 ? "s" : ""
        } in your wishlist:`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: wishlistItems,
      };
    }

    if (
      query.includes("wishlist low price") ||
      query.includes("cheapest in wishlist")
    ) {
      const sortedByPrice = [...wishlistItems].sort(
        (a, b) => (a.mrp || a.price || 0) - (b.mrp || b.price || 0)
      );
      return {
        text: `💰 **Lowest Priced Items in Wishlist**\n\nHere are your wishlist items sorted by price (lowest first):`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: sortedByPrice,
      };
    }

    if (
      query.includes("wishlist high price") ||
      query.includes("most expensive in wishlist")
    ) {
      const sortedByPrice = [...wishlistItems].sort((a, b) => {
        const priceA = parseFloat(a.finalPrice || a.mrp || a.price || 0);
        const priceB = parseFloat(b.finalPrice || b.mrp || b.price || 0);
        return priceB - priceA;
      });
      return {
        text: `💎 **Highest Priced Items in Wishlist**\n\nHere are your wishlist items sorted by price (highest first):`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: sortedByPrice,
      };
    }

    // Default wishlist response
    return {
      text: `💝 **Your Wishlist**\n\nYou have ${totalWishlistItems} saved item${
        totalWishlistItems > 1 ? "s" : ""
      }:`,
      products: [],
      orders: [],
      cartItems: [],
      wishlistItems: wishlistItems,
    };
  };

  // Function to handle cart-related queries
  const handleCartQuery = (query) => {
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const finalTotal = getFinalTotal();

    // Handle cart operations first

    // 1. Add to cart operations
    const addToCartPatterns = [
      /add\s+(.*?)\s+to\s+cart/i,
      /put\s+(.*?)\s+in\s+cart/i,
      /cart\s+add\s+(.*)/i,
      /add\s+(.*?)\s+book/i,
    ];

    for (const pattern of addToCartPatterns) {
      const match = query.match(pattern);
      if (match) {
        const searchTerm = match[1].trim();
        const foundBooks = enhancedSearchProducts(searchTerm);

        if (foundBooks.length > 0) {
          const bookToAdd = foundBooks[0]; // Take the first match
          addToCart(bookToAdd, 1, false); // Add 1 quantity, don't show popup

          // Get updated totals (approximate since state updates are async)
          const currentTotal = getTotalItems();
          const currentPrice = getFinalTotal();
          const bookPrice = bookToAdd.mrp || bookToAdd.price || 0;

          return {
            text: `✅ **Added to Cart!**\n\n"${
              bookToAdd.name
            }" has been added to your cart.\n\n🛒 **Cart Summary:**\n• Items: ${
              currentTotal + 1
            }\n• Total: ₹${(currentPrice + bookPrice).toFixed(
              2
            )}\n\n💡 **Try saying:** "My cart" to see all items`,
            products: [bookToAdd],
            orders: [],
            cartItems: [],
          };
        } else {
          return {
            text: `❌ **Book Not Found**\n\nI couldn't find "${searchTerm}" in our collection.\n\n💡 **Try being more specific:**\n• "Add Class 12 Physics book to cart"\n• "Add Economics textbook to cart"\n• "Put NCERT Chemistry in cart"\n\n🔍 Search our collection first to see available books!`,
            products: [],
            orders: [],
            cartItems: [],
          };
        }
      }
    }

    // 2. Remove from cart operations
    const removePatterns = [
      /remove\s+(.*?)\s+from\s+cart/i,
      /delete\s+(.*?)\s+from\s+cart/i,
      /cart\s+remove\s+(.*)/i,
      /take\s+out\s+(.*?)\s+from\s+cart/i,
    ];

    for (const pattern of removePatterns) {
      const match = query.match(pattern);
      if (match) {
        const searchTerm = match[1].trim();
        const cartItem = cartItems.find(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.author?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (cartItem) {
          removeFromCart(cartItem.id);
          return {
            text: `🗑️ **Removed from Cart!**\n\n"${
              cartItem.name
            }" has been removed from your cart.\n\n🛒 **Updated Cart:**\n• Items: ${
              getTotalItems() - cartItem.quantity
            }\n• Total: ₹${(
              getFinalTotal() -
              cartItem.price * cartItem.quantity
            ).toFixed(2)}`,
            products: [],
            orders: [],
            cartItems: cartItems
              .filter((item) => item.id !== cartItem.id)
              .slice(0, 3),
          };
        } else {
          return {
            text: `❌ **Item Not Found in Cart**\n\nI couldn't find "${searchTerm}" in your cart.\n\n💡 **Try:** "My cart" to see all items first`,
            products: [],
            orders: [],
            cartItems: cartItems.slice(0, 3),
          };
        }
      }
    }

    // 3. Clear entire cart
    if (
      query.includes("clear cart") ||
      query.includes("empty cart") ||
      query.includes("delete my cart") ||
      query.includes("remove my cart")
    ) {
      if (totalItems > 0) {
        clearCart();
        return {
          text: `🗑️ **Cart Cleared!**\n\nAll items have been removed from your cart.\n\n🛒 **Your cart is now empty.**\n\n📚 **Start Shopping Again:**\n• Browse our book collection\n• Search for specific subjects\n• Add new books to your cart`,
          products: [],
          orders: [],
          cartItems: [],
          wishlistItems: [],
        };
      } else {
        return {
          text: `🛒 **Cart Already Empty**\n\nYour cart is already empty.\n\n📚 **Start Shopping:**\n• Browse our book collection\n• Search for specific subjects\n• Add books to your cart`,
          products: [],
          orders: [],
          cartItems: [],
          wishlistItems: [],
        };
      }
    }

    // 4. Increase/Decrease quantity
    const quantityPatterns = [
      /increase\s+(.*?)\s+(?:quantity|amount)/i,
      /decrease\s+(.*?)\s+(?:quantity|amount)/i,
      /add\s+more\s+(.*)/i,
      /reduce\s+(.*?)\s+(?:quantity|amount)/i,
    ];

    for (const pattern of quantityPatterns) {
      const match = query.match(pattern);
      if (match) {
        const searchTerm = match[1].trim();
        const cartItem = cartItems.find(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.author?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (cartItem) {
          const isIncrease =
            query.includes("increase") || query.includes("add more");
          const newQuantity = isIncrease
            ? cartItem.quantity + 1
            : Math.max(1, cartItem.quantity - 1);
          updateQuantity(cartItem.id, newQuantity);

          return {
            text: `${isIncrease ? "⬆️" : "⬇️"} **Quantity ${
              isIncrease ? "Increased" : "Decreased"
            }!**\n\n"${cartItem.name}" quantity ${
              isIncrease ? "increased" : "decreased"
            } to ${newQuantity}.\n\n💰 **Updated Price:** ₹${(
              cartItem.price * newQuantity
            ).toFixed(2)}`,
            products: [],
            orders: [],
            cartItems: [{ ...cartItem, quantity: newQuantity }],
          };
        } else {
          return {
            text: `❌ **Item Not Found in Cart**\n\nI couldn't find "${searchTerm}" in your cart.\n\n💡 **Try:** "My cart" to see all items first`,
            products: [],
            orders: [],
            cartItems: cartItems.slice(0, 3),
          };
        }
      }
    }

    // 5. Recent cart / last added
    if (
      query.includes("recent cart") ||
      query.includes("last added") ||
      query.includes("newest in cart")
    ) {
      if (totalItems > 0) {
        const recentItem = cartItems[cartItems.length - 1]; // Last item (most recent)
        return {
          text: `🕒 **Most Recent Cart Item**\n\nYour latest addition to cart:`,
          products: [],
          orders: [],
          cartItems: [recentItem],
        };
      } else {
        return {
          text: `🛒 **No Recent Items**\n\nYour cart is empty.\n\n📚 **Start Shopping:** Add some books to see recent items!`,
          products: [],
          orders: [],
          cartItems: [],
          wishlistItems: [],
        };
      }
    }

    // Empty cart case (after all operations)
    if (totalItems === 0) {
      return {
        text: `🛒 **Your Cart is Empty**\n\nYour shopping cart is currently empty.\n\n📚 **Start Shopping:**\n• Browse our book collection\n• Search for specific subjects\n• Add books to your cart\n• Get personalized recommendations\n\n💡 **Try saying:** "Add Economics book to cart"`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    // Handle specific cart queries
    if (query.includes("cart item") || query.includes("my cart item")) {
      return {
        text: `🛒 **Your Cart Items**\n\nYou have ${totalItems} item${
          totalItems > 1 ? "s" : ""
        } in your cart:`,
        products: [],
        orders: [],
        cartItems: cartItems,
      };
    }

    if (
      query.includes("cart low price") ||
      query.includes("cheapest in cart")
    ) {
      const sortedByPrice = [...cartItems].sort((a, b) => a.price - b.price);
      return {
        text: `💰 **Lowest Priced Items in Cart**\n\nHere are your cart items sorted by price (lowest first):`,
        products: [],
        orders: [],
        cartItems: sortedByPrice,
      };
    }

    if (
      query.includes("cart high price") ||
      query.includes("most expensive in cart")
    ) {
      const sortedByPrice = [...cartItems].sort((a, b) => {
        const priceA = parseFloat(a.price || a.finalPrice || a.mrp || 0);
        const priceB = parseFloat(b.price || b.finalPrice || b.mrp || 0);
        return priceB - priceA;
      });
      return {
        text: `💎 **Highest Priced Items in Cart**\n\nHere are your cart items sorted by price (highest first):`,
        products: [],
        orders: [],
        cartItems: sortedByPrice,
      };
    }

    if (query.includes("cart total") || query.includes("total price")) {
      const couponInfo = appliedCoupon
        ? `\n\n🎟️ **Coupon Applied:** ${
            appliedCoupon.code
          }\n💰 **Discount:** ₹${(totalPrice - finalTotal).toFixed(2)}`
        : "";

      return {
        text: `💰 **Cart Summary**\n\n📦 **Items:** ${totalItems} book${
          totalItems > 1 ? "s" : ""
        }\n💵 **Subtotal:** ₹${totalPrice.toFixed(
          2
        )}${couponInfo}\n🔥 **Total:** ₹${finalTotal.toFixed(
          2
        )}\n\n🛍️ Ready to checkout? Visit your cart page!`,
        products: [],
        orders: [],
        cartItems: cartItems.slice(0, 3), // Show first 3 items
      };
    }

    // Default cart response
    return {
      text: `🛒 **Your Shopping Cart**\n\nYou have ${totalItems} item${
        totalItems > 1 ? "s" : ""
      } worth ₹${finalTotal.toFixed(2)} in your cart:`,
      products: [],
      orders: [],
      cartItems: cartItems,
    };
  };

  // Function to fetch and handle user orders
  const handleOrderQuery = async (query) => {
    if (!isUserLoggedIn()) {
      return {
        text: `🔐 **Please Login First**\n\nTo view your orders and delivery details, you need to sign in to your account.\n\n📱 **How to Login:**\n• Click the "Sign In" button in the top navigation\n• Use Google Sign-In or Email/Password\n• Access all your order information instantly\n\n✨ After logging in, ask me about your orders again!`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    // Fetch orders if not already loaded
    if (!hasOrdersLoaded()) {
      try {
        await fetchUserOrders();
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    }

    const userOrders = orders || [];
    const userName = getUserName();

    if (ordersLoading) {
      return {
        text: `⏳ Loading your orders, ${userName}...`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    if (userOrders.length === 0) {
      return {
        text: `📦 **No Orders Found**\n\nHi ${userName}! You haven't placed any orders yet.\n\n🛒 **Start Shopping:**\n• Browse our book collection\n• Add books to cart\n• Place your first order\n\n📞 **Need Help?** Contact our support team if you think this is an error.`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    // Handle specific order queries
    if (query.includes("order detail") || query.includes("order details")) {
      return {
        text: `📋 **Your Order Details**\n\nHi ${userName}! Here are your recent orders:`,
        products: [],
        orders: userOrders.slice(0, 3), // Show last 3 orders
      };
    }

    if (query.includes("recent order") || query.includes("latest order")) {
      if (userOrders.length > 0) {
        const recentOrder = userOrders[0]; // Most recent order
        return {
          text: `🕒 **Your Most Recent Order**\n\nHi ${userName}! Here's your latest order:`,
          products: [],
          orders: [recentOrder],
        };
      }
    }

    if (query.includes("order history") || query.includes("all orders")) {
      return {
        text: `📚 **Your Complete Order History**\n\nHi ${userName}! Here are all your orders:`,
        products: [],
        orders: userOrders, // Show all orders
      };
    }

    if (query.includes("track") || query.includes("tracking")) {
      const shippedOrders = userOrders.filter(
        (order) =>
          order.delivery?.status?.toLowerCase() === "shipped" ||
          order.delivery?.trackingId
      );

      if (shippedOrders.length === 0) {
        return {
          text: `🚚 **Order Tracking**\n\nNo shipped orders found with tracking information.\n\n📦 **Order Status Info:**\n• Orders are typically shipped within 2-3 business days\n• You'll receive tracking details via SMS and email\n• Contact support for urgent tracking needs`,
          products: [],
          orders: userOrders.slice(0, 2),
        };
      }

      return {
        text: `🚚 **Order Tracking Information**\n\nHere are your shipped orders with tracking details:`,
        products: [],
        orders: shippedOrders.slice(0, 3),
      };
    }

    if (
      query.includes("when will delivery") ||
      query.includes("delivery date") ||
      query.includes("when will arrive")
    ) {
      const shippedOrders = userOrders.filter(
        (order) => order.delivery?.status?.toLowerCase() === "shipped"
      );

      if (shippedOrders.length > 0) {
        const latestShipped = shippedOrders[0];
        const expectedDate = latestShipped.delivery?.expectedDate;
        const trackingInfo = latestShipped.delivery?.trackingId
          ? `\n🔍 **Tracking ID:** ${latestShipped.delivery.trackingId}`
          : "";

        return {
          text: `📅 **Delivery Information**\n\nYour order #${
            latestShipped.order_id
          } is on the way!\n\n🚚 **Status:** ${
            latestShipped.delivery?.status
          }\n📦 **Courier:** ${
            latestShipped.delivery?.courier || "Standard Delivery"
          }${
            expectedDate
              ? `\n📅 **Expected:** ${expectedDate}`
              : "\n📅 **Expected:** 4-7 business days"
          }${trackingInfo}`,
          products: [],
          orders: [latestShipped],
        };
      } else {
        return {
          text: `📦 **Delivery Information**\n\nYour orders are being processed.\n\n⏱️ **Typical Timeline:**\n• Processing: 1-2 business days\n• Shipping: 4-7 business days\n• Total: 5-9 business days\n\n📱 You'll receive tracking details via SMS once shipped!`,
          products: [],
          orders: userOrders.slice(0, 2),
        };
      }
    }

    if (
      query.includes("shipping address") ||
      query.includes("delivery address") ||
      query.includes("my address")
    ) {
      if (userOrders.length > 0) {
        const latestOrder = userOrders[0];
        const address = latestOrder.user_info?.address;

        if (address) {
          return {
            text: `🏠 **Your Delivery Address**\n\n📍 **Address Details:**\n${
              address.street
            }${address.apartment ? `, ${address.apartment}` : ""}\n${
              address.city
            }, ${address.state}\n${address.country} - ${
              address.pincode
            }\n\n📞 **Contact:** ${
              latestOrder.user_info?.phone
            }\n📧 **Email:** ${latestOrder.user_info?.email}`,
            products: [],
            orders: [],
          };
        }
      }

      return {
        text: `🏠 **Delivery Address**\n\nNo address information found in your recent orders.\n\n💡 **To update your address:**\n• Place a new order with updated address\n• Contact customer support for assistance`,
        products: [],
        orders: [],
      };
    }

    if (query.includes("delivery") || query.includes("status")) {
      return {
        text: `📦 **Order Status & Delivery**\n\nHi ${userName}! Here's the status of your orders:`,
        products: [],
        orders: userOrders.slice(0, 4),
      };
    }

    // Default order response
    return {
      text: `📦 **Your Orders**\n\nHi ${userName}! Here are your recent orders:`,
      products: [],
      orders: userOrders.slice(0, 3),
    };
  };

  const generateResponse = (userMessage) => {
    const query = userMessage.toLowerCase();
    console.log("Processing query:", query);

    // Handle wishlist-related queries first
    const wishlistKeywords = [
      "my wishlist",
      "wishlist item",
      "wishlist items",
      "wishlist low price",
      "wishlist high price",
      "add to wishlist",
      "put in wishlist",
      "remove from wishlist",
      "delete from wishlist",
      "clear wishlist",
      "empty wishlist",
      "delete my wishlist",
      "recent wishlist",
      "last added to wishlist",
      "newest in wishlist",
      "add to favorites",
      "save for later",
      "remove from favorites",
      "favorites",
      "cheapest in wishlist",
      "most expensive in wishlist",
    ];

    if (wishlistKeywords.some((keyword) => query.includes(keyword))) {
      console.log("Caught by wishlist handler:", query);
      return handleWishlistQuery(query);
    }

    // Handle cart-related queries
    const cartKeywords = [
      "my cart",
      "cart item",
      "cart items",
      "cart low price",
      "cart high price",
      "cart total",
      "total price",
      "cart summary",
      "shopping cart",
      "cheapest in cart",
      "most expensive in cart",
      "add to cart",
      "put in cart",
      "remove from cart",
      "delete from cart",
      "clear cart",
      "empty cart",
      "delete my cart",
      "remove my cart",
      "increase quantity",
      "decrease quantity",
      "add more",
      "reduce quantity",
      "recent cart",
      "last added",
      "newest in cart",
    ];

    // Check for cart-specific keywords (not general "high price" or "low price")
    const isCartQuery =
      cartKeywords.some((keyword) => query.includes(keyword)) &&
      !(
        query === "high price" ||
        query === "low price" ||
        (query.includes("high price") && !query.includes("cart")) ||
        (query.includes("low price") && !query.includes("cart"))
      );

    if (isCartQuery) {
      console.log("Caught by cart handler:", query);
      return handleCartQuery(query);
    }

    // Handle order-related queries
    const orderKeywords = [
      "my order",
      "my orders",
      "order detail",
      "order details",
      "order status",
      "delivery status",
      "track order",
      "tracking",
      "where is my order",
      "order history",
      "recent order",
      "latest order",
      "all orders",
      "when will delivery",
      "delivery date",
      "when will arrive",
      "shipping address",
      "delivery address",
      "my address",
    ];

    if (orderKeywords.some((keyword) => query.includes(keyword))) {
      console.log("Caught by order handler:", query);
      return handleOrderQuery(query);
    }

    // A. Direct Product Lookups - Enhanced pattern matching
    const directProductPatterns = [
      /need\s+(.*?)\s+book/i,
      /class\s+(\d+)\s+(.*?)\s+book/i,
      /show\s+me\s+(.*)/i,
      /(.*?)\s+textbook/i,
      /book\s+by\s+(.*)/i,
      /cbse\s+class\s+(\d+)\s+(.*)/i,
      /ncert\s+(.*?)\s+class\s+(\d+)/i,
      /(.*?)\s+subject\s+code\s+(\d+)/i,
      /sample\s+paper\s+books?\s+for\s+class\s+(\d+)/i,
      /question\s+bank\s+for\s+(.*)/i,
      /guide\s+for\s+class\s+(\d+)\s+(.*)/i,
      /workbook\s+for\s+class\s+(\d+)\s+(.*)/i,
    ];

    for (const pattern of directProductPatterns) {
      const match = query.match(pattern);
      if (match) {
        console.log("Caught by direct product pattern:", pattern, query);
        let searchTerm = "";
        if (pattern.source.includes("need")) {
          searchTerm = match[1];
        } else if (pattern.source.includes("show")) {
          searchTerm = match[1];
        } else if (pattern.source.includes("class.*book")) {
          searchTerm = `class ${match[1]} ${match[2]}`;
        } else if (pattern.source.includes("textbook")) {
          searchTerm = match[1];
        } else if (pattern.source.includes("book.*by")) {
          searchTerm = `author:${match[1]}`;
        } else if (pattern.source.includes("cbse")) {
          searchTerm = `cbse class ${match[1]} ${match[2]}`;
        } else if (pattern.source.includes("ncert")) {
          searchTerm = `ncert ${match[1]} class ${match[2]}`;
        } else if (pattern.source.includes("subject.*code")) {
          searchTerm = `${match[1]} subject code ${match[2]}`;
        } else if (pattern.source.includes("sample.*paper")) {
          searchTerm = `sample paper class ${match[1]}`;
        } else if (pattern.source.includes("question.*bank")) {
          searchTerm = `question bank ${match[1]}`;
        } else if (pattern.source.includes("guide.*for")) {
          searchTerm = `guide class ${match[1]} ${match[2]}`;
        } else if (pattern.source.includes("workbook")) {
          searchTerm = `workbook class ${match[1]} ${match[2]}`;
        }

        if (searchTerm.startsWith("author:")) {
          const authorName = searchTerm.replace("author:", "");
          const authorBooks = products.filter((p) =>
            p.author?.toLowerCase().includes(authorName.toLowerCase())
          );
          if (authorBooks.length > 0) {
            return {
              text: `📚 Found ${authorBooks.length} book${
                authorBooks.length > 1 ? "s" : ""
              } by ${authorName}:`,
              products: authorBooks.slice(0, 4),
            };
          }
        } else {
          const foundProducts = enhancedSearchProducts(searchTerm);
          if (foundProducts.length > 0) {
            return {
              text: `📖 Found ${foundProducts.length} book${
                foundProducts.length > 1 ? "s" : ""
              } matching "${searchTerm}":`,
              products: foundProducts.slice(0, 4),
            };
          }
        }
      }
    }

    // B. Subject/Stream-Based Queries
    const streamQueries = {
      "commerce stream": [
        "business studies",
        "economics",
        "accountancy",
        "commerce",
      ],
      "science stream": [
        "physics",
        "chemistry",
        "mathematics",
        "biology",
        "science",
      ],
      "arts stream": [
        "political science",
        "sociology",
        "psychology",
        "history",
        "arts",
      ],
      "economics business studies accountancy": [
        "economics",
        "business studies",
        "accountancy",
      ],
    };

    for (const [streamName, subjects] of Object.entries(streamQueries)) {
      if (query.includes(streamName.toLowerCase())) {
        const streamBooks = products.filter((p) =>
          subjects.some(
            (subject) =>
              p.name.toLowerCase().includes(subject) ||
              p.sub_categories?.some((cat) =>
                cat.toLowerCase().includes(subject)
              )
          )
        );
        if (streamBooks.length > 0) {
          return {
            text: `📚 Found ${streamBooks.length} books for ${streamName}:`,
            products: streamBooks.slice(0, 4),
          };
        }
      }
    }

    // Enhanced individual subject queries
    const subjectKeywords = {
      psychology: ["psychology", "psychological"],
      "political science": ["political science", "political", "civics"],
      sociology: ["sociology", "social science"],
      economics: ["economics", "economic"],
      "business studies": ["business studies", "business", "bst"],
      accountancy: ["accountancy", "accounts", "accounting"],
      entrepreneurship: ["entrepreneurship", "entrepreneur"],
      physics: ["physics", "physical science"],
      chemistry: ["chemistry", "chemical science"],
      mathematics: ["mathematics", "math", "maths"],
      biology: ["biology", "life science"],
      "computer science": ["computer science", "computer", "cs", "informatics"],
    };

    for (const [subject, keywords] of Object.entries(subjectKeywords)) {
      if (keywords.some((keyword) => query.includes(keyword.toLowerCase()))) {
        const subjectBooks = products.filter((p) =>
          keywords.some(
            (keyword) =>
              p.name.toLowerCase().includes(keyword) ||
              p.sub_categories?.some((cat) =>
                cat.toLowerCase().includes(keyword)
              ) ||
              p.description?.toLowerCase().includes(keyword)
          )
        );
        if (subjectBooks.length > 0) {
          return {
            text: `📖 Found ${subjectBooks.length} ${subject} book${
              subjectBooks.length > 1 ? "s" : ""
            }:`,
            products: subjectBooks.slice(0, 4),
          };
        }
      }
    }

    // C. Teacher/School Related Queries
    const teacherQueries = [
      "teacher copy",
      "sample books for teachers",
      "quotation for school",
      "new academic session",
      "digital version",
      "pdf",
      "teacher manual",
    ];

    if (teacherQueries.some((tq) => query.includes(tq))) {
      return {
        text: `👩‍🏫 **Teacher & School Support:**\n\n📞 **Contact Information:**\n• Phone: 011-4578594\n• Mobile: +91 79826 45175\n• Email: support@cremsonpublications.com\n• Business Hours: Mon-Sat, 9 AM - 6 PM\n\n📱 **WhatsApp:** [Click here to contact](https://wa.me/917982645175?text=Hi,%20I%20need%20information%20about%20teacher%20resources)\n\n📋 **Services Available:**\n• Teacher sample copies\n• Bulk school orders\n• Digital versions (selected titles)\n• Teacher manuals\n• Academic year planning\n• Custom quotations\n\n💡 For immediate assistance with teacher resources, please contact our dedicated school support team!`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    // D. Order, Delivery & Support Queries
    const supportQueries = {
      "delivery days":
        "🚚 **Delivery Information:**\n\n📦 **Standard Delivery:** 2-3 days\n\nYour order will be delivered within 2-3 business days from the date of dispatch.",

      "deliver to delhi":
        "🏙️ **Delhi Delivery:**\n\n✅ **Yes, we deliver to Delhi!**\n\n📦 Delivery time: 2-3 business days",

      "cod available":
        "💳 **Cash on Delivery (COD):**\n\n❌ **COD is not available currently**\n\n📞 For payment support, please contact our admin:\n\n📱 **WhatsApp:** [Click here to contact](https://wa.me/917982645175?text=Hi,%20I%20need%20help%20with%20payment%20options)",

      "exchange return":
        "🔄 **Exchange Policy:**\n\n❓ **Can I exchange if book is wrong?**\n\n📞 Please contact our admin for exchange assistance:\n\n📱 **WhatsApp:** [Click here to contact](https://wa.me/917982645175?text=Hi,%20I%20received%20the%20wrong%20book%20and%20need%20to%20exchange%20it)",

      "track order": `📦 **Order Tracking:**\n\n🚚 **Track your shipment:**\n\nYes! You can track your shipment. Please select your courier partner:\n\n📋 **Available Couriers:**\n• 🚛 [Blue Dart](https://www.bluedart.com/tracking)\n• 📦 [DTDC](https://www.dtdc.in/tracking)\n• 🚚 [Delhivery](https://www.delhivery.com/track)\n• 📮 [India Post](https://www.indiapost.gov.in/VAS/Pages/trackconsignment.aspx)\n\nClick on your courier link to track your package!`,

      "shipping charges":
        "🚛 **Shipping Charges:**\n\n💰 **Check at order time:**\nShipping charges are displayed during checkout based on your location and order details.",
    };

    for (const [keyPhrase, response] of Object.entries(supportQueries)) {
      if (
        query.includes(keyPhrase.replace(" ", "")) ||
        keyPhrase.split(" ").every((word) => query.includes(word))
      ) {
        return {
          text: response,
          products: [],
          orders: [],
        };
      }
    }

    // Additional specific queries
    if (
      query.includes("how to return book") ||
      query.includes("return policy")
    ) {
      return {
        text: `📋 **Return Policy:**\n\n📖 **How to return a book?**\n\nPlease read our detailed return policy on our website or contact our support team.\n\n📄 For complete return policy information, visit our Returns & Refunds page.`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    if (
      query.includes("where is my order") ||
      query.includes("order status") ||
      query.includes("my order")
    ) {
      return handleOrderQuery(query);
    }

    // E. Miscellaneous/Informational Queries
    if (
      query.includes("author of this book") ||
      query.includes("who is the author")
    ) {
      // Extract book name from query if provided
      const bookNameMatch = query.match(/author of (.+?)(?:\?|$)/i);
      if (bookNameMatch) {
        const bookName = bookNameMatch[1].trim();
        const foundBook = products.find((p) =>
          p.name.toLowerCase().includes(bookName.toLowerCase())
        );

        if (foundBook && foundBook.author) {
          return {
            text: `📝 **Author Information:**\n\n📚 **Book:** ${foundBook.name}\n✍️ **Author:** ${foundBook.author}`,
            products: [foundBook],
            orders: [],
            cartItems: [],
            wishlistItems: [],
          };
        }
      }

      return {
        text: `📝 **Author Information:**\n\nPlease specify the book name to check its author.\n\n💡 **Example:** "Who is the author of Economics Class 12?"`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    if (
      query.includes("2025-26 session") ||
      query.includes("2025") ||
      query.includes("latest edition")
    ) {
      // Extract book name if provided
      const bookNameMatch =
        query.match(/is (.+?) for 2025/i) || query.match(/(.+?) for 2025-26/i);
      if (bookNameMatch) {
        const bookName = bookNameMatch[1].trim();
        const foundBook = products.find((p) =>
          p.name.toLowerCase().includes(bookName.toLowerCase())
        );

        if (foundBook) {
          return {
            text: `📅 **Edition Information:**\n\n📚 **Book:** ${
              foundBook.name
            }\n📖 **Edition:** ${foundBook.edition || "Latest Edition"}\n\n${
              foundBook.edition?.includes("2025")
                ? "✅ This book is for the 2025-26 session!"
                : "📅 Please check the edition details for session compatibility."
            }`,
            products: [foundBook],
            orders: [],
            cartItems: [],
            wishlistItems: [],
          };
        }
      }

      const latestBooks = products.filter(
        (p) =>
          p.edition?.includes("2025") ||
          p.name.toLowerCase().includes("2025") ||
          p.description?.toLowerCase().includes("2025")
      );
      return {
        text: `📅 **2025-26 Academic Session Books:**\n\n${
          latestBooks.length > 0
            ? `Found ${latestBooks.length} books for the current session:`
            : "Most of our books are updated for the current academic session. Here are some popular titles:"
        }`,
        products:
          latestBooks.length > 0
            ? latestBooks.slice(0, 4)
            : products.filter((p) => p.status === "In Stock").slice(0, 4),
      };
    }

    if (query.includes("hindi medium") || query.includes("vernacular")) {
      const hindiBooks = products.filter(
        (p) =>
          p.name.toLowerCase().includes("hindi") ||
          p.description?.toLowerCase().includes("hindi") ||
          p.name.toLowerCase().includes("हिंदी")
      );
      return {
        text: `🇮🇳 **Hindi Medium Books:**\n\n${
          hindiBooks.length > 0
            ? `Found ${hindiBooks.length} Hindi medium books:`
            : "We have limited Hindi medium titles. Please check our product listings for availability."
        }`,
        products: hindiBooks.slice(0, 4),
      };
    }

    if (
      query.includes("e-books") ||
      query.includes("ebook") ||
      query.includes("digital books") ||
      query.includes("sell e-books")
    ) {
      return {
        text: `💻 **E-books & Digital Books:**\n\n❌ **We don't sell e-books currently**\n\n📞 For digital book inquiries, please contact our admin:\n\n📱 **WhatsApp:** [Click here to contact](https://wa.me/917982645175?text=Hi,%20I%20need%20information%20about%20e-books%20and%20digital%20versions)`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    if (
      query.includes("bundle discount") ||
      query.includes("combo offer") ||
      query.includes("bulk discount")
    ) {
      return {
        text: `💰 **Bulk Orders:**\n\n📞 **Contact our sales team for:**\n• Bulk discounts for large orders\n• Special rates for schools & institutions\n• Custom bundle pricing\n\n📱 **WhatsApp:** [Click here to contact](https://wa.me/917982645175?text=Hi,%20I%20need%20information%20about%20bulk%20orders%20and%20discounts)`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    if (query.includes("isbn") && !query.match(/\d{10,13}/)) {
      return {
        text: `📖 **ISBN Information:**\n\nISBN (International Standard Book Number) is a unique identifier for books.\n\n🔍 **How to use:**\n• Enter 10 or 13 digit ISBN number\n• Example: "9789394691957"\n• I'll find the exact book for you\n\n💡 ISBN is usually printed on the back cover or copyright page.`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    if (
      query.includes("offers available") ||
      query.includes("discount") ||
      query.includes("sale") ||
      query.includes("coupon")
    ) {
      if (couponsLoading) {
        return {
          text: `⏳ **Loading available coupons...**\n\nPlease wait while I fetch the latest offers for you.`,
          products: [],
          orders: [],
          cartItems: [],
          wishlistItems: [],
        };
      }

      if (selectedCoupons && selectedCoupons.length > 0) {
        const couponList = selectedCoupons
          .map((coupon) => {
            const discountText =
              coupon.discount_type === "percentage"
                ? `${coupon.discount_value}% off`
                : `₹${coupon.discount_value} off`;

            const minOrderText = coupon.minimum_order_amount
              ? ` (min order ₹${coupon.minimum_order_amount})`
              : "";

            return `• **${coupon.code}** - ${discountText}${minOrderText}`;
          })
          .join("\n");

        return {
          text: `🎉 **Available Coupons:**\n\n🎟️ **Current Offers:**\n${couponList}\n\n💡 Apply coupon code at checkout to get discount!`,
          products: [],
          orders: [],
          cartItems: [],
          wishlistItems: [],
        };
      } else {
        return {
          text: `🎟️ **No Active Coupons**\n\nCurrently there are no active coupons available.\n\n🔔 Check back later for new offers and discounts!`,
          products: [],
          orders: [],
          cartItems: [],
          wishlistItems: [],
        };
      }
    }

    if (
      query.includes("talk to support") ||
      query.includes("customer care") ||
      query.includes("contact") ||
      query.includes("can i talk to support")
    ) {
      return {
        text: `📞 **Customer Support:**\n\n📱 **WhatsApp Support:** [Click here to contact](https://wa.me/917982645175?text=Hi,%20I%20need%20support%20assistance)\n\n🔥 **Contact Information:**\n• Phone: 011-4578594\n• Mobile: +91 79826 45175\n• Email: support@cremsonpublications.com\n\n⏰ **Business Hours:**\n• Monday - Saturday: 9 AM - 6 PM\n• Sunday: 10 AM - 4 PM\n\n🚀 **Response Time:** Within 2 hours`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    // Time-based greetings
    if (
      query.includes("hello") ||
      query.includes("hi") ||
      query.includes("hey") ||
      query.includes("good morning") ||
      query.includes("good afternoon") ||
      query.includes("good evening")
    ) {
      console.log("Caught by greeting handler:", query);
      const greeting = getTimeBasedGreeting();

      // Get dynamic data from API for greeting response
      const availableClasses = [
        ...new Set(products.flatMap((p) => p.classes || [])),
      ].sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        return numA - numB;
      });

      const inStockCount = products.filter(
        (p) => p.status === "In Stock"
      ).length;
      const soldOutCount = products.filter(
        (p) => p.status === "Out of Stock"
      ).length;

      // Get available categories from actual data
      const availableCategories = [
        ...new Set(
          products
            .map((p) => p.categories?.main_category_name || p.category)
            .filter(Boolean)
        ),
      ].slice(0, 2); // Show top 2 categories

      // Format classes text
      let classesText = "Various classes";
      if (availableClasses.length > 0) {
        const displayClasses = availableClasses.slice(0, 3);
        classesText = displayClasses.map((cls) => `Class ${cls}`).join(", ");
        if (availableClasses.length > 3) {
          classesText += ` and more`;
        }
      }

      // Format categories text
      let categoriesText = "available categories";
      if (availableCategories.length > 0) {
        categoriesText = availableCategories
          .map((cat) => `"${cat} books"`)
          .join(" or ");
      }

      return {
        text: `${greeting}! 😊 I'm your AI Book Assistant. I can help you find books by:\n\n1️⃣ **Price** - "low price", "high price", or "₹278"\n2️⃣ **Availability** - "${inStockCount} in stock" or "${soldOutCount} sold out"\n3️⃣ **Class** - ${classesText}\n4️⃣ **Author** - "by author name"\n5️⃣ **Category** - ${categoriesText}\n6️⃣ **ISBN** - "9789394691957"\n\nWhat would you like to explore?`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    // Simple direct filtering
    console.log("Reached simple direct filtering section for query:", query);
    let filteredProducts = [];

    // 1. High price - show highest price books
    if (
      query.includes("high price") ||
      query.includes("premium") ||
      query.includes("expensive")
    ) {
      console.log("High price query detected:", query);
      console.log("Products available:", products.length);
      const sortedByPrice = [...products].sort((a, b) => {
        const priceA = parseFloat(a.finalPrice || a.mrp || a.price || 0);
        const priceB = parseFloat(b.finalPrice || b.mrp || b.price || 0);
        return priceB - priceA;
      });
      filteredProducts = sortedByPrice.slice(0, 4);
      console.log("Filtered high price products:", filteredProducts.length);
      if (filteredProducts.length > 0) {
        console.log("Sample product:", filteredProducts[0]);
      }

      if (filteredProducts.length > 0) {
        return {
          text: `💎 Here are our highest price books:`,
          products: filteredProducts,
          orders: [],
          cartItems: [],
          wishlistItems: [],
        };
      }
    }

    // 2. Low price - show lowest price books
    if (
      query.includes("low price") ||
      query.includes("cheap") ||
      query.includes("affordable")
    ) {
      const sortedByPrice = [...products].sort((a, b) => {
        const priceA = parseFloat(a.finalPrice || a.mrp || a.price || 0);
        const priceB = parseFloat(b.finalPrice || b.mrp || b.price || 0);
        return priceA - priceB;
      });
      filteredProducts = sortedByPrice.slice(0, 4);

      if (filteredProducts.length > 0) {
        return {
          text: `💰 Here are our lowest price books:`,
          products: filteredProducts,
          orders: [],
          cartItems: [],
          wishlistItems: [],
        };
      }
    }

    // 3. Sold out - show only out of stock books
    if (query.includes("sold out") || query.includes("out of stock")) {
      filteredProducts = products
        .filter((p) => p.status === "Out of Stock")
        .slice(0, 4);

      if (filteredProducts.length > 0) {
        return {
          text: `📋 Here are the sold out books:`,
          products: filteredProducts,
        };
      }
    }

    // 4. Stock/In stock - show only in stock books
    if (
      query.includes("in stock") ||
      query.includes("available") ||
      query.includes("stock")
    ) {
      filteredProducts = products
        .filter((p) => p.status === "In Stock")
        .slice(0, 4);

      if (filteredProducts.length > 0) {
        return {
          text: `✅ Here are the books in stock:`,
          products: filteredProducts,
        };
      }
    }

    // 5. Specific class - show only that class (9, 10, 11, 12)
    const classMatch = query.match(/(\d+)(?:th|st|nd|rd)?/);
    if (classMatch) {
      const classNum = classMatch[1];
      filteredProducts = products
        .filter((p) => p.classes && p.classes.includes(classNum))
        .slice(0, 4);

      if (filteredProducts.length > 0) {
        return {
          text: `🎓 Here are the books for Class ${classNum}:`,
          products: filteredProducts,
        };
      }
    }

    // 6. Author name - show books by that specific author
    const authorMatch = query.match(/by\s+([^.!?]+)/i);
    if (authorMatch) {
      const authorName = authorMatch[1].trim();
      filteredProducts = products
        .filter((p) =>
          p.author?.toLowerCase().includes(authorName.toLowerCase())
        )
        .slice(0, 4);

      if (filteredProducts.length > 0) {
        return {
          text: `👨‍🏫 Here are books by ${authorName}:`,
          products: filteredProducts,
        };
      }
    }

    // 7. Specific price - show books at exact price (e.g., ₹278)
    const priceMatch = query.match(/₹(\d+)/);
    if (priceMatch) {
      const exactPrice = parseInt(priceMatch[1]);
      filteredProducts = products
        .filter((p) => p.mrp === exactPrice)
        .slice(0, 4);

      if (filteredProducts.length > 0) {
        return {
          text: `💰 Here are books priced at ₹${exactPrice}:`,
          products: filteredProducts,
        };
      }
    }

    // 8. Main category - show books from specific main category
    const mainCategories = [
      "cbse",
      "icse",
      "state board",
      "competitive",
      "reference",
      "academic",
      "textbook",
    ];

    const matchedCategory = mainCategories.find((category) =>
      query.toLowerCase().includes(category)
    );

    if (matchedCategory) {
      filteredProducts = products
        .filter((p) =>
          p.categories?.main_category_name
            ?.toLowerCase()
            .includes(matchedCategory)
        )
        .slice(0, 4);

      if (filteredProducts.length > 0) {
        return {
          text: `📚 Here are ${matchedCategory.toUpperCase()} books:`,
          products: filteredProducts,
        };
      }
    }

    // 9. ISBN search - show books by ISBN number (e.g., 9789394691957)
    const isbnMatch = query.match(/\b\d{10,13}\b/);
    if (isbnMatch) {
      const isbnNumber = isbnMatch[0];
      filteredProducts = products
        .filter((p) => p.isbn === isbnNumber)
        .slice(0, 4);

      if (filteredProducts.length > 0) {
        return {
          text: `📖 Here are books with ISBN ${isbnNumber}:`,
          products: filteredProducts,
        };
      }
    }

    // Rating-based filtering
    if (
      query.includes("best") ||
      query.includes("top rated") ||
      query.includes("high review") ||
      query.includes("popular")
    ) {
      const topRatedBooks = products
        .filter((p) => p.rating >= 4.0 || p.review_count > 0)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);

      if (topRatedBooks.length > 0) {
        return {
          text: `⭐ Our highest rated and most popular books:`,
          products: topRatedBooks,
        };
      }
    }

    // Smart recommendations based on popular combinations
    if (
      query.includes("recommend") ||
      query.includes("suggest") ||
      query.includes("best for")
    ) {
      const recommendations = generateSmartRecommendations(query);
      if (recommendations.length > 0) {
        return {
          text: `🎯 Here are my personalized recommendations for you:`,
          products: recommendations,
        };
      }
    }

    // Help queries with enhanced examples
    if (query.includes("help") || query.includes("what can you do")) {
      return {
        text: `I'm your AI Book Assistant! 🤖 I can help you with:\n\n📚 **Direct Product Lookups:**\n• "Need Economics book"\n• "Class 12 Business Studies book"\n• "Show me Psychology Class 11"\n• "Entrepreneurship textbook by Simmi Prakash"\n• "CBSE Class 12 Economics Project book"\n• "Sample paper books for Class 10"\n\n🎓 **Subject & Stream Searches:**\n• "Commerce stream books"\n• "Science stream books"\n• "Arts stream books"\n• "Psychology Class 12"\n• "Economics, Business Studies, and Accountancy combo"\n\n🛒 **My Cart & Shopping:**\n• "My cart" - View your cart items\n• "Add Economics book to cart" - Add specific books\n• "Remove Physics from cart" - Remove specific items\n• "Increase Physics quantity" - Increase item quantity\n• "Decrease Math quantity" - Decrease item quantity\n• "Cart low price" - Sort cart by lowest price\n• "Cart high price" - Sort cart by highest price\n• "recent cart" - Show last added item\n• "Clear cart" - Empty entire cart\n• "Cart total" - View cart summary and total\n\n💖 **My Wishlist & Favorites:**\n• "My wishlist" - View your saved items\n• "Add Economics book to wishlist" - Save books for later\n• "Remove Physics from wishlist" - Remove saved items\n• "Wishlist low price" - Sort wishlist by lowest price\n• "Wishlist high price" - Sort wishlist by highest price\n• "Recent wishlist" - Show last added item\n• "Clear wishlist" - Empty entire wishlist\n• "Add to favorites" - Save for later\n• "Remove from favorites" - Remove saved items\n\n📦 **My Orders & Delivery:**\n• "My orders" - View your order history\n• "Recent order" - Show latest order only\n• "Order history" - Complete order history\n• "Track my order" - Check tracking status\n• "When will delivery" - Delivery date info\n• "Shipping address" - View delivery address\n• "Order details" - Detailed order information\n\n👩‍🏫 **Teacher & School Support:**\n• "How to get teacher copy?"\n• "Do you provide sample books for teachers?"\n• "Need quotation for school order"\n• "Can I get digital version or PDF?"\n\n🚚 **Order & Support Queries:**\n• "How many days for delivery?"\n• "Is COD available?"\n• "Can I exchange if book is wrong?"\n• "What are shipping charges?"\n\n💡 **General Information:**\n• "Who is the author of this book?"\n• "Is this book for 2025–26 session?"\n• "Do you have Hindi medium version?"\n• "Any offers available?"\n• "Can I talk to support?"\n\n📖 **ISBN & Price Search:**\n• "9789394691957" - Find by ISBN\n• "₹278" - Find by exact price\n\n${
          isUserLoggedIn()
            ? `👋 Hi ${getUserName()}! `
            : "🔐 Login to access your orders! "
        }Just ask me anything about our ${products.length} books!`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    // Enhanced general search for products with better fallbacks
    const foundProducts = enhancedSearchProducts(query);

    if (foundProducts.length > 0) {
      let responseText = generateContextualResponse(query, foundProducts);

      return {
        text: responseText,
        products: foundProducts.slice(0, 4),
      };
    }

    // Handle inappropriate or non-related queries
    const inappropriateKeywords = [
      "sex",
      "adult",
      "porn",
      "violence",
      "drugs",
      "alcohol",
      "gambling",
      "religion",
      "politics",
      "personal",
      "dating",
      "relationship",
    ];

    const nonBookRelatedKeywords = [
      "weather",
      "sports",
      "entertainment",
      "movies",
      "music",
      "food",
      "travel",
      "fashion",
      "technology",
      "games",
      "jokes",
      "stories",
    ];

    if (inappropriateKeywords.some((keyword) => query.includes(keyword))) {
      return {
        text: "⚠️ **Please Keep Questions Educational**\n\nI'm designed to help with educational books and academic materials only.\n\n📚 **Ask me about:**\n• Textbooks and study materials\n• Class-specific books\n• Subject-wise books\n• Academic publishers\n• Educational resources\n\n💡 Let's focus on finding the perfect books for your studies!",
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    if (
      nonBookRelatedKeywords.some((keyword) => query.includes(keyword)) &&
      !query.includes("book") &&
      !query.includes("study") &&
      !query.includes("education")
    ) {
      return {
        text: '🤖 **I\'m Your Book Assistant!**\n\nI specialize in helping you find educational books and study materials.\n\n📚 **Try asking me:**\n• "Class 12 Physics books"\n• "Economics textbooks"\n• "CBSE sample papers"\n• "Books by specific authors"\n• "My order status"\n• "Delivery information"\n\n❓ **For other topics**, please contact our customer support team.\n\nHow can I help you find the perfect study materials today?',
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    // Enhanced non-book related query detection
    const hasBookRelatedContent =
      query.includes("book") ||
      query.includes("class") ||
      query.includes("study") ||
      query.includes("price") ||
      query.includes("stock") ||
      query.includes("author") ||
      query.includes("order") ||
      query.includes("delivery") ||
      query.includes("help") ||
      products.some(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.author?.toLowerCase().includes(query) ||
          p.sub_categories?.some((cat) => cat.toLowerCase().includes(query))
      );

    if (!hasBookRelatedContent && query.length > 3) {
      return {
        text: `🔍 **Couldn't find relevant books for "${query}"**\n\n📚 **Try these instead:**\n• "Class [number] [subject] books"\n• "[Subject name] textbooks"\n• "CBSE/ICSE books"\n• "Books by [author name]"\n• "Sample papers for Class [number]"\n• "My orders" (if you're logged in)\n\n💡 **Examples:**\n• "Class 12 Physics books"\n• "Economics textbooks"\n• "Books by NCERT"\n\n📞 **Need help?** Contact our support team for assistance!`,
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
      };
    }

    // Default response for unmatched book queries
    return {
      text: "🔍 I couldn't find specific books for that search. Try these options:\n\n💡 **Quick Searches:**\n• 'Low price books'\n• 'Class 11 books'\n• 'Physics books'\n• 'In stock books'\n• 'Best books'\n• 'My orders' (if logged in)\n\n📞 Or browse our complete collection in the shop section!",
      products: [],
      orders: [],
      cartItems: [],
      wishlistItems: [],
    };
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      // Handle async responses (like order queries)
      const response = await generateResponse(currentInput);

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: response.text,
        products: response.products || [],
        orders: response.orders || [],
        cartItems: response.cartItems || [],
        wishlistItems: response.wishlistItems || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);

      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: "I'm sorry, I encountered an error. Please try again or contact support if the issue persists.",
        products: [],
        orders: [],
        cartItems: [],
        wishlistItems: [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-end p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[650px] flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Book Assistant</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs opacity-90">Online • Ready to help</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] ${
                  message.type === "user" ? "order-2" : "order-1"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {message.text}
                  </p>
                </div>

                {/* Product Cards */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                    {message.products.length >= 4 && (
                      <Link
                        to="/shop"
                        className="block text-center text-orange-600 hover:text-orange-700 text-sm font-medium py-2"
                      >
                        View all books{" "}
                        <ArrowRight size={14} className="inline ml-1" />
                      </Link>
                    )}
                  </div>
                )}

                {/* Order Cards */}
                {message.orders && message.orders.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.orders.map((order, index) => (
                      <OrderCard
                        key={order.id || order.order_id || index}
                        order={order}
                      />
                    ))}
                    {message.orders.length >= 3 && (
                      <Link
                        to="/my-orders"
                        className="block text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2"
                      >
                        View all orders{" "}
                        <ArrowRight size={14} className="inline ml-1" />
                      </Link>
                    )}
                  </div>
                )}

                {/* Cart Item Cards */}
                {message.cartItems && message.cartItems.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.cartItems.map((item, index) => (
                      <CartItemCard
                        key={item.id || index}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                      />
                    ))}
                    {message.cartItems.length >= 3 && (
                      <Link
                        to="/cart"
                        className="block text-center text-orange-600 hover:text-orange-700 text-sm font-medium py-2"
                      >
                        View full cart{" "}
                        <ArrowRight size={14} className="inline ml-1" />
                      </Link>
                    )}
                  </div>
                )}

                {/* Wishlist Item Cards */}
                {message.wishlistItems && message.wishlistItems.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.wishlistItems.map((item, index) => (
                      <WishlistItemCard
                        key={item.id || index}
                        item={item}
                        onRemove={removeFromWishlist}
                      />
                    ))}
                    {message.wishlistItems.length >= 3 && (
                      <Link
                        to="/wishlist"
                        className="block text-center text-pink-600 hover:text-pink-700 text-sm font-medium py-2"
                      >
                        View full wishlist{" "}
                        <ArrowRight size={14} className="inline ml-1" />
                      </Link>
                    )}
                  </div>
                )}

                <div
                  className={`flex items-center gap-2 mt-2 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type === "bot" && (
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot size={10} className="text-white" />
                    </div>
                  )}
                  {message.type === "user" && (
                    <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                      <User size={10} className="text-gray-600" />
                    </div>
                  )}
                  <span className="text-xs text-gray-500 font-medium">
                    {message.timestamp.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot size={12} className="text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about books, classes, subjects..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            🤖 Ask me about textbooks, lab manuals, classes, or subjects
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
