import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  const savedUser = localStorage.getItem('authUser');
  try {
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  user: getInitialUser(),
  token: localStorage.getItem('authToken') || null,
  loading: false,
  error: null,
  isAuthModalOpen: false, // Controls the modal visibility
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      console.log("🚀 REDUX SUCCESS! Backend Data:", action.payload);

      // 1. Dynamic User Extraction (Handles .data, .user, or direct user object)
      const detectedUser = 
        action.payload.data || 
        action.payload.user || 
        (action.payload.id ? action.payload : null);

      if (detectedUser) {
        state.user = detectedUser;
        localStorage.setItem('authUser', JSON.stringify(detectedUser));
      }

      // 2. Dynamic Token Extraction (Handles token.access, direct token, or access string)
      const detectedToken = 
        action.payload?.token?.access || 
        action.payload?.token || 
        action.payload?.access;

      if (detectedToken && typeof detectedToken === "string") {
        state.token = detectedToken;
        localStorage.setItem('authToken', detectedToken);
      }
      
      // Auto-close modal on successful login
      state.isAuthModalOpen = false; 
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.error("❌ REDUX FAILURE! Error message:", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
    clearError: (state) => {
      state.error = null;
    },
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    }
  },
});

export const { 
  authStart, 
  authSuccess, 
  authFailure, 
  logout, 
  clearError, 
  openAuthModal, 
  closeAuthModal 
} = authSlice.actions;

export default authSlice.reducer;