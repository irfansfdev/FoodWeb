import CategoryCard from "./CategoryCard";
import { useState, useEffect } from "react";
import { getMenuItems } from "/src/api/restaurantAPI";
import { useNavigate } from "react-router-dom";

function CategoryGrid() {
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

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

  return (
    <section className="px-6 lg:px-20 py-8">
      <h2 className="text-2xl font-bold mb-4">
        Order.uk Popular Categories 🤩
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
        {uniqueCategories.map((menuItem) => (
          <CategoryCard
            key={menuItem.category.id}
            image={
              menuItem.image
                ? `http://127.0.0.1:8000${menuItem.image}`
                : "/src/assets/category-placeholder.png"
            }
            name={menuItem.category.name}
            restaurantCount={`${getRestaurantCount(
              menuItem.category.id
            )} Restaurants`}
            onClick={() =>
              navigate(`/category/${menuItem.category.id}`)
            }
          />
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;