import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { openAuthModal } from "../../redux/Slices/authSlice";
import { fetchMenuItemsAPI, addToCartAPI } from "../../api/MenuAPI";
import RestaurantOffersHeader from "./RestaurantOffersHeader";
import OfferCategoryTabs from "./OfferCategoryTab";
import OffersGrid from "./OffersGrid";
import Card from "./Cards";

export default function MenuSection() {
  const { id } = useParams();

  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      // 1. STRICT CHECK: If there is no ID, do not fetch or display anything
      if (!id) {
        setMenuData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const responseData = await fetchMenuItemsAPI();

        let rawItems = [];
        if (Array.isArray(responseData)) {
          rawItems = responseData;
        } else if (responseData && Array.isArray(responseData.results)) {
          rawItems = responseData.results;
        } else if (responseData && Array.isArray(responseData.data)) {
          rawItems = responseData.data;
        }

        // 2. STRICT FILTER: Only keep items that belong to THIS specific restaurant
        const itemsToDisplay = rawItems.filter((item) => {
          const itemRestaurantId =
            item.restaurant?.id || item.restaurant_id || item.restaurant;
          return String(itemRestaurantId) === String(id);
        });

        // 3. Group the filtered items into categories
        const groupedCategories = itemsToDisplay.reduce((accumulator, item) => {
          const categoryName = item.category?.name || "General";
          const categoryId = item.category?.id || "general";

          let existingCategory = accumulator.find(
            (cat) => cat.name === categoryName,
          );

          if (!existingCategory) {
            existingCategory = {
              id: categoryId,
              name: categoryName,
              items: [],
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
  }, [id]);

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("authToken");

    if (!user || Object.keys(user).length === 0 || !token) {
      dispatch(openAuthModal());
      return;
    }

    try {
      await addToCartAPI(item.id, 1);
      navigate("/cart");
    } catch (error) {
      alert(error.message || "Could not add item to cart. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <RestaurantOffersHeader
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <OfferCategoryTabs
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <OffersGrid selectedCategory={activeCategory} searchQuery={searchQuery} />

      <div className="mx-auto space-y-2 px-8 lg:px-20 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500 font-medium text-xl">
            Loading menu...
          </div>
        ) : (
          <div className="space-y-14">
            {menuData.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                No menu items found for this restaurant.
              </div>
            ) : (
              menuData
                .filter(
                  (category) =>
                    activeCategory === "All" ||
                    category.name === activeCategory,
                )
                .map((category) => {
                  // CRASH FIX: Ensure item.name and searchQuery are never undefined!
                  const safeSearchQuery = (searchQuery || "").toLowerCase();

                  const searchedItems = category.items.filter((item) => {
                    const itemName = (item.name || "").toLowerCase();
                    return itemName.includes(safeSearchQuery);
                  });

                  if (searchedItems.length === 0) return null;

                  return (
                    <section key={category.id}>
                      <h2 className="mb-6 text-[32px] font-bold text-[#03081F]">
                        {category.name}
                      </h2>

                      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                        {searchedItems.map((item) => (
                          <Card
                            key={item.id}
                            data={item}
                            onBtnClick={() => handleAddToCart(item)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
