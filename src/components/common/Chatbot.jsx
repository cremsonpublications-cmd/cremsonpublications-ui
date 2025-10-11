import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Book, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";

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

const Chatbot = ({ isOpen, onClose }) => {
  const { products } = useProducts(); // Get dynamic product data

  const [messages, setMessages] = useState([]);

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

      // Format classes text
      let classesText = "Various classes";
      if (availableClasses.length > 0) {
        const displayClasses = availableClasses.slice(0, 4);
        classesText = displayClasses.map((cls) => `Class ${cls}`).join(", ");
        if (availableClasses.length > 4) {
          classesText += ` and ${availableClasses.length - 4} more`;
        }
      }

      const initialGreeting = `${greeting}! 😊 I'm your AI Book Assistant. I can help you find books by:\n\n1️⃣ **Price** - "low price", "high price", or "₹278"\n2️⃣ **Availability** - "${inStockCount} in stock" or "${soldOutCount} sold out"\n3️⃣ **Class** - ${classesText}\n4️⃣ **Author** - "by author name"\n5️⃣ **Category** - "CBSE books" or "ICSE books"\n6️⃣ **ISBN** - "9789394691957"\n\nWhat would you like to explore today?`;

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

  const searchProducts = (query) => {
    const searchTerms = query.toLowerCase();

    return products.filter((product) => {
      const productName = product.name.toLowerCase();
      const authorName = product.author?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";

      // Simple exact or partial matching
      return (
        productName.includes(searchTerms) ||
        authorName.includes(searchTerms) ||
        description.includes(searchTerms) ||
        product.classes?.some((cls) =>
          cls.toLowerCase().includes(searchTerms)
        ) ||
        product.sub_categories?.some((cat) =>
          cat.toLowerCase().includes(searchTerms)
        ) ||
        product.categories?.main_category_name
          ?.toLowerCase()
          .includes(searchTerms)
      );
    });
  };

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

  const generateResponse = (userMessage) => {
    const query = userMessage.toLowerCase();

    // Time-based greetings
    if (
      query.includes("hello") ||
      query.includes("hi") ||
      query.includes("hey") ||
      query.includes("good morning") ||
      query.includes("good afternoon") ||
      query.includes("good evening")
    ) {
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

      // Format classes text
      let classesText = "Various classes";
      if (availableClasses.length > 0) {
        const displayClasses = availableClasses.slice(0, 3);
        classesText = displayClasses.map((cls) => `Class ${cls}`).join(", ");
        if (availableClasses.length > 3) {
          classesText += ` and more`;
        }
      }

      return {
        text: `${greeting}! 😊 I'm your AI Book Assistant. I can help you find books by:\n\n1️⃣ **Price** - "low price", "high price", or "₹278"\n2️⃣ **Availability** - "${inStockCount} in stock" or "${soldOutCount} sold out"\n3️⃣ **Class** - ${classesText}\n4️⃣ **Author** - "by author name"\n5️⃣ **Category** - "CBSE books" or "ICSE books"\n6️⃣ **ISBN** - "9789394691957"\n\nWhat would you like to explore?`,
        products: [],
      };
    }

    // Simple direct filtering
    let filteredProducts = [];

    // 1. High price - show highest price books
    if (
      query.includes("high price") ||
      query.includes("premium") ||
      query.includes("expensive")
    ) {
      const sortedByPrice = [...products].sort((a, b) => b.mrp - a.mrp);
      filteredProducts = sortedByPrice.slice(0, 4);

      if (filteredProducts.length > 0) {
        return {
          text: `💎 Here are our highest price books:`,
          products: filteredProducts,
        };
      }
    }

    // 2. Low price - show lowest price books
    if (
      query.includes("low price") ||
      query.includes("cheap") ||
      query.includes("affordable")
    ) {
      const sortedByPrice = [...products].sort((a, b) => a.mrp - b.mrp);
      filteredProducts = sortedByPrice.slice(0, 4);

      if (filteredProducts.length > 0) {
        return {
          text: `💰 Here are our lowest price books:`,
          products: filteredProducts,
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
      // Get dynamic data for help response
      const popularAuthors = [
        ...new Set(products.map((p) => p.author).filter(Boolean)),
      ].slice(0, 3);

      const authorsText =
        popularAuthors.length > 0
          ? popularAuthors.join(", ")
          : "Various authors";

      return {
        text: `I'm your AI Book Assistant! 🤖 I can help you with:\n\n📚 **Product Searches:**\n• "Low price books" - Affordable options\n• "High price books" - Premium selections\n• "In stock books" - Available now\n• "Sold out books" - Out of stock items\n• "Top rated books" - Best reviewed\n\n🎓 **Academic Searches:**\n• "Class 11" or "Class 12" - Specific class books\n• "Lab manual physics" - Lab manuals\n• "Made easy psychology" - Made easy series\n• "Sample paper business" - Sample papers\n\n👨‍🏫 **Author Searches:**\n• "Books by ${authorsText}"\n\n💰 **Price Searches:**\n• "₹278" or "₹324" - Books at exact price\n• "Low price" - Cheapest books\n• "High price" - Most expensive books\n\n📚 **Category Searches:**\n• "CBSE books" - CBSE category\n• "ICSE books" - ICSE category\n• "Competitive books" - Competitive exams\n\n📖 **ISBN Search:**\n• "9789394691957" - Find book by ISBN number\n\nJust ask me anything about our ${products.length} books!`,
        products: [],
      };
    }

    // Search for products
    const foundProducts = searchProducts(query);

    if (foundProducts.length > 0) {
      let responseText = generateContextualResponse(query, foundProducts);

      return {
        text: responseText,
        products: foundProducts.slice(0, 4),
      };
    }

    // Non-book related queries
    if (
      !query.includes("book") &&
      !query.includes("class") &&
      !query.includes("study") &&
      !query.includes("price") &&
      !query.includes("stock") &&
      !query.includes("author") &&
      !products.some(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.author?.toLowerCase().includes(query) ||
          p.sub_categories?.some((cat) => cat.toLowerCase().includes(query))
      )
    ) {
      return {
        text: "I'm specialized in helping you find books and study materials! 📚\n\nI can only answer questions about:\n• Our book collection\n• Pricing and availability\n• Academic subjects and classes\n• Authors and publications\n\nFor other queries, please contact our customer support. How can I help you find the perfect book today?",
        products: [],
      };
    }

    // Default response for unmatched book queries
    return {
      text: "🔍 I couldn't find specific books for that search. Try these options:\n\n💡 **Quick Searches:**\n• 'Low price books'\n• 'Class 11 books'\n• 'Physics books'\n• 'In stock books'\n• 'Best books'\n\n📞 Or browse our complete collection in the shop section!",
      products: [],
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
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(inputValue);

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: response.text,
        products: response.products,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
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
