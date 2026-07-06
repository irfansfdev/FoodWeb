import RestaurantCard from "./RestaurantCard";

const restaurantsData = [
  { id: 1, image: "/src/assets/HomeAssets/restaurant1.png", name: "Restaurant 1" },
  { id: 2, image: "/src/assets/HomeAssets/restaurant2.png", name: "Restaurant 2" },
  { id: 3, image: "/src/assets/HomeAssets/restaurant3.png", name: "Restaurant 3" },
  { id: 4, image: "/src/assets/HomeAssets/restaurant4.png", name: "Restaurant 4" },
  { id: 5, image: "/src/assets/HomeAssets/restaurant5.png", name: "Restaurant 5" },
  { id: 6, image: "/src/assets/HomeAssets/restaurant6.png", name: "Restaurant 6" },
];

function RestaurantGrid({ title }) {
  return (
    <section className="px-20 py-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <div className="grid grid-cols-6 gap-5">
        {restaurantsData.map((restaurant) => (
          <RestaurantCard key={restaurant.id} {...restaurant} />
        ))}
      </div>
    </section>
  );
}

export default RestaurantGrid;