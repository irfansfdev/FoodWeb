import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCartAPI, addToCartAPI, deleteCartItemAPI } from "../../api/cartAPI";
import api from "../../api/axios"

// 1. Fetch Cart
export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const responseData = await fetchCartAPI();
      let items = [];
      
      // Handle Django's varying response structures
      if (responseData?.data?.items && Array.isArray(responseData.data.items)) {
        items = responseData.data.items;
      } else if (Array.isArray(responseData)) {
        items = responseData;
      } else if (responseData && Array.isArray(responseData.results)) {
        items = responseData.results;
      } else if (responseData && Array.isArray(responseData.items)) {
        items = responseData.items;
      }

      // Normalize data to support BOTH Menu Items and Deals
      const normalizedItems = items.map((cartItem) => {
        // Fallback checks for deal objects, menu_items, or product objects
        const foodDetails = cartItem.deal || cartItem.menu_item || cartItem.product || cartItem;

        const getImageUrl = (img) => {
          if (!img) return "/placeholder-food.jpg";
          if (typeof img === "object") img = img.url || img.src || img.path || "";
          if (typeof img === "string" && img.startsWith("http")) return img;
          const baseUrl = api.defaults && api.defaults.baseURL ? api.defaults.baseURL.replace(/\/$/, "") : "";
          let path = (img || "").toString();
          if (!path.startsWith("/")) path = `/${path}`;
          if (!path.startsWith("/media/") && !path.startsWith("/static/")) path = `/media${path}`;
          return baseUrl ? `${baseUrl}${path}` : path;
        };

        const itemImage = getImageUrl(foodDetails.image || foodDetails.image_url || foodDetails.photo);

        // Support extraction for both normal price and deal combo_price
        const itemPrice = parseFloat(foodDetails.price) || parseFloat(foodDetails.combo_price) || 0;

        return {
          id: cartItem.id,
          title: foodDetails.name || foodDetails.title || "Delicious Item",
          description: foodDetails.description || "Freshly prepared for you.",
          price: itemPrice,
          image: itemImage,
          quantity: cartItem.quantity || 1,
        };
      });

      return normalizedItems;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Add to Cart (Handles both regular items and deals dynamically)
export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async ({ itemId, quantity, isDeal }, { dispatch, rejectWithValue }) => {
    try {
      // Build the exact payload structure Django's serializer demands
      const payload = isDeal 
        ? { deal_id: itemId, quantity } 
        : { menu_item_id: itemId, quantity };

      await addToCartAPI(payload);
      
      // Re-fetch cart immediately for a reliable UI update sync
      dispatch(fetchCartAsync()); 
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Delete from Cart
export const deleteCartItemAsync = createAsyncThunk(
  "cart/deleteCartItem",
  async (itemId, { rejectWithValue }) => {
    try {
      await deleteCartItemAPI(itemId);
      return itemId; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE ---
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle", 
    error: null,
  },
  reducers: {
    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteCartItemAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;