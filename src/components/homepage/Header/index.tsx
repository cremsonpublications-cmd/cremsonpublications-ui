import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import banner1 from "@/assets/banner/banner1.jpg";
import banner2 from "@/assets/banner/banner2.png";
import banner3 from "@/assets/banner/banner3.jpg";

const Header = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [progress, setProgress] = useState(0);

  // Use local banner images
  const bannerImages = [banner1, banner2, banner3];

  useEffect(() => {
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentImage((current) => (current + 1) % bannerImages.length);
          return 0;
        }
        return prev + 100 / 30; // 3000ms / 100ms = 30 steps
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [currentImage, bannerImages.length]);

  const handleIndicatorClick = (index) => {
    setCurrentImage(index);
    setProgress(0);
  };

  const goToPrevious = () => {
    setCurrentImage((current) => (current - 1 + bannerImages.length) % bannerImages.length);
    setProgress(0);
  };

  const goToNext = () => {
    setCurrentImage((current) => (current + 1) % bannerImages.length);
    setProgress(0);
  };

  return (
    <header className="header relative overflow-hidden h-[200px] sm:h-[500px]" id="home">
      {/* Background banner image - single image, no heavy transitions */}
      <div className="absolute inset-0">
        <img
          src={bannerImages[currentImage]}
          alt={`Banner ${currentImage + 1}`}
          className="w-full h-full object-contain transition-opacity duration-300 ease-in-out"
          style={{ willChange: 'opacity' }}
        />
      </div>

      {/* Carousel indicators - progress lines */}
      {bannerImages.length > 1 && (
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex z-20"
          style={{ gap: "15px" }}
        >
          {bannerImages.map((_, index) => (
            <button
              key={index}
              className="relative w-12 h-1 bg-white/30 rounded-full overflow-hidden"
              onClick={() => handleIndicatorClick(index)}
            >
              <div
                className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-100"
                style={{
                  width: currentImage === index ? `${progress}%` : "0%",
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200"
      >
        <ChevronRight size={24} className="text-white" />
      </button>
    </header>
  );
};

export default Header;
