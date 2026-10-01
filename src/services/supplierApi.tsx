import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Supplier } from "../models/supplier.model";

// console.log(BASE_URL);

export const SupplierApi = createApi({
  reducerPath: "SupplierApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Supplier"],
  endpoints: (builder) => ({
    Supplier: builder.query<Supplier, string>({
      query: (_id) => `/supplier/${_id}`,
      providesTags: ["Supplier"],
    }),

    Suppliers: builder.query<Supplier[], void>({
      query: () => "/supplier",
      providesTags: ["Supplier"],
    }),
    SupplierExport: builder.query<Supplier[], any>({
      query: ({ aamarId }) => `/supplier/export/${aamarId}`,
      providesTags: ["Supplier"],
    }),
    countSupplier: builder.query<Supplier[], any>({
      query: ({ aamarId }) => `/supplier/count/${aamarId}`,
      providesTags: ["Supplier"],
    }),
    supplierList: builder.query<Supplier[], any>({
      query: (aamarId) => `/supplier/list/${aamarId}`,
      providesTags: ["Supplier"],
    }),
    supplierLedger: builder.query<Supplier, any>({
      query: (_id) => `/supplier/ledger/${_id}`,
      providesTags: ["Supplier"],
    }),
    SupplierTest: builder.query<Supplier, string>({
      query: (_id) => `/supplier/test/${_id}`,
      providesTags: ["Supplier"],
    }),
    SupplierByProduct: builder.query<Supplier, string>({
      query: (code) => `/supplier/product/${code}`,
      providesTags: ["Supplier"],
    }),
    addImportSupplier: builder.mutation<{}, Supplier>({
      query: (Supplier) => ({
        url: "/supplier/import",
        method: "POST",
        body: Supplier,
      }),
      invalidatesTags: ["Supplier"],
    }),

    addSupplier: builder.mutation<{}, Supplier>({
      query: (supplier) => ({
        url: "/supplier",
        method: "POST",
        body: supplier,
      }),
      invalidatesTags: ["Supplier"],
    }),
    updateSupplier: builder.mutation<{}, Supplier>({
      query: ({ _id, ...rest }) => ({
        url: `/supplier/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Supplier"],
    }),

    supplierPagenation: builder.query<Supplier, any>({
      query: ({ page, size, aamarId, q }) =>
        `/supplier/${page}/${size}/${aamarId}?q=${q}`,
      // query: ({page, size, q}) => `/Customer`,
      providesTags: ["Supplier"],
    }),

    deleteSupplier: builder.mutation<void, string>({
      query: (id) => ({
        url: `/supplier/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const {
  useSuppliersQuery,
  useSupplierQuery,
  useSupplierListQuery,
  useSupplierTestQuery,
  useSupplierExportQuery,
  useSupplierLedgerQuery,
  useSupplierByProductQuery,
  useSupplierPagenationQuery,
  useCountSupplierQuery,
  useAddSupplierMutation,
  useAddImportSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = SupplierApi;

export default SupplierApi;
