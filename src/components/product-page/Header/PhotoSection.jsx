import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "../../../context/WishlistContext";

const PhotoSection = ({ data }) => {
  const [selected, setSelected] = useState(data.main_image);
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <div className="flex flex-col space-y-3">
      {/* Main Image */}
      <div className="relative flex items-center justify-center bg-[#F0EEED] rounded-[13px] sm:rounded-[20px] w-full mx-auto h-[400px] sm:h-[450px] lg:h-[500px] overflow-hidden p-4">
        <img
          src={selected}
          className="w-auto h-auto max-w-full max-h-full object-contain hover:scale-105 transition-all duration-500"
          alt={data.name}
        />
        <button
          onClick={() => toggleWishlist(data)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
          title={isInWishlist(data.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-200 ${
              isInWishlist(data.id)
                ? "text-red-500 fill-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>
      </div>

      {/* Thumbnail Images at Bottom */}
      <div className="flex space-x-3 w-full items-center justify-start overflow-x-auto py-2">
        {/* Main Image Thumbnail */}
        {data?.main_image && (
          <button
            type="button"
            className="bg-[#F0EEED] rounded-[8px] w-[80px] h-[80px] flex-shrink-0 overflow-hidden p-1 border-2 border-transparent hover:border-gray-300"
            onClick={() => setSelected(data.main_image)}
          >
            <img
              src={data.main_image}
              className="w-full h-full object-contain hover:scale-105 transition-all duration-500"
              alt={data.name}
            />
          </button>
        )}

        {/* Side Images Thumbnails */}
        {data.side_images && Array.isArray(data.side_images) && data.side_images.map((photo, index) => (
          <button
            key={index}
            type="button"
            className="bg-[#F0EEED] rounded-[8px] w-[80px] h-[80px] flex-shrink-0 overflow-hidden p-1 border-2 border-transparent hover:border-gray-300"
            onClick={() => setSelected(photo)}
          >
            <img
              src={photo}
              className="w-full h-full object-contain hover:scale-105 transition-all duration-500"
              alt={`${data.name} - Image ${index + 1}`}
            />
          </button>
        ))}
      </div>

    </div>
  );
};

export default PhotoSection;
