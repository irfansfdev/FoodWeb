export const fetchDealsAPI = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/restaurants/all-deal", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error fetching deals:", error);
    throw error;
  }
};