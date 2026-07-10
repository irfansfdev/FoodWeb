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

      // 1. Extract the user object from action.payload.data
      if (action.payload.data) {
        state.user = action.payload.data; 
      }

      // 2. Extract the string access token from action.payload.token.access
      if (action.payload.token && action.payload.token.access) {
        state.token = action.payload.token.access;
      }

      // 3. Save them to LocalStorage
      if (state.token) localStorage.setItem('authToken', state.token);
      if (state.user) localStorage.setItem('authUser', JSON.stringify(state.user));
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
    }
  },
});

export const { authStart, authSuccess, authFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;