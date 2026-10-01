import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Brand } from "../models/brand.model";

// console.log(BASE_URL);

export const BrandApi = createApi({
  reducerPath: "BrandApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    brands: builder.query<Brand[], void>({
      query: () => "/brand",
      providesTags: ["Brand"],
    }),
    brandsExport: builder.query<Brand[], any>({
      query: ({ aamarId }) => `/brand/export/${aamarId}`,
      providesTags: ["Brand"],
    }),
    brandsNew: builder.query<Brand[], void>({
      query: () => "/brand/new",
      providesTags: ["Brand"],
    }),
    brandCount: builder.query<Brand[], any>({
      query: ({ aamarId }) => `/brand/count/${aamarId}`,
      providesTags: ["Brand"],
    }),
    brandList: builder.query<Brand[], any>({
      query: (aamarId) => `/brand/list/${aamarId}`,
      providesTags: ["Brand"],
    }),
    brandName: builder.query<Brand[], any>({
      query: ({ aamarId, name }) => `/brand/name/${name}/${aamarId}`,
      providesTags: ["Brand"],
    }),
    brand: builder.query<Brand, string>({
      query: (_id) => `/brand/${_id}`, //  not found
      providesTags: ["Brand"],
    }),
    brandPagination: builder.query<Brand, any>({
      query: ({ page, size, aamarId, q }) =>
        `/brand/all/${page}/${size}/${aamarId}?q=${q}`,
      // query: ({page, size, q}) => `/Customer`,
      providesTags: ["Brand"],
    }),
    addImportBrand: builder.mutation<{}, Brand>({
          query: (Brand) => ({
            url: "/brand/import",
            method: "POST",
            body: Brand,
          }),
          invalidatesTags: ["Brand"],
        }),
    addBrand: builder.mutation<{}, Brand>({
      query: (Brand) => ({
        url: "/brand",
        method: "POST",
        body: Brand,
      }),
      invalidatesTags: ["Brand"],
    }),
    updateBrand: builder.mutation<void, Brand>({
      query: ({ _id, ...rest }) => ({
        url: `/brand/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Brand"],
    }),
    deleteBrand: builder.mutation<void, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useBrandsQuery,
  useBrandListQuery,
  useBrandNameQuery,
  useBrandsExportQuery,
  useBrandsNewQuery,
  useBrandCountQuery,
  useBrandPaginationQuery,
  useBrandQuery,
  useAddBrandMutation,
  useAddImportBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = BrandApi;

export default BrandApi;
