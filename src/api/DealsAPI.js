import api from './axios';

export const fetchDealsAPI = async () => {
  try {
    const response = await api.get('/restaurants/all-deal');
    return response.data;
  } catch (error) {
    console.error('API Error fetching deals:', error);
    throw error;
  }
};