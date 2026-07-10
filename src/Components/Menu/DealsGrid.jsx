import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DealCard from "./dealCard"; 
import { fetchDealsAPI } from "../../api/DealsAPI";

const tabs = [
  "Pizza & Fast Food",
  "Sushi",
  "Vegan",
  "Others",
];

function DealsGrid() {
  const [activeTab, setActiveTab] = useState(0);
  const [liveDeals, setLiveDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const getDeals = async () => {
      try {
        setLoading(true);
        const responseData = await fetchDealsAPI();
        
        if (Array.isArray(responseData)) {
          setLiveDeals(responseData);
        } else if (responseData && Array.isArray(responseData.data)) {
          setLiveDeals(responseData.data);
        } else {
          setLiveDeals([]);
        }
      } catch (err) {
        console.error("Failed to load deals:", err);
      } finally {
        setLoading(false);
      }
    };
    getDeals();
  }, []);

  const filteredDeals = liveDeals.filter(deal => {
    if (activeTab === 0) return true; 
    
    const targetTab = tabs[activeTab].toLowerCase();
    const searchableText = `${deal.name || ''} ${deal.description || ''}`.toLowerCase();
    
    if (targetTab === "pizza & fast food") {
      return searchableText.includes("pizza") || searchableText.includes("fast food") || searchableText.includes("burger");
    }
    return searchableText.includes(targetTab);
  });

  const handleDealClick = (dealId) => {
    navigate(`/deal/${dealId}`);
  };

  if (loading) return null;

  return (
    <section className="px-6 lg:px-20 py-8">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[16px] md:text-[32px] font-bold text-brand-dark dark:text-white">
          <span className="md:hidden">Up to -40% Discount Offers 🎊</span>
          <span className="hidden md:inline">Up to -40% 🎊 Order.uk exclusive deals</span>
        </h2>

        {/* Mobile Dropdown */}
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(Number(e.target.value))}
          className="lg:hidden ml-auto border border-[#fc8a06] rounded-full text-center px-4 py-2 text-sm font-medium text-black bg-white outline-none"
        >
          {tabs.map((tab, index) => (
            <option key={tab} value={index}>{tab}</option>
          ))}
        </select>

        {/* Desktop Tabs */}
        <nav className="hidden lg:flex gap-4 ml-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`px-5 py-2.5 rounded-full transition-all duration-300 text-[15px] cursor-pointer ${
                activeTab === index
                  ? "border border-[#fc8a06] bg-white font-bold text-black"
                  : "border border-transparent font-medium text-gray-500 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Grid Layout strictly matching the screenshot */}
      {filteredDeals.length === 0 ? (
        <div className="text-gray-400 text-sm py-4">
          No live offers available under this category currently.
        </div>
      ) : (
        <>
          {/* MOBILE: Sliding Row */}
          <div className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
            {filteredDeals.slice(0, 3).map((deal) => (
              <div key={deal.id || deal._id} className="w-[280px] flex-shrink-0 snap-start">
                <DealCard 
                  {...deal} 
                  onClick={() => handleDealClick(deal.id || deal._id)} 
                />
              </div>
            ))}
          </div>

          {/* DESKTOP: 3-Column Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {filteredDeals.slice(0, 3).map((deal) => (
              <DealCard 
                key={deal.id || deal._id} 
                {...deal} 
                onClick={() => handleDealClick(deal.id || deal._id)} 
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default DealsGrid;