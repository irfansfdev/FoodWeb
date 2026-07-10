import React from 'react';

const DealCard = ({ id, _id, name, image, combo_price, onClick }) => {
  const baseURL = 'http://127.0.0.1:8000';
  
  // Image path resolver
  let imageUrl = '/src/assets/HomeAssets/deal1.png';
  if (image) {
    if (image.startsWith('http')) {
      imageUrl = image;
    } else if (image.startsWith('/')) {
      imageUrl = `${baseURL}${image}`;
    } else {
      imageUrl = `${baseURL}/media/${image}`;
    }
  }

  // Dynamic deal number based on your DB ID
  const dealNumber = id || _id || '1';

  return (
    <button 
      onClick={onClick}
      className="relative w-full text-left h-[200px] sm:h-[240px] md:h-[260px] rounded-[16px] overflow-hidden shadow-sm group cursor-pointer transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#fc8a06] block"
    >
      {/* Full Background Image */}
      <img 
        src={imageUrl} 
        alt={name || `Deal ${dealNumber}`} 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/src/assets/HomeAssets/deal1.png';
        }}
      />

      {/* Dark Gradient Overlay (bottom heavy for text readability) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

      {/* Content strictly matching your uploaded screenshot */}
      <div className="absolute bottom-0 left-0 p-5 flex flex-col">
        {/* Deal ID */}
        <h3 className="text-white text-[18px] md:text-[22px] font-bold leading-tight mb-1">
          Deal {dealNumber}
        </h3>
        
        {/* Deal Name (e.g., Small Family Deal) */}
        <p className="text-gray-200 text-[13px] md:text-[15px] font-medium mb-2">
          {name || "Exclusive Offer"}
        </p>

        {/* Combo Price */}
        {combo_price && (
          <div className="text-[#fc8a06] text-[16px] md:text-[20px] font-bold">
            £{Number(combo_price).toFixed(2)}
          </div>
        )}
      </div>
    </button>
  );
};

export default DealCard;