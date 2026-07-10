import React from 'react';

function CategoryCard({ image, name, restaurantCount, onClick }) {
  const baseURL = 'http://127.0.0.1:8000';

  // Bulletproof image resolver for backend media
  let imageUrl = '/src/assets/HomeAssets/category1.png'; // Local fallback
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
      className="w-full text-left rounded-xl overflow-hidden shadow-sm bg-[#fc8a06] font-poppins cursor-pointer transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#fc8a06]"
    >
      <div className="w-full rounded-xl overflow-hidden shadow-sm bg-white font-poppins">
        <img 
          src={imageUrl} 
          alt={name || "Category"} 
          className="w-full h-47 object-cover" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/src/assets/HomeAssets/category1.png';
          }}
        />
        <div className="px-3 py-3">
          {/* Now using the correct category name */}
          <p className="text-black font-bold text-base line-clamp-1">{name}</p>
          
          {/* Dynamically rendering our calculated unique restaurant count */}
          <p className="text-[#fc8a06] text-sm font-medium">
            {restaurantCount} {restaurantCount === 1 ? 'Restaurant' : 'Restaurants'}
          </p>
        </div>
      </div>
    </button>
  );
}

export default CategoryCard;