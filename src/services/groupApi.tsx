import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Group } from "../models/group.model";
import { signInUser } from "../Components/Utility/Auth";

// console.log(BASE_URL);
const user = signInUser();

export const GroupApi = createApi({
  reducerPath: "GroupApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Group"],
  endpoints: (builder) => ({
    groups: builder.query<Group[], void>({
      query: () => "/group",
      providesTags: ["Group"],
    }),
    groupsExport: builder.query<Group[], any>({
      query: ({ aamarId }) => `/group/export/${aamarId}`,
      providesTags: ["Group"],
    }),
    group: builder.query<Group, string>({
      query: (_id) => `/group/${_id}`,
      providesTags: ["Group"],
    }),
    groupCount: builder.query<Group[], any>({
      query: ({ aamarId }) => `/group/count/${aamarId}`,
      providesTags: ["Group"],
    }),
    groupList: builder.query<Group[], any>({
      query: (aamarId) => `/group/list/${aamarId}`,
      providesTags: ["Group"],
    }),
    groupName: builder.query<Group[], any>({
      query: ({ aamarId, name }) => `/group/name/${name}/${aamarId}`,
      providesTags: ["Group"],
    }),
    groupPagination: builder.query<Group, any>({
      query: ({ page, size, aamarId, q }) =>
        `/group/all/${page}/${size}/${aamarId}?q=${q}`,
      // query: ({page, size, q}) => `/Customer`,
      providesTags: ["Group"],
    }),
    addGroup: builder.mutation<{}, Group>({
      query: (group) => ({
        url: "/group",
        method: "POST",
        body: group,
      }),
      invalidatesTags: ["Group"],
    }),
    addImportGroup: builder.mutation<{}, Group>({
          query: (group) => ({
            url: "/group/import",
            method: "POST",
            body: group,
          }),
          invalidatesTags: ["Group"],
        }),
    updateGroup: builder.mutation<void, Group>({
      query: ({ _id, ...rest }) => ({
        url: `/group/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Group"],
    }),
    groupDw: builder.query<Group, string>({
      query: () => `/group/groupDw/${user?.aamarId}/${user?.warehouse}`,
      providesTags: ["Group"],
    }),
    deleteGroup: builder.mutation<void, string>({
      query: (id) => ({
        url: `/group/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Group"],
    }),
  }),
});

export const {
  useGroupsQuery,
  useGroupListQuery,
  useGroupNameQuery,
  useGroupDwQuery,
  useGroupsExportQuery,
  useGroupQuery,
  useGroupCountQuery,
  useGroupPaginationQuery,
  useAddGroupMutation,
  useAddImportGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = GroupApi;

export default GroupApi;
