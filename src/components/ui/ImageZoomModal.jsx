import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageZoomModal = ({ isOpen, images, currentIndex, productName }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(currentIndex || 0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    if (currentIndex >= 0) {
      setSelectedImageIndex(currentIndex);
    }
  }, [currentIndex]);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  const handlePrevious = () => {
    setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  const handleNext = () => {
    setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[selectedImageIndex];

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden rounded-lg group">
      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white hover:text-gray-300 transition-all p-2 rounded-full bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white hover:text-gray-300 transition-all p-2 rounded-full bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 z-20 bg-black/50 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          {selectedImageIndex + 1} / {images.length}
        </div>
      )}

      {/* Main image with hover zoom */}
      <div
        ref={imageRef}
        className="relative w-full h-full overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
      >
        <img
          src={currentImage}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-[2]"
          style={{
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
          }}
          draggable={false}
        />
      </div>

      {/* Thumbnail strip for multiple images */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`w-8 h-8 rounded border-2 overflow-hidden transition-all ${
                index === selectedImageIndex
                  ? 'border-white'
                  : 'border-gray-400 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageZoomModal;
