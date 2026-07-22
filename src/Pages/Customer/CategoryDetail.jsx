import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Navbar from '../../Components/Common/Navbar';
import Footer from '../../Components/Common/Footer';
import Card from '../../Components/RestaurantDetails/Cards'; 
import { getMenuItems } from '../../api/restaurantAPI';
import { addToCartAPI } from '../../api/MenuAPI'; 
import { openAuthModal } from '../../Redux/Slices/AuthSlice';

const CategoryItems = () => {
  const { categoryId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await getMenuItems();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching category items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  // Filter items based on the categoryId in the URL
  const categoryItems = menuItems.filter(
    (item) => String(item.category?.id) === String(categoryId)
  );

  // Get unique restaurants from the filtered items
  const restaurants = [...new Set(categoryItems.map(item => item.restaurant.id))];

  // 🛒 Add to Cart logic
  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("authToken");

    // Auth check before adding
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
    <>
      <Navbar />

      <div className="max-w-[1528px] mx-auto px-6 py-10">
        {/* Category Heading */}
        <h1 className="text-5xl font-bold text-[#03081F] mb-10 text-center">
          {categoryItems.length > 0 
            ? `Category - ${categoryItems[0]?.category.name}` 
            : "Loading Category..."}
        </h1>

        {restaurants.map((restaurantId) => {
          // Find the restaurant name
          const restaurantName = categoryItems.find(
            item => item.restaurant.id === restaurantId
          )?.restaurant?.name;

          return (
            <div key={restaurantId} className="mb-14">
              {/* Restaurant Name */}
              <h2 className="text-2xl font-bold text-[#FC8A06] mb-6">
                {restaurantName}
              </h2>

              {/* Grid layout matching the Menu style */}
              <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                {categoryItems
                  .filter(item => item.restaurant.id === restaurantId)
                  // .slice(0, 5) // Note: I commented out the slice in case you want to see ALL items, uncomment if you strictly only want 5!
                  .map(item => (
                    <Card
                      key={item.id}
                      data={item}
                      onBtnClick={() => handleAddToCart(item)}
                    />
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </>
  );
};

export default CategoryItems;