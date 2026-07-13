import RestaurantCard from "./RestaurantCard";
import { useState } from "react";
import { useEffect } from "react";
import { getRestaurants } from "/src/api/restaurantAPI";

function RestaurantGrid({ type }) {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {

    const fetchRestaurants = async () => {
        try {
            const data = await getRestaurants();
            // console.log(Array.isArray(data)); // true or false
            console.log(data);
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
        {restaurants.map((r) => (
          <div key={r.id} className="flex-shrink-0 w-[160px] snap-start">
            <RestaurantCard {...r} image={`http://127.0.0.1:8000${r.image}`} />
          </div>
        ))}
      </div>

      {/* Desktop: unchanged grid */}
      <div className="hidden lg:grid grid-cols-6 gap-5">
        {restaurants.map((r) => (
          <RestaurantCard key={r.id} {...r} image={`http://127.0.0.1:8000${r.image}`} />
        ))}
      </div>

    </section>
  );
}

export default RestaurantGrid;