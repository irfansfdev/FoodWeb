const BASE_URL = "http://127.0.0.1:8000/order/cart"; 

// Helper to get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken"); 
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// GET: Fetch the current cart
export const fetchCartAPI = async () => {
  const response = await fetch(`${BASE_URL}/`, { 
    method: "GET",
    headers: getAuthHeaders() 
  });
  if (!response.ok) throw new Error("Failed to fetch cart");
  return response.json();
};

// POST: Add an item to the cart
export const addToCartAPI = async (itemId, quantity = 1) => {
  const response = await fetch(`${BASE_URL}/add/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ item_id: itemId, quantity: quantity }),
  });
  if (!response.ok) throw new Error("Failed to add item to cart");
  return response.json();
};

// DELETE: Remove an item from the cart
export const deleteCartItemAPI = async (itemId) => {
  const response = await fetch(`${BASE_URL}/delete-item/${itemId}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete item from cart");
  return response.json();
};