import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import the hook
import CategoryCard from "./CategoryCard";
import { fetchCategoriesAPI } from "../../api/categoryAPI"; 

function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. Initialize the navigate function
  const navigate = useNavigate(); 

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const responseData = await fetchCategoriesAPI();
        setCategories(responseData);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  // 3. Create a function to handle the click
  const handleCategoryClick = (categoryId) => {
    // This sends the user to a new URL, e.g., http://localhost:5173/category/5
    navigate(`/category/${categoryId}`); 
  };

  return (
    <section className="px-6 lg:px-20 py-8">
      <h2 className="text-2xl font-bold mb-4 text-[#03081F] dark:text-white">
        Order.uk Popular Categories
      </h2>
      
      {loading ? (
        <div className="text-gray-500 py-4">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {categories.length === 0 ? (
            <div className="col-span-full text-gray-500">
              No categories found.
            </div>
          ) : (
            categories.map((cat) => (
              <CategoryCard 
                key={cat.id} 
                {...cat} 
                // 4. Pass the click handler with the specific category ID
                onClick={() => handleCategoryClick(cat.id)} 
              />
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default CategoryGrid;