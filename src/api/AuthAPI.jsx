import { API_BASE_URL } from './axios';

const BASE_URL = API_BASE_URL; 

// Helper function to process fetch responses and extract database errors
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    let errorMessage = 'An error occurred. Please try again.';
    
    // Catch standard error fields
    if (data.message) errorMessage = data.message;
    else if (data.detail) errorMessage = data.detail;
    else if (data.error) errorMessage = data.error;
    // Catch Django REST Framework field-specific validation errors (e.g., {"email": ["Already exists"]})
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

export const loginUserAPI = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/user/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    return await handleResponse(response);
  } catch (error) {
    // If fetch itself fails (e.g., network error), fallback to a generic message
    throw new Error(error.message || 'Failed to log in. Please check your credentials.');
  }
};

export const registerUserAPI = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/user/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to create account. Please try again.');
  }
};