import RestaurantCard from "./RestaurantCard";
import { useState, useEffect, useRef } from "react";
import { getRestaurants } from "/src/api/restaurantAPI";
import { useNavigate } from "react-router-dom"; 
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "/src/api/axios";

function RestaurantGrid({ type }) {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); 
  
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
        try {
            const data = await getRestaurants();
            console.log("Fetched restaurants data:", data);
            setRestaurants(data);
        } catch (error) {
            console.error(error);
        }
    };

    fetchRestaurants();
  }, []);

  const isCarousel = restaurants.length > 6;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="px-6 lg:px-20 py-8">
      <h2 className="text-2xl font-bold mb-4">{type} Restaurants</h2>
      
      {/* ========================================== */}
      {/* 📱 MOBILE VIEW: Always a sliding row       */}
      {/* ========================================== */}
      <div className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
        {restaurants.map((r) => {
          const restaurantId = r.id || r._id || r.restaurant_id; 
          
          return (
            // Removed the width constraints, keeping only flex and snap utilities
            <div key={restaurantId} className="flex-shrink-0 snap-start">
              <RestaurantCard 
                {...r} 
                image={getImageUrl(r.image)} 
                onClick={() => {
                  if (restaurantId) navigate(`/restaurant/${restaurantId}`);
                  else console.error("Could not find an ID for this restaurant:", r);
                }} 
              />
            </div>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* 💻 DESKTOP VIEW: Grid OR Arrow Carousel    */}
      {/* ========================================== */}
      {isCarousel ? (
        // 🎠 CAROUSEL LAYOUT WITH ARROWS
        <div className="hidden lg:block relative group">
          
          {/* Left Arrow Button */}
          <button 
            onClick={() => scroll("left")}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-orange-500 hover:scale-110 transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Scrollable Container (Scrollbar Hidden) */}
          <div 
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
          >
            {restaurants.map((r) => {
              const restaurantId = r.id || r._id || r.restaurant_id; 
              return (
                // Removed the width constraints here too!
                <div key={restaurantId} className="flex-shrink-0 snap-start">
                  <RestaurantCard 
                    {...r} 
                    image={getImageUrl(r.image)} 
                    onClick={() => {
                      if (restaurantId) navigate(`/restaurant/${restaurantId}`);
                    }} 
                  />
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button 
            onClick={() => scroll("right")}
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-orange-500 hover:scale-110 transition-all"
          >
            <ChevronRight size={24} />
          </button>
          
        </div>
      ) : (
        // 🍱 STANDARD GRID LAYOUT (6 or fewer items)
        <div className="hidden lg:grid lg:grid-cols-6 gap-5">
          {restaurants.map((r) => {
            const restaurantId = r.id || r._id || r.restaurant_id; 
            return (
              // Just a clean wrapper without forced widths
              <div key={restaurantId}>
                <RestaurantCard 
                  {...r} 
                  image={getImageUrl(r.image)} 
                  onClick={() => {
                    if (restaurantId) navigate(`/restaurant/${restaurantId}`);
                  }} 
                />
              </div>
            );
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </section>
  );
}

export default RestaurantGrid;