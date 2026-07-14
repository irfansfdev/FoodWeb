import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";
import { getMenuItems } from "/src/api/restaurantAPI"; 

function OfferCategoryTabs({ activeCategory, onSelect }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndBuildCategories = async () => {
      try {
        setLoading(true);

        // 1. If there's no ID, do not load any categories
        if (!id) {
          setCategories([]);
          setLoading(false);
          return;
        }

        const menuItems = await getMenuItems();
        
        if (!menuItems || menuItems.length === 0) {
          setCategories([]);
          return;
        }

        // 2. Strictly filter items for THIS specific restaurant ID
        const restaurantItems = menuItems.filter(
          (item) => item.restaurant && String(item.restaurant.id) === String(id)
        );

        // 3. Get only items with valid category data from this specific restaurant
        const validItems = restaurantItems.filter((item) => item.category && item.category.name);

        // 4. KEEP "All" TAB LOGIC: Start with "All" tab
        const uniqueCategoryNames = ["All"]; 
        
        validItems.forEach((item) => {
          const catName = item.category.name;
          if (catName && !uniqueCategoryNames.includes(catName)) {
            uniqueCategoryNames.push(catName);
          }
        });

        setCategories(uniqueCategoryNames);

        // 5. Auto-select the first category ("All") if the active one isn't in the list
        if (uniqueCategoryNames.length > 0 && !uniqueCategoryNames.includes(activeCategory)) {
          onSelect(uniqueCategoryNames[0]);
        }

      } catch (error) {
        console.error("Error building categories from menu items:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndBuildCategories();
  }, [id]);

  if (loading) {
    return (
      <div className={`w-full py-6 text-center font-poppins text-sm ${isDark ? "text-white" : "text-gray-500"}`}>
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={`w-full py-6 text-center font-poppins text-sm ${isDark ? "text-white" : "text-gray-500"}`}>
        No categories available.
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-x-auto font-poppins px-4 py-4 md:px-6 ${
        isDark ? "bg-brand-orange" : "bg-[#f3f3f3]"
      }`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="flex items-center justify-start min-w-max gap-2 md:gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-[13px] sm:text-sm md:text-base transition-colors cursor-pointer shrink-0 ${
              activeCategory === cat
                ? "bg-[#03081f] text-white shadow-md"
                : "bg-transparent text-black hover:bg-black/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OfferCategoryTabs;