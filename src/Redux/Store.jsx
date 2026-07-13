import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/AuthSlice';
import cartReducer from './Slices/cartSlice'; // 1. Import your new cart reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer, // 2. Add it here to centralize global cart state
  },
});