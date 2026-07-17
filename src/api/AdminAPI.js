import api from "./axios";
 
// --- Analytics & Fetching ---
export const analyticsAllOrdersByStatus = async () => {
    const response = await api.get("/order/admin/analytics/orders-by-status/");
    return response.data.data;
};
export const analyticsOverview = async () => {
    const response = await api.get("/order/admin/analytics/overview/");
    return response.data.data;
};
export const analyticsPopularDeals = async () => {
    const response = await api.get("/order/admin/analytics/popular-deals/");
    return response.data.data;
};
export const analyticsPopularItems = async () => {
    const response = await api.get("/order/admin/analytics/popular-items/");
    return response.data.data;
};
export const analyticsRevenueByRestaurant = async () => {
    const response = await api.get("/order/admin/analytics/revenue-by-restaurant/");
    return response.data.data;
};
export const analyticsRevenueOverTime = async () => {
    const response = await api.get("/order/admin/analytics/revenue-over-time/");
    return response.data.data;
};
export const analyticsAllOrders = async () => {
    const response = await api.get("/order/admin/orders");
    return response.data.data;
};

export const getRestaurantsId = async (rest_id) => {
    const response = await api.get(`/restaurants/restaurant/${rest_id}`);
    const payload = response?.data;

    if (payload?.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
        return payload.data;
    }

    if (payload?.restaurant && typeof payload.restaurant === "object" && !Array.isArray(payload.restaurant)) {
        return payload.restaurant;
    }

    if (payload?.result && typeof payload.result === "object" && !Array.isArray(payload.result)) {
        return payload.result;
    }

    return payload;
};
 
export const updateOrderStatus = async (orderId, data) => {
    const response = await api.patch(`/order/admin/orders/${orderId}/status/`, data);
    return response.data;
};
 
// --- Create ---
export const createCategory = async (data) => {
    const response = await api.post("/restaurants/create-category/", data);
    return response.data.data;
};
export const createDealItem = async (data) => {
    const response = await api.post("/restaurants/create-deal-item/", data);
    return response.data.data;
};
export const createDeal = async (data) => {
    const response = await api.post("/restaurants/create-deal/", data);
    return response.data.data;
};
export const createMenuItem = async (data) => {
    const response = await api.post("/restaurants/create-menuitem/", data);
    return response.data.data;
};
export const createRestaurant = async (data) => {
    const response = await api.post("/restaurants/create-restaurant/", data);
    return response.data.data;
};
 
// --- Delete ---
export const deleteRestaurant = async (rest_id) => {
    const response = await api.delete(`/restaurants/delete-restaurant/${rest_id}/`);
    return response.data.data;
};
export const deleteCategory = async (cat_id) => {
    const response = await api.delete(`/restaurants/delete-category/${cat_id}/`);
    return response.data.data;
};
export const deleteDealItem = async (item_id) => {
    const response = await api.delete(`/restaurants/delete-deal-item/${item_id}/`);
    return response.data.data;
};
export const deleteDeal = async (deal_id) => {
    const response = await api.delete(`/restaurants/delete-deal/${deal_id}/`);
    return response.data.data;
};
export const deleteMenuItem = async (menu_id) => {
    const response = await api.delete(`/restaurants/delete-menuitem/${menu_id}/`);
    return response.data.data;
};
 
// --- Update ---
export const editCategory = async (cat_id, data) => {
    const response = await api.patch(`/restaurants/update-category/${cat_id}/`, data);
    return response.data.data;
};
export const editDealItem = async (item_id, data) => {
    const response = await api.patch(`/restaurants/update-deal-item/${item_id}/`, data);
    return response.data.data;
};
export const editDeal = async (deal_id, data) => {
    const response = await api.patch(`/restaurants/update-deal/${deal_id}/`, data);
    return response.data.data;
};
export const editMenuItem = async (menu_id, data) => {
    const response = await api.patch(`/restaurants/update-menuitem/${menu_id}/`, data);
    return response.data.data;
};
export const editRestaurant = async (rest_id, data) => {
    const response = await api.patch(`/restaurants/update-restaurant/${rest_id}/`, data);
    return response.data.data;
};