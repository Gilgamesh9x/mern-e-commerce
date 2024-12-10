import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../utils/constants";

const baseQuery = fetchBaseQuery({ baseUrl: API_URL, credentials: "include" });

// This is called RTK Query and it is responsible for making requests for us and it works like Tanstack
const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Products", "Product", "Order", "MyOrders", "Orders", "Users"],
  endpoints: (builder) => ({}),
});

export default apiSlice;
