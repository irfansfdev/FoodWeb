import api from "./axios";

export const getRestaurants = async () => {
    const response = await api.get("/restaurants/all-restaurant");
    return response.data.data || response.data;
};

export const getMenuItems = async () => {
    const response = await api.get(`/restaurants/all-menuitem`);
    return response.data.data || response.data;
};

export const getDeals = async () => {
    const response = await api.get(`/restaurants/all-deal/`);
    return response.data.data || response.data;
};

export const getCategory = async () => {
    try {
        // Note: Check if your backend expects "/restaurants/" (plural) instead of "/restaurant/"
        const response = await api.get(`/restaurants/all-category`);
        
        console.log("🔍 RAW Category API Response:", response);

        // This ensures that whether your backend sends { data: [...] } or just [...] 
        // it will correctly return the array instead of undefined.
        if (response.data && response.data.data) {
            return response.data.data;
        }
        
        return response.data || [];
        
    } catch (error) {
        console.error("🚨 Error fetching categories in API:", error);
        return []; // Return empty array so it doesn't crash the rest of the dashboard
    }
};