import { API_BASE_URL } from './axios';

const BASE_URL = `${API_BASE_URL}/order/cart`; 

// Helper to get auth token from localStorage using your exact key: "authToken"
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken"); 
  
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
  if (!response.ok) throw new Error(`Failed to fetch cart: ${response.status}`);
  return response.json();
};

// POST: Add an item or deal to the cart using a dynamic payload
export const addToCartAPI = async (payload) => {
  const response = await fetch(`${BASE_URL}/add/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload), 
  });
  if (!response.ok) throw new Error(`Failed to add item to cart: ${response.status}`);
  return response.json();
};

// DELETE: Remove an item from the cart
export const deleteCartItemAPI = async (itemId) => {
  const response = await fetch(`${BASE_URL}/delete-item/${itemId}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error(`Failed to delete item from cart: ${response.status}`);
  return response.json();
};