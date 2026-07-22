import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import { useTheme } from "../../Context/ThemeContext";
import { getRestaurants } from "/src/api/restaurantAPI"; 
import api from "../../api/axios"; // 

import backgroundImage from "../../assets/Group 23.png";
import backgroundDarkImage from "../../assets/Group 23 Dark.png";
import reviewImage from "../../assets/Rectangle Review.png";
import Motocross from "../../assets/Motocross.png";
import OrderComplete from "../../assets/Order Completed.png";

// Fallbacks for images
import burgerImage from "../../assets/Rectangle 44.png";

// 👈 Helper function updated to construct image URLs dynamically
const formatImageUrl = (urlStr) => {
  if (!urlStr) return burgerImage; 
  if (urlStr.startsWith("http")) return urlStr;

  const baseUrl = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/$/, "") : "";
  const path = urlStr.startsWith("/") ? urlStr : `/${urlStr}`;

  return `${baseUrl}${path}`;
};

export default function RestaurantHero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state to prevent layout flashes

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        setLoading(true);
        const allRestaurants = await getRestaurants();
        
        // Find the specific restaurant matching the URL ID
        const matchedRestaurant = allRestaurants.find((r) => String(r.id) === String(id));
        setRestaurant(matchedRestaurant);
      } catch (error) {
        console.error("Error fetching restaurant info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurantInfo();
    } else {
      setLoading(false);
    }
  }, [id]);

  // 1. LOADING STATE: Clean loading indicator while waiting for the database
  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#FC8A06]"></div>
      </div>
    );
  }

  // 2. ERROR STATE: If the restaurant ID doesn't exist in the DB
  if (!restaurant) {
    return (
      <div className="text-center py-24 px-4">
        <h2 className="text-2xl font-bold text-gray-500 mb-2">Restaurant Not Found</h2>
        <p className="text-gray-400">Please select a valid restaurant from the navigation menu.</p>
      </div>
    );
  }

  // 3. SPECIFIC RESTAURANT RENDER (No fallback/all-restaurant text)
  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-8 xl:px-20 py-6 sm:py-10">
      <div className="relative overflow-visible rounded-2xl">
        
        {/* Main Inner Container */}
        <div className="relative overflow-hidden rounded-2xl h-auto min-h-[380px] lg:h-[380px] xl:h-[420px] flex flex-col lg:block justify-center py-8 lg:py-0">
          
          {/* Background */}
          <img
            src={isDark ? backgroundDarkImage : backgroundImage}
            alt="Restaurant background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* =========================================
              DESKTOP VIEW IMAGES (Hidden on Mobile)
          ========================================= */}
          <img
            src={formatImageUrl(restaurant.image)}
            alt={restaurant.name}
            className="hidden lg:block absolute lg:-right-4 xl:right-12 top-1/2 -translate-y-1/2 lg:h-64 xl:h-80 object-contain z-10 pointer-events-auto rounded-xl shadow-lg"
          />
          
          <div className="hidden lg:block absolute lg:right-[28%] xl:right-[35%] lg:top-[68%] xl:top-[62%] w-32 xl:w-44 bg-white rounded-xl shadow-xl p-3 xl:px-6 xl:py-4 z-30">
            <img src={reviewImage} alt="Customer review" className="w-full" />
          </div>

          {/* =========================================
              MOBILE VIEW CONTENT (Flex Stack Layout)
          ========================================= */}
          <div className="relative z-20 flex flex-col items-center lg:items-start lg:block w-full h-full">

            {/* Mobile Top Image Group */}
            <div className="flex justify-center lg:hidden w-full order-1 px-4 mb-6 mt-4 relative">
              <div className="relative inline-flex justify-center items-center">
                <img
                  src={formatImageUrl(restaurant.image)}
                  alt={restaurant.name}
                  className="h-48 sm:h-60 object-contain rounded-xl relative z-10 shadow-lg"
                />
                {/* Overlapping Review Badge */}
                <div className="absolute -left-6 sm:-left-10 top-40 -translate-y-1/2 w-20 sm:w-24 bg-white rounded-xl shadow-xl p-2 z-20">
                  <img src={reviewImage} alt="Review" className="w-full" />
                </div>
              </div>
            </div>

            {/* Mobile Orange Button */}
            <div className="lg:hidden order-2 w-full px-4 sm:px-10 mb-8 flex justify-center">
              <button className="w-full bg-[#FC8A06] hover:bg-orange-600 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg text-base sm:text-lg">
                <FaClock className="text-lg sm:text-xl" />
                <span>Open until 10:30 AM</span>
              </button>
            </div>

            {/* Text & Badges (Shared across Mobile & Desktop) */}
            <div className="relative z-30 flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-4 sm:px-10 lg:px-12 xl:px-20 w-full lg:w-[55%] xl:w-1/2 order-3 lg:h-full lg:absolute lg:top-0 lg:left-0">
              
              <p
                className={`text-sm sm:text-base md:text-lg mb-2 sm:mb-3 font-medium line-clamp-1 ${
                  isDark ? "text-gray-200 lg:text-white" : "text-gray-700"
                }`}
              >
                {restaurant.description || "Welcome to our restaurant!"}
              </p>

              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {restaurant.name}
              </h1>

              {/* Info Badges */}
              <div className="flex flex-col xl:flex-row lg:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full lg:w-auto">
                <div className="flex items-center justify-center lg:justify-start gap-3 bg-[#03081F] text-white px-4 xl:px-5 py-4 lg:py-3 rounded-full text-sm sm:text-base lg:text-sm xl:text-lg w-full lg:w-auto shadow-md">
                  <img
                    src={Motocross}
                    alt="Minimum Order"
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                  />
                  <span className="whitespace-nowrap font-medium">Minimum Order: 12 GBP</span>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-3 bg-[#03081F] text-white px-4 xl:px-5 py-4 lg:py-3 rounded-full text-sm sm:text-base lg:text-sm xl:text-lg w-full lg:w-auto shadow-md">
                  <img
                    src={OrderComplete}
                    alt="Delivery Time"
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                  />
                  <span className="whitespace-nowrap font-medium">Delivery in 20-25 Min</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:absolute lg:left-0 lg:top-full lg:-translate-y-1/2 lg:z-30">
          <button className="bg-[#FC8A06] hover:bg-orange-600 text-white px-6 xl:px-8 py-3 xl:py-4 lg:rounded-t-none lg:rounded-tr-xl lg:rounded-br-none lg:rounded-bl-none font-semibold flex items-center justify-start gap-2 transition-colors">
            <FaClock className="text-base" />
            <span className="text-sm xl:text-base">Open until 10:30 AM</span>
          </button>
        </div>

      </div>
    </section>
  );
}