import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; 
import DealCard from "./dealCard";
import { getDeals, getRestaurants } from "/src/api/restaurantAPI";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "/src/api/axios";

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
  
  const scrollRef = useRef(null);

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
        if (item.menu_item?.restaurant?.name) return item.menu_item.restaurant.name;
        const resId = item.restaurant_id || item.menu_item?.restaurant_id || item.menu_item?.restaurant;
        if (resId && restaurantMap[resId]) return restaurantMap[resId];
      }
    }
    return "Order.uk Exclusive"; 
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const isCarousel = filteredDeals.length > 3;

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

      {/* ========================================== */}
      {/*  MOBILE VIEW: Perfectly sized compact row*/}
      {/* ========================================== */}
      <div className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
        {filteredDeals.map((deal) => (
          <Link 
            to={`/deals/${deal.id}`} 
            key={deal.id} 
            // FIXED: Set to w-[150px] to match the exact dimensions of your compact card
            className="w-[150px] snap-start shrink-0 block no-underline text-inherit"
          >
            <DealCard 
              image={getImageUrl(deal.image)} 
              name={deal.name} 
              restaurantLabel={getRestaurantName(deal)} 
              discount={`$${deal.combo_price}`} 
              compact 
            />
          </Link>
        ))}
      </div>

      {/* ========================================== */}
      {/* 💻 DESKTOP VIEW: Grid OR 3-Column Carousel */}
      {/* ========================================== */}
      {isCarousel ? (
        <div className="hidden lg:block relative group">
          <button 
            onClick={() => scroll("left")} 
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-orange-500 hover:scale-110 transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          <div 
            ref={scrollRef} 
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-2" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredDeals.map((deal) => (
              <Link 
                to={`/deals/${deal.id}`} 
                key={deal.id} 
                // FIXED: calc(33.333% - 14px) forces exactly 3 cards to be visible at once!
                className="w-[calc(33.333%-14px)] min-w-[280px] flex-shrink-0 snap-start block no-underline text-inherit transition-transform duration-200 hover:scale-[1.01]"
              >
                <DealCard 
                  image={getImageUrl(deal.image)} 
                  name={deal.name} 
                  restaurantLabel={getRestaurantName(deal)} 
                  discount={`$${deal.combo_price}`} 
                />
              </Link>
            ))}
          </div>

          <button 
            onClick={() => scroll("right")} 
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-orange-500 hover:scale-110 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      ) : (
        <div className="hidden lg:grid lg:grid-cols-3 gap-5">
          {filteredDeals.map((deal) => (
            <Link 
              to={`/deals/${deal.id}`} 
              key={deal.id} 
              className="block no-underline text-inherit transition-transform duration-200 hover:scale-[1.01]"
            >
              <DealCard 
                image={getImageUrl(deal.image)} 
                name={deal.name} 
                restaurantLabel={getRestaurantName(deal)} 
                discount={`$${deal.combo_price}`} 
              />
            </Link>
          ))}
        </div>
      )}
      
      {filteredDeals.length === 0 && (
        <div className="col-span-full py-10 text-center text-gray-500 font-medium">
          No deals match this category right now!
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `.scrollbar-hide::-webkit-scrollbar { display: none; }`}} />
    </section>
  );
}

export default DealsGrid;