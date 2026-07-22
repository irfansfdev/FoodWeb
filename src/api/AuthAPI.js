import api from "./axios";

// Helper function to extract Django/REST framework validation error messages
const extractErrorMessage = (error, defaultMsg) => {
  if (error.response && error.response.data) {
    const data = error.response.data;

    // Catch standard error fields
    if (data.message) return data.message;
    if (data.detail) return data.detail;
    if (data.error) return data.error;

    // Catch Django REST Framework field validation errors (e.g., {"email": ["Already exists"]})
    if (typeof data === "object") {
      const firstKey = Object.keys(data)[0];
      if (firstKey && Array.isArray(data[firstKey])) {
        return `${firstKey}: ${data[firstKey][0]}`;
      } else if (firstKey) {
        return data[firstKey];
      }
    }
  }
  return error.message || defaultMsg;
};

export const loginUserAPI = async (credentials) => {
  try {
    // 👈 Using api.post directly handles baseURL and JSON formatting
    const response = await api.post("/user/login/", credentials);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to log in. Please check your credentials."));
  }
};

export const registerUserAPI = async (userData) => {
  try {
    const response = await api.post("/user/register/", userData);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create account. Please try again."));
  }
};