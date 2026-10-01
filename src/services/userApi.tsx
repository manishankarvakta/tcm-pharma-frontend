import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { User } from "../models/user.model";

export const UserApi = createApi({
  reducerPath: "UserApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    Users: builder.query<User[], any>({
      query: ({ warehouse, aamarId }) => `/user/${warehouse}/${aamarId}`,
      providesTags: ["User"],
    }),
    User: builder.query<User, string>({
      query: (_id) => `/user/${_id}`,
      providesTags: ["User"],
    }),
    UserCount: builder.query<User[], any>({
      query: ({aamarId}) => `/user/count/${aamarId}`,
      providesTags: ["User"],
    }),
    UserDw: builder.query<User, string>({
      query: () => `/user/Dw`,
      providesTags: ["User"],
    }),
    addUser: builder.mutation<{}, User>({
      query: (User) => ({
        url: "/user/register",
        method: "POST",
        body: User,
      }),
      invalidatesTags: ["User"],
    }),
    loginUser: builder.mutation<{}, User>({
      query: (User) => ({
        url: "/user/login",
        method: "POST",
        body: User,
      }),
      invalidatesTags: ["User"],
    }),
    validUser: builder.mutation<{}, User>({
      query: (User) => ({
        url: "/user/valid",
        method: "POST",
        body: User,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<void, User>({
      query: ({ _id, ...rest }) => ({
        url: `/user/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useUsersQuery,
  useUserQuery,
  useUserCountQuery,
  useAddUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useValidUserMutation,
  useDeleteUserMutation,
  useUserDwQuery,
} = UserApi;

export default UserApi;
