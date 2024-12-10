import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient();
export const API_URL = "http://localhost:8000/api";

// Fetch Products

export async function fetchProducts({ signal }) {
  try {
    const { data } = await axios.get(`${API_URL}/products`, {
      withCredentials: true,
      signal,
    });
    return data;
  } catch (error) {
    throw new Error("Failed to fetch products. Try again later...");
  }
}

// Fetch Product

export async function fetchProduct({ signal, productId }) {
  try {
    const { data } = await axios.get(`${API_URL}/products/${productId}`, {
      withCredentials: true,
      signal,
    });
    return data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
}
