import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Generic } from "../models/generic.model";

// console.log(BASE_URL);

export const GenericApi = createApi({
  reducerPath: "GenericApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Generic"],
  endpoints: (builder) => ({
    Generics: builder.query<Generic[], void>({
      query: () => "/generic",
      providesTags: ["Generic"],
    }),
    GenericsExport: builder.query<Generic[], any>({
      query: ({ aamarId }) => `/generic/export/${aamarId}`,
      providesTags: ["Generic"],
    }),
    GenericsNew: builder.query<Generic[], void>({
      query: () => "/generic/new",
      providesTags: ["Generic"],
    }),
    genericCount: builder.query<Generic[], any>({
      query: ({ aamarId }) => `/generic/count/${aamarId}`,
      providesTags: ["Generic"],
    }),
    genericList: builder.query<Generic[], any>({
      query: (aamarId) => `/generic/list/${aamarId}`,
      providesTags: ["Generic"],
    }),
    genericName: builder.query<Generic[], any>({
      query: ({ aamarId, name }) => `/generic/name/${name}/${aamarId}`,
      providesTags: ["Generic"],
    }),
    genericPagination: builder.query<Generic[], any>({
      query: ({ page, size, aamarId, q }) =>
        `/generic/all/${page}/${size}/${aamarId}?q=${q}`,
      // query: ({page, size, q}) => `/Customer`,
      providesTags: ["Generic"],
    }),
    GenericsSearch: builder.query<Generic[], string>({
      query: (q) => `/generic/search/${q}`,
      providesTags: ["Generic"],
    }),
    Generic: builder.query<Generic, string>({
      query: (_id) => `/generic/${_id}`,
      providesTags: ["Generic"],
    }),
    addGeneric: builder.mutation<{}, Generic>({
      query: (Generic) => ({
        url: "/generic",
        method: "POST",
        body: Generic,
      }),
      invalidatesTags: ["Generic"],
    }),
    addImportGeneric: builder.mutation<{}, Generic>({
      query: (Generic) => ({
        url: "/generic/import",
        method: "POST",
        body: Generic,
      }),
      invalidatesTags: ["Generic"],
    }),
    updateGeneric: builder.mutation<void, Generic>({
      query: ({ _id, ...rest }) => ({
        url: `/generic/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Generic"],
    }),
    deleteGeneric: builder.mutation<void, string>({
      query: (id) => ({
        url: `/generic/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Generic"],
    }),
  }),
});

export const {
  useGenericsQuery,
  useGenericsExportQuery,
  useGenericListQuery,
  useGenericNameQuery,
  useGenericsNewQuery,
  useGenericCountQuery,
  useGenericPaginationQuery,
  useGenericsSearchQuery,
  useGenericQuery,
  useAddGenericMutation,
  useAddImportGenericMutation,
  useUpdateGenericMutation,
  useDeleteGenericMutation,
} = GenericApi;

export default GenericApi;
