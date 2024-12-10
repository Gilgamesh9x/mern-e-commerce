import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "./apiSlice";
import cartReducer from "./cart";
import authSlice from "./auth";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartReducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add RTK Query middleware
});

export default store;
