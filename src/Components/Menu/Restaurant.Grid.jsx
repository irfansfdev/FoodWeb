import RestaurantCard from "./RestaurantCard";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import routing hook
import { getRestaurants } from "../../api/restaurantAPI"; // Adjust path if needed

function RestaurantGrid({ type }) {
  const [restaurants, setRestaurants] = useState([]);
  const scrollContainerRef = useRef(null);
  
  // 2. Initialize navigate function
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await getRestaurants();
        const arrayData = res?.data || (Array.isArray(res) ? res : []);
        setRestaurants(arrayData);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  // ─── CAROUSEL ARROW BUTTON HANDLERS ──────────────────────────────
  const scrollByButton = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Scrolls exactly 3 cards worth of distance on desktop for a clean jump
      const scrollAmount = container.clientWidth * 0.5; 
      
      container.scrollTo({
        left: direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // 3. Create click handler
  const handleRestaurantClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <section className="px-6 lg:px-20 py-8 relative group">
      {/* Hidden scrollbar styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <h2 className="text-2xl font-bold mb-4">{type} Restaurants</h2>
      
      {/* ─── CAROUSEL NAVIGATION ARROWS ─────────────────────────────── */}
      {/* Left Arrow */}
      <button 
        onClick={() => scrollByButton("left")}
        className="hidden lg:flex absolute left-2 top-[55%] -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md items-center justify-center text-gray-700 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button 
        onClick={() => scrollByButton("right")}
        className="hidden lg:flex absolute right-2 top-[55%] -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md items-center justify-center text-gray-700 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* ─── MAIN SCROLL CONTAINER ──────────────────────────────────── */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 lg:gap-5 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory scroll-smooth"
      >
        {restaurants.map((r) => (
          <div 
            key={r.id || r._id} 
            className="flex-shrink-0 w-[160px] lg:w-[calc((100%-100px)/6)] snap-start"
          >
            <RestaurantCard 
              {...r} 
              // 4. Pass the click handler attached to this specific restaurant ID
              onClick={() => handleRestaurantClick(r.id || r._id)} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default RestaurantGrid;