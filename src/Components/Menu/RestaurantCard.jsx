function RestaurantCard({ image, name, onClick }) {
  return (
    <button
      onClick={onClick}
      // 1. Added explicit widths (160px for mobile, 220px for desktop)
      // 2. Added `flex flex-col h-full` so the cards stretch evenly
      className="w-[160px] lg:w-[210px] flex flex-col h-full text-left rounded-xl overflow-hidden shadow-sm bg-brand-orange font-poppins
                 cursor-pointer transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-orange"
    >
      {/* 3. Changed h-47 to h-40 (a valid Tailwind class) and kept object-cover */}
      <img src={image} alt={name} className="w-full h-30 lg:h-45 object-cover shrink-0" />
      
      <div className="px-3 py-3 w-full flex-grow flex items-start">
        {/* 4. Added line-clamp-2 to limit text to 2 lines, preventing tall cards */}
        <p className="text-white font-bold text-base line-clamp-2">{name}</p>
      </div>
    </button>
  );
}

export default RestaurantCard;