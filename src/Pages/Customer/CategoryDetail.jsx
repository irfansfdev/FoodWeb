import { useEffect, useState } from 'react'
import Navbar from '../../Components/Common/Navbar'
import Footer from '../../Components/Common/Footer'
import { useParams } from 'react-router-dom';
import { getMenuItems } from '../../api/restaurantAPI';

const CategoryItems = () => {
  const { categoryId } = useParams();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await getMenuItems();
        setMenuItems(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMenuItems();
  }, []);

  const categoryItems = menuItems.filter(
    (item) => item.category?.id == categoryId
  );

  // console.log(categoryItems);
  const restaurants = [...new Set(categoryItems.map(item => item.restaurant.id))];

  return (
    <>
  <Navbar />

  <div className="max-w-[1528px] mx-auto px-6 py-10">

    {/* Category Heading */}
    <h1 className="text-5xl font-bold bg- text-[#03081F] mb-10 text-center">
      {"Category - " + categoryItems[0]?.category.name}
    </h1>

    {restaurants.map((restaurantId) => (
      <div key={restaurantId} className="mb-14">

        {/* Restaurant Name */}
        <h2 className="text-2xl font-bold text-[#FC8A06] mb-6">
          {
            categoryItems.find(item => item.restaurant.id === restaurantId)?.restaurant?.name
          }
        </h2>

        {/* Restaurant Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

          {categoryItems
            .filter(item => item.restaurant.id === restaurantId)
            .slice(0, 5)
            .map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                {item.image && (
                  <img
                    src={`http://127.0.0.1:8000${item.image}`}
                    alt={item.name}
                    className="w-full h-[180px] object-cover"
                  />
                )}

                <div className="p-4">

                  <h3 className="font-bold text-lg text-[#03081F]">
                    {item.name}
                  </h3>

                  <p className="text-[#FC8A06] font-semibold mt-2">
                    ${item.price}
                  </p>

                </div>
              </div>
            ))}

        </div>

      </div>
    ))}

  </div>

  <Footer />
</>
  )
}

export default CategoryItems