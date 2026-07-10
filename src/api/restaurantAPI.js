export const getRestaurants = async () => {
  try {
    // Native fetch replacing Axios!
    const response = await fetch("http://127.0.0.1:8000/restaurants/all-restaurant", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }); 
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Native fetch requires manual parsing
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    throw error;
  }
};