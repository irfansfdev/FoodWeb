import { API_BASE_URL } from './axios';

export const fetchDealsAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/all-deal`, {
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