const BASE_URL = 'http://127.0.0.1:8000'; 

// Helper: Processes fetch responses and extracts exact database errors
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({})); 

  if (!response.ok) {
    console.error(`🚨 Backend Error Info [Status ${response.status}]:`, data);

    let errorMessage = `Server error (${response.status} ${response.statusText}).`;
    
    if (data.message) errorMessage = data.message;
    else if (data.detail) errorMessage = data.detail;
    else if (data.error) errorMessage = data.error;
    else if (typeof data === 'object') {
      const firstKey = Object.keys(data)[0];
      if (firstKey && Array.isArray(data[firstKey])) {
        errorMessage = `${firstKey}: ${data[firstKey][0]}`;
      } else if (firstKey) {
        errorMessage = data[firstKey];
      }
    }
    throw new Error(errorMessage);
  }

  return data;
};

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
    const response = await fetch(`${BASE_URL}/restaurants/all-menuitem`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch menu items.');
  }
};

export const fetchDealsAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/restaurants/deals`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch deals.');
  }
};

export const fetchCategoriesAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/restaurants/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch categories.');
  }
};

// ==========================================
// CART & ORDER ENDPOINTS (PROTECTED)
// ==========================================

// POST /order/cart/add/
export const addToCartAPI = async (itemId, quantity = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/order/cart/add/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        menu_item_id: itemId, 
        quantity: quantity 
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to add item to cart.');
  }
};

// GET /order/cart/
export const fetchCartAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/order/cart/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to retrieve cart entries.');
  }
};

// Replace your existing deleteCartItemAPI with this one:

export const deleteCartItemAPI = async (itemId) => {
  const token = localStorage.getItem("authToken"); 
  const BASE_URL = "http://127.0.0.1:8000"; 

  // Using your exact Django endpoint here:
  const response = await fetch(`${BASE_URL}/order/cart/delete-item/${itemId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // Change "Bearer" to "Token" if Django throws an auth error
      "Authorization": `Bearer ${token}`, 
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete item from database");
  }

  return true; 
};