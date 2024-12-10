import apiSlice from "./apiSlice";

// Understand the caching mechanism:
// 1: When the component is mounted and using the query, the data is considered active, and the cache will not expire. The keepUnusedDataFor timer starts only after the component (or all components using the query) unmounts and no longer uses the data.
// 2: when you leave the component, and 900 seconds pass, that's when the cache will invalidate and when you revisit the component, a new request will be made
// 3: If you leave the component, and say, only 300 secs pass and you come back to the component, no request will be made and the timer will reset
const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page = 1, searchTerm }) => {
        return {
          url: "/products",
          params: {
            page,
            searchTerm,
          },
        };
      },
      providesTags: ["Products"],
      keepUnusedDataFor: 900,
    }),
    getProduct: builder.query({
      query: (productId) => `/products/${productId}`,
      providesTags: ["Product"],
      keepUnusedDataFor: 900,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: "/products",
        method: "POST",
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ formData, productId }) => ({
        url: `/products/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Product", "Products"],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product", "Products"],
    }),
    createProductReview: builder.mutation({
      query: ({ data, productId }) => ({
        url: `/products/${productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product", "Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductReviewMutation,
} = productsApiSlice;
