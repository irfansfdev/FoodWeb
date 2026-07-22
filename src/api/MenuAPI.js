import api from "./axios";

// Helper: Automatically attaches JWT Auth Token from local storage
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// ==========================================
// MENU & CATEGORY ENDPOINTS
// ==========================================

export const fetchMenuItemsAPI = async () => {
  try {
    const response = await api.get('/restaurants/all-menuitem');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch menu items.');
  }
};

export const fetchDealsAPI = async () => {
  try {
    const response = await api.get('/restaurants/deals');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch deals.');
  }
};

export const fetchCategoriesAPI = async () => {
  try {
    const response = await api.get('/restaurants/categories');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch categories.');
  }
};

// ==========================================
// CART & ORDER ENDPOINTS (PROTECTED)
// ==========================================

// POST /order/cart/add/
export const addToCartAPI = async (itemId, quantity = 1) => {
  try {
    const response = await api.post(
      '/order/cart/add/',
      { 
        menu_item_id: itemId, 
        quantity: quantity 
      },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add item to cart.');
  }
};

// GET /order/cart/
export const fetchCartAPI = async () => {
  try {
    const response = await api.get('/order/cart/', {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to retrieve cart entries.');
  }
};

// DELETE /order/cart/delete-item/:id/
export const deleteCartItemAPI = async (itemId) => {
  try {
    const response = await api.delete(`/order/cart/delete-item/${itemId}/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete item from database');
  }
};