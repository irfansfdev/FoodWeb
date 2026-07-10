export const fetchCategoriesAPI = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/restaurants/all-menuitem", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();
    const menuItems = Array.isArray(rawData) ? rawData : rawData.data || [];

    // Transform and group the data
    const categoryMap = {};

    menuItems.forEach(item => {
      // Skip if the item doesn't have a category assigned
      if (!item.category || !item.category.id) return;

      const catId = item.category.id;

      // If we haven't seen this category yet, create a new entry
      if (!categoryMap[catId]) {
        categoryMap[catId] = {
          id: catId,
          name: item.category.name, // Extract the NESTED category name
          image: item.image,        // Grab the menu item's image for the category card
          uniqueRestaurants: new Set(), // A Set automatically prevents duplicate IDs
        };
      }

      // Add the restaurant ID to our Set to calculate the count
      if (item.restaurant && item.restaurant.id) {
        categoryMap[catId].uniqueRestaurants.add(item.restaurant.id);
      }
    });

    // Convert our map object back into a clean array for the React grid
    const formattedCategories = Object.values(categoryMap).map(cat => ({
      id: cat.id,
      name: cat.name,
      image: cat.image,
      restaurantCount: cat.uniqueRestaurants.size // Get the total unique count!
    }));

    return formattedCategories;
    
  } catch (error) {
    console.error("API Error fetching categories:", error);
    throw error;
  }
};