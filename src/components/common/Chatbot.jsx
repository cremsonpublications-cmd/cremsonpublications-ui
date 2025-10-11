import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Book, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

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
        <p className="text-xs text-gray-600 mb-2">Class {product.classes?.[0]} • {product.author}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-blue-600 text-sm">₹{product.mrp}</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            product.status === 'In Stock'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {product.status}
          </span>
        </div>
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
      const availableClasses = [...new Set(products.flatMap(p => p.classes || []))].sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        return numA - numB;
      });

      const availableSubjects = [...new Set(products.flatMap(p => p.sub_categories || []))].sort();
      const inStockCount = products.filter(p => p.status === 'In Stock').length;
      const soldOutCount = products.filter(p => p.status === 'Out of Stock').length;
      const topRatedCount = products.filter(p => (p.rating && p.rating >= 4.0) || p.review_count > 0).length;

      // Format classes text
      let classesText = 'Various classes';
      if (availableClasses.length > 0) {
        const displayClasses = availableClasses.slice(0, 4);
        classesText = displayClasses.map(cls => `Class ${cls}`).join(', ');
        if (availableClasses.length > 4) {
          classesText += ` and ${availableClasses.length - 4} more`;
        }
      }

      // Format subjects text
      let subjectsText = 'Various subjects';
      if (availableSubjects.length > 0) {
        const displaySubjects = availableSubjects.slice(0, 4);
        subjectsText = displaySubjects.join(', ');
        if (availableSubjects.length > 4) {
          subjectsText += ` and ${availableSubjects.length - 4} more`;
        }
      }

      const initialGreeting = `${greeting}! 😊 I'm your AI Book Assistant. I can help you find books by:\n\n1️⃣ **Price** - "low price" or "high price"\n2️⃣ **Availability** - "${inStockCount} in stock" or "${soldOutCount} sold out"\n3️⃣ **Quality** - "${topRatedCount} best books" or "top rated"\n4️⃣ **Class** - ${classesText}\n5️⃣ **Subject** - ${subjectsText}\n\nWhat would you like to explore today?`;

      setMessages([{
        id: 1,
        type: 'bot',
        text: initialGreeting,
        timestamp: new Date()
      }]);
    }
  }, [products, messages.length]);
  const [inputValue, setInputValue] = useState('');
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

    return products.filter(product => {
      // Extract class number from query (e.g., "class 11" -> "11")
      const classMatch = searchTerms.match(/class\s*(\d+)/);
      const classNumber = classMatch ? classMatch[1] : null;

      // Extract subject keywords
      const subjectKeywords = ['physics', 'chemistry', 'mathematics', 'math', 'biology', 'english', 'history', 'geography', 'economics', 'commerce', 'psychology', 'sociology', 'political', 'science'];
      const foundSubject = subjectKeywords.find(subject => searchTerms.includes(subject));

      return (
        product.name.toLowerCase().includes(searchTerms) ||
        product.author?.toLowerCase().includes(searchTerms) ||
        product.description?.toLowerCase().includes(searchTerms) ||
        product.categories?.main_category_name?.toLowerCase().includes(searchTerms) ||

        // Class-based search: match if product has the specific class
        (classNumber && product.classes?.some(cls => cls.toString() === classNumber)) ||

        // Subject-based search: match if product contains the subject
        (foundSubject && product.sub_categories?.some(cat => cat.toLowerCase().includes(foundSubject))) ||

        // General class/subject search
        product.classes?.some(cls => cls.toLowerCase().includes(searchTerms) || searchTerms.includes(cls.toLowerCase())) ||
        product.sub_categories?.some(cat => cat.toLowerCase().includes(searchTerms) || searchTerms.includes(cat.toLowerCase()))
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

  const generateResponse = (userMessage) => {
    const query = userMessage.toLowerCase();

    // Time-based greetings
    if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('good morning') || query.includes('good afternoon') || query.includes('good evening')) {
      const greeting = getTimeBasedGreeting();

      // Get dynamic data from API for greeting response
      const availableClasses = [...new Set(products.flatMap(p => p.classes || []))].sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        return numA - numB;
      });

      const availableSubjects = [...new Set(products.flatMap(p => p.sub_categories || []))].sort();
      const inStockCount = products.filter(p => p.status === 'In Stock').length;
      const soldOutCount = products.filter(p => p.status === 'Out of Stock').length;
      const topRatedCount = products.filter(p => (p.rating && p.rating >= 4.0) || p.review_count > 0).length;

      // Format classes text
      let classesText = 'Various classes';
      if (availableClasses.length > 0) {
        const displayClasses = availableClasses.slice(0, 3);
        classesText = displayClasses.map(cls => `Class ${cls}`).join(', ');
        if (availableClasses.length > 3) {
          classesText += ` and more`;
        }
      }

      // Format subjects text
      let subjectsText = 'Various subjects';
      if (availableSubjects.length > 0) {
        const displaySubjects = availableSubjects.slice(0, 3);
        subjectsText = displaySubjects.join(', ');
        if (availableSubjects.length > 3) {
          subjectsText += ` and more`;
        }
      }

      return {
        text: `${greeting}! 😊 I'm your AI Book Assistant. I can help you find books by:\n\n1️⃣ **Price** - "low price" or "high price"\n2️⃣ **Availability** - "${inStockCount} in stock" or "${soldOutCount} sold out"\n3️⃣ **Quality** - "${topRatedCount} best books" or "top rated"\n4️⃣ **Class** - ${classesText}\n5️⃣ **Subject** - ${subjectsText}\n\nWhat would you like to explore?`,
        products: []
      };
    }

    // Price-based filtering
    if (query.includes('low price') || query.includes('cheap') || query.includes('affordable')) {
      const lowPriceBooks = products
        .filter(p => p.mrp <= 350)
        .sort((a, b) => a.mrp - b.mrp)
        .slice(0, 4);

      return {
        text: `💰 Here are our most affordable books (under ₹350):`,
        products: lowPriceBooks
      };
    }

    if (query.includes('high price') || query.includes('premium') || query.includes('expensive')) {
      const highPriceBooks = products
        .filter(p => p.mrp >= 450)
        .sort((a, b) => b.mrp - a.mrp)
        .slice(0, 4);

      return {
        text: `💎 Here are our premium books (₹450 and above):`,
        products: highPriceBooks
      };
    }

    // Stock-based filtering
    if (query.includes('sold out') || query.includes('out of stock')) {
      const soldOutBooks = products
        .filter(p => p.status === 'Out of Stock')
        .slice(0, 4);

      return {
        text: `📋 Currently sold out books (we're restocking soon):`,
        products: soldOutBooks
      };
    }

    if (query.includes('in stock') || query.includes('available')) {
      const availableBooks = products
        .filter(p => p.status === 'In Stock')
        .slice(0, 4);

      return {
        text: `✅ Books currently available for immediate delivery:`,
        products: availableBooks
      };
    }

    // Rating-based filtering
    if (query.includes('best') || query.includes('top rated') || query.includes('high review') || query.includes('popular')) {
      const topRatedBooks = products
        .filter(p => p.rating >= 4.0 || p.review_count > 0)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);

      if (topRatedBooks.length > 0) {
        return {
          text: `⭐ Our highest rated and most popular books:`,
          products: topRatedBooks
        };
      }
    }

    // Help queries
    if (query.includes('help') || query.includes('what can you do')) {
      // Get dynamic data for help response
      const availableClasses = [...new Set(products.flatMap(p => p.classes || []))].sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        return numA - numB;
      });

      const availableSubjects = [...new Set(products.flatMap(p => p.sub_categories || []))].sort();

      const classesText = availableClasses.length > 0
        ? availableClasses.map(cls => `Class ${cls}`).join(', ')
        : 'Various classes';

      const subjectsText = availableSubjects.length > 0
        ? availableSubjects.slice(0, 5).join(', ') + (availableSubjects.length > 5 ? ' and more' : '')
        : 'Physics, Math, Chemistry and more';

      return {
        text: `I'm your AI Book Assistant! 🤖 I can help you with:\n\n📚 **Product Searches:**\n• Low price books\n• High price books  \n• In stock books\n• Sold out books\n• Top rated books\n\n🎓 **Academic Searches:**\n• Class-wise books (${classesText})\n• Subject books (${subjectsText})\n• Author-specific books\n• Lab manuals & worksheets\n\nJust ask me anything about our books!`,
        products: []
      };
    }

    // Search for products
    const products = searchProducts(query);

    if (products.length > 0) {
      let responseText = `📖 I found ${products.length} book${products.length > 1 ? 's' : ''} matching your search:`;

      // Add specific context based on what they searched for
      if (query.includes('class') || query.includes('11th') || query.includes('12th') || query.includes('9th') || query.includes('10th')) {
        responseText = `🎓 Here are the books available for your class:`;
      } else if (query.includes('physics') || query.includes('chemistry') || query.includes('mathematics') || query.includes('science')) {
        responseText = `🔬 Here are the science and mathematics books:`;
      } else if (query.includes('psychology') || query.includes('sociology') || query.includes('political')) {
        responseText = `📚 Here are the social science books:`;
      } else if (query.includes('business') || query.includes('economics') || query.includes('commerce')) {
        responseText = `💼 Here are the commerce and business books:`;
      }

      return {
        text: responseText,
        products: products.slice(0, 4)
      };
    }

    // Non-book related queries
    if (!query.includes('book') && !query.includes('class') && !query.includes('study') &&
        !query.includes('price') && !query.includes('stock') && !query.includes('author') &&
        !products.some(p =>
          p.name.toLowerCase().includes(query) ||
          p.author?.toLowerCase().includes(query) ||
          p.sub_categories?.some(cat => cat.toLowerCase().includes(query))
        )) {

      return {
        text: "I'm specialized in helping you find books and study materials! 📚\n\nI can only answer questions about:\n• Our book collection\n• Pricing and availability\n• Academic subjects and classes\n• Authors and publications\n\nFor other queries, please contact our customer support. How can I help you find the perfect book today?",
        products: []
      };
    }

    // Default response for unmatched book queries
    return {
      text: "🔍 I couldn't find specific books for that search. Try these options:\n\n💡 **Quick Searches:**\n• 'Low price books'\n• 'Class 11 books'\n• 'Physics books'\n• 'In stock books'\n• 'Best books'\n\n📞 Or browse our complete collection in the shop section!",
      products: []
    };
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(inputValue);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.text,
        products: response.products,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />

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
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
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
                        View all books <ArrowRight size={14} className="inline ml-1" />
                      </Link>
                    )}
                  </div>
                )}

                <div className={`flex items-center gap-2 mt-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'bot' && (
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot size={10} className="text-white" />
                    </div>
                  )}
                  {message.type === 'user' && (
                    <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                      <User size={10} className="text-gray-600" />
                    </div>
                  )}
                  <span className="text-xs text-gray-500 font-medium">
                    {message.timestamp.toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'Asia/Kolkata'
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
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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