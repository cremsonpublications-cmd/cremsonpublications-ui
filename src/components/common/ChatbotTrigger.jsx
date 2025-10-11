import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Chatbot from "./Chatbot";

const ChatbotTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-40 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
        style={{ display: isOpen ? "none" : "block" }}
      >
        <MessageCircle
          size={20}
          className="group-hover:scale-110 transition-transform"
        />

        {/* Pulse animation */}
        <span className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-25"></span>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          Ask about our books
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-gray-800 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
        </div>
      </button>

      {/* Chatbot Dialog */}
      <Chatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatbotTrigger;
