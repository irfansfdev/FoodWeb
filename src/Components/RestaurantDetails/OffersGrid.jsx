import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; 
import OfferCard from "./OfferCard";
import { getDeals, getRestaurants } from "/src/api/restaurantAPI";

// 1. Add searchQuery as a prop
function OffersGrid({ selectedCategory = "All", searchQuery = "" }) {
  const { id } = useParams();
  
  const [offers, setOffers] = useState([]);
  const [restaurantName, setRestaurantName] = useState("Order.uk Exclusive");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [dealsData, restaurantsData] = await Promise.all([
          getDeals(),
          getRestaurants().catch(() => [])
        ]);

        if (Array.isArray(restaurantsData)) {
          const currentRes = restaurantsData.find((r) => String(r.id) === String(id));
          if (currentRes) {
            setRestaurantName(currentRes.name);
          }
        }

        const restaurantOffers = dealsData.filter((deal) => {
          const dealRestaurantId = deal.restaurant?.id || deal.restaurant_id || deal.restaurant;
          
          const matchesItemRestaurant = deal.items?.some(item => {
            const itemResId = item.restaurant_id || item.menu_item?.restaurant_id || item.menu_item?.restaurant?.id || item.menu_item?.restaurant;
            return String(itemResId) === String(id);
          });

          return String(dealRestaurantId) === String(id) || matchesItemRestaurant;
        });

        setOffers(restaurantOffers);
      } catch (error) {
        console.error("Error loading data in OffersGrid:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  // 2. Filter by BOTH category AND search query
  const filteredOffers = offers.filter((offer) => {
    // Category check
    const matchesCategory = 
      !selectedCategory || 
      selectedCategory === "All" || 
      selectedCategory === "Offers" ||
      offer.items?.some((item) => item.menu_item?.category?.name === selectedCategory);

    // Search check
    const safeSearchQuery = (searchQuery || "").toLowerCase();
    const offerName = (offer.name || "").toLowerCase();
    const matchesSearch = offerName.includes(safeSearchQuery);

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-gray-500 font-medium text-xl">
        Loading offers...
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 font-poppins">
        No offers found for this restaurant.
      </div>
    );
  }

  return (
    <section className="px-6 lg:px-20 py-8">
      <div className="flex items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold">
          Up to -40% 🎊 {restaurantName} exclusive deals
        </h2>
      </div>

      {filteredOffers.length === 0 ? (
        <div className="text-center py-10 text-gray-400 font-poppins">
          No offers match your search.
        </div>
      ) : (
        <>
          {/* Mobile View */}
          <div className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
            {filteredOffers.map((offer) => (
              <Link 
                to={`/deals/${offer.id}`} 
                key={offer.id} 
                className="snap-start shrink-0 block no-underline text-inherit"
              >
                <OfferCard 
                  image={offer.image?.startsWith("http") ? offer.image : `http://127.0.0.1:8000${offer.image}`} 
                  name={offer.name} 
                  restaurantLabel={restaurantName} 
                  discount={`£${offer.combo_price}`} 
                  compact 
                />
              </Link>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden lg:grid grid-cols-3 gap-5">
            {filteredOffers.map((offer) => (
              <Link 
                to={`/deals/${offer.id}`} 
                key={offer.id} 
                className="block no-underline text-inherit transition-transform duration-200 hover:scale-[1.01]"
              >
                <OfferCard 
                  image={offer.image?.startsWith("http") ? offer.image : `http://127.0.0.1:8000${offer.image}`} 
                  name={offer.name} 
                  restaurantLabel={restaurantName} 
                  discount={`£${offer.combo_price}`} 
                />
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default OffersGrid;