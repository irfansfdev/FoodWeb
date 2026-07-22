import api from "./axios";

// Helper to get auth token from localStorage using key: "authToken"
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken"); 
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// GET: Fetch the current cart
export const fetchCartAPI = async () => {
  try {
    const response = await api.get("/order/cart/", { 
      headers: getAuthHeaders() 
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to fetch cart: ${error.response?.status}`);
  }
};

// POST: Add an item or deal to the cart using a dynamic payload
export const addToCartAPI = async (payload) => {
  try {
    const response = await api.post("/order/cart/add/", payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to add item to cart: ${error.response?.status}`);
  }
};

// DELETE: Remove an item from the cart
export const deleteCartItemAPI = async (itemId) => {
  try {
    const response = await api.delete(`/order/cart/delete-item/${itemId}/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to delete item from cart: ${error.response?.status}`);
  }
};