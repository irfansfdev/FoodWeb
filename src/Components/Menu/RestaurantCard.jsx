import React from 'react';

function RestaurantCard({ image, name, onClick }) {
  const baseURL = 'http://127.0.0.1:8000';
  
  // Image path resolver (handles both full URLs and partial /media/ paths)
  let imageUrl = '/src/assets/HomeAssets/restaurant1.png'; // Fallback image
  if (image) {
    if (image.startsWith('http')) {
      imageUrl = image;
    } else if (image.startsWith('/')) {
      imageUrl = `${baseURL}${image}`;
    } else {
      imageUrl = `${baseURL}/media/${image}`;
    }
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl overflow-hidden shadow-sm bg-[#fc8a06] font-poppins cursor-pointer transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#fc8a06] block"
    >
      <img 
        src={imageUrl} 
        alt={name || "Restaurant"} 
        className="w-full h-[140px] md:h-47 object-cover" 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/src/assets/HomeAssets/restaurant1.png'; // Fallback on broken link
        }}
      />
      <div className="px-3 py-3">
        <p className="text-white font-bold text-base line-clamp-1">{name}</p>
      </div>
    </button>
  );
}

export default RestaurantCard;