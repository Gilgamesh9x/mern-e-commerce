import apiSlice from "./apiSlice";

const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders", "Order"],
    }),
    getOrder: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: ["Order"],
      keepUnusedDataFor: 900,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `/orders/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),
    getUserOrders: builder.query({
      query: () => "/orders/myorders",
      providesTags: ["MyOrders"],
      keepUnusedDataFor: 900,
    }),
    getOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Orders"],
      keepUnusedDataFor: 900,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/deliver`,
        method: "PUT",
      }),
      invalidatesTags: ["Orders", "Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderQuery,
  usePayOrderMutation,
  useGetUserOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
} = ordersApiSlice;
