import apiSlice from "./apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/update-profile",
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
      keepUnusedDataFor: 900,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
} = userApiSlice;
