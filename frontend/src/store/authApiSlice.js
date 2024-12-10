import apiSlice from "./apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    // This is a mutation because, despite using GET, it has side effects (e.g., clearing the session on the server).
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  authApiSlice;
