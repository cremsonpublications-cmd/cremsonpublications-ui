import React, { useEffect, useState } from "react";

const LoadingSpinner = ({ title = "Loading", message = "Please wait" }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full mx-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-gray-600 font-medium">
            {message}
            {dots}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
