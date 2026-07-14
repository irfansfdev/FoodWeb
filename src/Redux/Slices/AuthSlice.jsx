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

      if (action.payload.data) {
        state.user = action.payload.data; 
      }
      if (action.payload.token && action.payload.token.access) {
        state.token = action.payload.token.access;
      }

      if (state.token) localStorage.setItem('authToken', state.token);
      if (state.user) localStorage.setItem('authUser', JSON.stringify(state.user));
      
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

export const { authStart, authSuccess, authFailure, logout, clearError, openAuthModal, closeAuthModal } = authSlice.actions;
export default authSlice.reducer;