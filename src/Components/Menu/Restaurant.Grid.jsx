import RestaurantCard from "./RestaurantCard";
import { useState, useEffect } from "react";
import { getRestaurants } from "/src/api/restaurantAPI";
import { useNavigate } from "react-router-dom"; 

function RestaurantGrid({ type }) {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchRestaurants = async () => {
        try {
            const data = await getRestaurants();
            console.log("Fetched restaurants data:", data); // Check your console to see the data structure!
            setRestaurants(data);
        } catch (error) {
            console.error(error);
        }
    };

    fetchRestaurants();
  }, []);

  return (
    <section className="px-6 lg:px-20 py-8">
      <h2 className="text-2xl font-bold mb-4">{type} Restaurants</h2>
      
      {/* Mobile: sliding row */}
      <div className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
        {restaurants.map((r) => {
          // This safely finds the ID no matter what your backend named it
          const restaurantId = r.id || r._id || r.restaurant_id; 
          
          return (
            <div key={restaurantId} className="flex-shrink-0 w-[160px] snap-start">
              <RestaurantCard 
                {...r} 
                image={`http://127.0.0.1:8000${r.image}`} 
                onClick={() => {
                  if (restaurantId) {
                    navigate(`/restaurant/${restaurantId}`);
                  } else {
                    console.error("Could not find an ID for this restaurant:", r);
                  }
                }} 
              />
            </div>
          );
        })}
      </div>

      {/* Desktop: unchanged grid */}
      <div className="hidden lg:grid grid-cols-6 gap-5">
        {restaurants.map((r) => {
          // This safely finds the ID no matter what your backend named it
          const restaurantId = r.id || r._id || r.restaurant_id; 
          
          return (
            <RestaurantCard 
              key={restaurantId} 
              {...r} 
              image={`http://127.0.0.1:8000${r.image}`} 
              onClick={() => {
                if (restaurantId) {
                  navigate(`/restaurant/${restaurantId}`);
                } else {
                  console.error("Could not find an ID for this restaurant:", r);
                }
              }} 
            />
          );
        })}
      </div>

    </section>
  );
}

export default RestaurantGrid;