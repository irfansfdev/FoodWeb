import CategoryCard from "./CategoryCard";
import { useState, useEffect, useRef } from "react";
import { getMenuItems } from "/src/api/restaurantAPI";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import { getImageUrl } from "/src/api/axios";

function CategoryGrid() {
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await getMenuItems();
        console.log(data);
        setMenuItems(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMenuItems();
  }, []);

  // Ignore menu items that don't have a category
  const validMenuItems = menuItems.filter((item) => item.category);

  // Get only one item for each category
  const uniqueCategories = validMenuItems.filter(
    (item, index, self) =>
      index ===
      self.findIndex((i) => i.category.id === item.category.id)
  );

  // Count unique restaurants in a category
  const getRestaurantCount = (categoryId) => {
    const restaurantIds = validMenuItems
      .filter((item) => item.category.id === categoryId)
      .map((item) => item.restaurant.id);

    return new Set(restaurantIds).size;
  };

  // 🎛️ Scroll Function for the carousel arrows
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -500 : 500;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Since original layout is grid-cols-6, let's trigger carousel when > 6 items
  const isCarousel = uniqueCategories.length > 6;

  return (
    <section className="px-6 lg:px-20 py-8">
      <h2 className="text-2xl font-bold mb-4">
        Order.uk Popular Categories 
      </h2>

      {/* ========================================== */}
      {/* 📱 MOBILE VIEW: Sliding row                */}
      {/* ========================================== */}
      <div className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
        {uniqueCategories.map((menuItem) => (
          // Locked mobile width to 140px so they don't squish
          <div key={menuItem.category.id} className="w-[140px] snap-start shrink-0">
            <CategoryCard
              image={
                menuItem.image
                  ? getImageUrl(menuItem.image)
                  : "/src/assets/category-placeholder.png"
              }
              name={menuItem.category.name}
              restaurantCount={`${getRestaurantCount(menuItem.category.id)} Restaurants`}
              onClick={() => navigate(`/category/${menuItem.category.id}`)}
            />
          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* 💻 DESKTOP VIEW: Grid OR Arrow Carousel    */}
      {/* ========================================== */}
      {isCarousel ? (
        <div className="hidden lg:block relative group">
          <button 
            onClick={() => scroll("left")}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-brand-orange hover:scale-110 transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {uniqueCategories.map((menuItem) => (
              // The magic math: exactly 6 cards fit in the viewport
              <div 
                key={menuItem.category.id} 
                className="w-[calc(16.666%-16px)] min-w-[160px] flex-shrink-0 snap-start"
              >
                <CategoryCard
                  image={
                    menuItem.image
                      ? getImageUrl(menuItem.image)
                      : "/src/assets/category-placeholder.png"
                  }
                  name={menuItem.category.name}
                  restaurantCount={`${getRestaurantCount(menuItem.category.id)} Restaurants`}
                  onClick={() => navigate(`/category/${menuItem.category.id}`)}
                />
              </div>
            ))}
          </div>

          <button 
            onClick={() => scroll("right")}
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-brand-orange hover:scale-110 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      ) : (
        // Standard Grid if 6 or fewer categories
        <div className="hidden lg:grid grid-cols-6 gap-5 py-4">
          {uniqueCategories.map((menuItem) => (
            <CategoryCard
              key={menuItem.category.id}
              image={
                menuItem.image
                  ? getImageUrl(menuItem.image)
                  : "/src/assets/category-placeholder.png"
              }
              name={menuItem.category.name}
              restaurantCount={`${getRestaurantCount(menuItem.category.id)} Restaurants`}
              onClick={() => navigate(`/category/${menuItem.category.id}`)}
            />
          ))}
        </div>
      )}

      {/* CSS Utility to cleanly hide scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </section>
  );
}

export default CategoryGrid;