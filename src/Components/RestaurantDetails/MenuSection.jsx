import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { useAuthModal } from "../../context/AuthModalContext";
import { fetchMenuItemsAPI, addToCartAPI } from "../../api/MenuAPI"; 
import RestaurantOffersHeader from "./RestaurantOffersHeader";
import OfferCategoryTabs from "./OfferCategoryTab";
import OffersGrid from "./OffersGrid";
import Card from "./Cards";

export default function MenuSection() {
  const [menuData, setMenuData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Offers");

  const { user } = useSelector((state) => state.auth);
  
  // ✅ Correctly pulled openLogin from your custom hook
  const { openLogin } = useAuthModal(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const responseData = await fetchMenuItemsAPI();
        
        // Extract the raw list array from the response safely
        let rawItems = [];
        if (Array.isArray(responseData)) {
          rawItems = responseData;
        } else if (responseData && Array.isArray(responseData.results)) {
          rawItems = responseData.results;
        } else if (responseData && Array.isArray(responseData.data)) {
          rawItems = responseData.data;
        }

        // Transform the backend's flat items into the grouped category structure
        const groupedCategories = rawItems.reduce((accumulator, item) => {
          const categoryName = item.category?.name || "General";
          const categoryId = item.category?.id || "general";

          let existingCategory = accumulator.find((cat) => cat.name === categoryName);

          if (!existingCategory) {
            existingCategory = {
              id: categoryId,
              name: categoryName,
              items: []
            };
            accumulator.push(existingCategory);
          }

          existingCategory.items.push(item);
          return accumulator;
        }, []);

        setMenuData(groupedCategories);
        
      } catch (error) {
        console.error("Error loading menu:", error);
        setMenuData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("authToken"); 
    
    // ✅ Bulletproof check: If there is no Redux user OR no token, force the modal!
    if (!user || Object.keys(user).length === 0 || !token) {
      console.log("No user found! Triggering login modal...");
      openLogin(); 
      return; 
    }

    try {
      console.log("User verified. Adding to cart...");
      await addToCartAPI(item.id, 1);
      
      // Navigate instantly to the cart upon success
      navigate("/cart"); 
      
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert(error.message || "Could not add item to cart. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <RestaurantOffersHeader restaurantName="McDolands" />

      <OfferCategoryTabs
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      
      <OffersGrid />

      <div className="mx-auto space-y-2 px-8 lg:px-20 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500 font-medium text-xl">
            Loading menu...
          </div>
        ) : (
          <div className="space-y-14">
            {menuData.length === 0 ? (
              <div className="text-center py-10 text-gray-400">No menu items found.</div>
            ) : (
              menuData
                .filter(
                  (category) =>
                    activeCategory === "Offers" || category.name === activeCategory
                )
                .map((category) => (
                  <section key={category.id}>
                    <h2 className="mb-6 text-[32px] font-bold text-[#03081F]">
                      {category.name}
                    </h2>

                    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                      {category.items.map((item) => (
                        <Card
                          key={item.id}
                          data={item}
                          onBtnClick={() => handleAddToCart(item)}
                        />
                      ))}
                    </div>
                  </section>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}