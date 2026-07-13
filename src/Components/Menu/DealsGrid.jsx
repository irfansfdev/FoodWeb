import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // 1. Import Link for navigation
import DealCard from "./dealCard";
import { getDeals, getRestaurants } from "/src/api/restaurantAPI";

const tabs = [
  "Pizza & Fast Food",
  "Sushi",
  "Vegan",
  "Others",
];

function DealsGrid() {
  const [activeTab, setActiveTab] = useState(0);
  const [deals, setDeals] = useState([]);
  const [restaurantMap, setRestaurantMap] = useState({});
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [dealsData, restaurantsData] = await Promise.all([
          getDeals(),
          getRestaurants().catch(() => [])
        ]);

        setDeals(dealsData);

        if (Array.isArray(restaurantsData)) {
          const rMap = {};
          restaurantsData.forEach((res) => {
            if (res.id && res.name) {
              rMap[res.id] = res.name;
            }
          });
          setRestaurantMap(rMap);
        }
      } catch (error) {
        console.error("Error loading data in DealsGrid:", error);
      }
    };
  
    fetchAllData();
  }, []);

  const filteredDeals = deals.filter((deal) => {
    const itemCategories = deal.items?.map(item => 
      item.menu_item?.category?.name?.toLowerCase() || ""
    ) || [];

    const dealTitle = deal.name?.toLowerCase() || "";
    const dealDesc = deal.description?.toLowerCase() || "";
    const foodNames = deal.items?.map(item => item.menu_item?.name?.toLowerCase() || "") || [];

    const allClues = [...itemCategories, ...foodNames, dealTitle, dealDesc];

    if (tabs[activeTab] === "Others") {
      const mainCategories = ["vegan", "sushi", "pizza", "fast food"];
      const matchesMain = allClues.some(clue => 
        mainCategories.some(keyword => clue.includes(keyword))
      );
      return !matchesMain;
    }

    const currentTabLabel = tabs[activeTab].toLowerCase();
    if (currentTabLabel.includes("&")) {
      const keywords = currentTabLabel.split("&").map(k => k.trim());
      return allClues.some(clue => keywords.some(keyword => clue.includes(keyword)));
    }

    return allClues.some(clue => clue.includes(currentTabLabel));
  });

  const getRestaurantName = (deal) => {
    if (deal.restaurant?.name) return deal.restaurant.name;
    if (deal.restaurant_id && restaurantMap[deal.restaurant_id]) {
      return restaurantMap[deal.restaurant_id];
    }

    if (deal.items && deal.items.length > 0) {
      for (const item of deal.items) {
        if (item.menu_item?.restaurant?.name) {
          return item.menu_item.restaurant.name;
        }
        const resId = item.restaurant_id || item.menu_item?.restaurant_id || item.menu_item?.restaurant;
        if (resId && restaurantMap[resId]) {
          return restaurantMap[resId];
        }
      }
    }
    return "Order.uk Exclusive"; 
  };

  return (
    <section className="px-6 lg:px-20 py-8">
      <div className="flex items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Up to -40% 🎊 Order.uk exclusive deals
        </h2>

        <select
          value={activeTab}
          onChange={(e) => setActiveTab(Number(e.target.value))}
          className="lg:hidden ml-auto mb-4 border border-orange-500 rounded-full px-4 py-2 text-sm font-medium text-black bg-white cursor-pointer"
        >
          {tabs.map((tab, index) => (
            <option key={tab} value={index}>{tab}</option>
          ))}
        </select>

        <nav className="hidden lg:flex flex-wrap justify-end gap-1 mb-4 ml-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`px-4 sm:px-6 py-2 rounded-full transition-all duration-300 text-xs sm:text-sm md:text-base whitespace-nowrap cursor-pointer ${
                activeTab === index
                  ? "border border-orange-500 bg-white font-bold text-black"
                  : "border border-transparent font-medium text-gray-700 hover:bg-black/5 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile View Wrapped in Link */}
      <div className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
        {filteredDeals.map((deal) => (
          <Link 
            to={`/deals/${deal.id}`} 
            key={deal.id} 
            className="snap-start shrink-0 block no-underline text-inherit"
          >
            <DealCard 
              image={deal.image?.startsWith("http") ? deal.image : `http://127.0.0.1:8000${deal.image}`} 
              name={deal.name} 
              restaurantLabel={getRestaurantName(deal)} 
              discount={`£${deal.combo_price}`} 
              compact 
            />
          </Link>
        ))}
      </div>

      {/* Desktop View Wrapped in Link */}
      <div className="hidden lg:grid grid-cols-3 gap-5">
        {filteredDeals.map((deal) => (
          <Link 
            to={`/deals/${deal.id}`} 
            key={deal.id} 
            className="block no-underline text-inherit transition-transform duration-200 hover:scale-[1.01]"
          >
            <DealCard 
              image={deal.image?.startsWith("http") ? deal.image : `http://127.0.0.1:8000${deal.image}`} 
              name={deal.name} 
              restaurantLabel={getRestaurantName(deal)} 
              discount={`£${deal.combo_price}`} 
            />
          </Link>
        ))}
      </div>
      
      {filteredDeals.length === 0 && (
        <div className="col-span-full py-10 text-center text-gray-500 font-medium">
          No deals match this category right now!
        </div>
      )}
    </section>
  );
}

export default DealsGrid;