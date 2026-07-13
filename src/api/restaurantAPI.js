import api from "./axios";

export const getRestaurants = async () => {
    const response = await api.get("/restaurants/all-restaurant");
    return response.data.data;
};

export const getMenuItems = async () => {
    const response = await api.get(`/restaurants/all-menuitem`);
    return response.data.data;
};

export const getDeals = async () => {
    const response = await api.get(`/restaurants/all-deal/`);
    return response.data.data;
};