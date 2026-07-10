import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Adjust if your backend runs elsewhere
});

export const loginUserAPI = async (credentials) => {
  try {
    const response = await API.post('/user/login/', credentials);
    return response.data;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.detail || 
      'Failed to log in. Please check your credentials.';
    throw new Error(errorMessage);
  }
};

export const registerUserAPI = async (userData) => {
  try {
    const response = await API.post('/user/register/', userData);
    return response.data;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.detail || 
      'Failed to create account. Please try again.';
    throw new Error(errorMessage);
  }
};