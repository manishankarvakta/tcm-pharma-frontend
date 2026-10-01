import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Product } from "../models/product.model";

// console.log(BASE_URL)

export const ProductApi = createApi({
  reducerPath: "ProductApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    products: builder.query<Product[], void>({
      query: () => "/product",
      providesTags: ["Product"],
    }),
    productsExport: builder.query<Product[], any>({
      query: ({ aamarId }) => `/product/export/${aamarId}`,
      providesTags: ["Product"],
    }),
    ProductCount: builder.query<Product[], any>({
      query: ({ aamarId }) => `/product/count/${aamarId}`,
      providesTags: ["Product"],
    }),
    productTotalLedger: builder.query<Product[], void>({
      query: () => "/product/pledger",
      providesTags: ["Product"],
    }),
    productLast: builder.query<Product[], void>({
      query: () => "/product/last",
      providesTags: ["Product"],
    }),
    productPopular: builder.query<Product[], any>({
      query: ({ aamarId }) => `/product/export/${aamarId}`,
      providesTags: ["Product"],
    }),
    product: builder.query<Product, string>({
      query: (_id) => `/product/${_id}`,
      providesTags: ["Product"],
    }),
    ProductDetails: builder.query<Product, string>({
      query: (_id) => `/product/details/${_id}`,
      providesTags: ["Product"],
    }),
    ProductAllDetails: builder.query<Product, string>({
      query: (_id) => `/product/all-details/${_id}`,
      providesTags: ["Product"],
    }),
    productPrice: builder.query<Product, string>({
      query: (_id) => `/product/price/${_id}`,
      providesTags: ["Product"],
    }),
    productInfo: builder.query<Product, string>({
      query: (_id) => `/product/infoPrice/${_id}`, //  not found
      providesTags: ["Product"],
    }),
    productPagenation: builder.query<Product, any>({
      query: ({ page, size, aamarId, q }) =>
        `/product/all/${page}/${size}/${aamarId}?q=${q}`,
      // query: ({page, size, q}) => `/product`,
      providesTags: ["Product"],
    }),
    productLedgerPagenation: builder.query<Product, any>({
      query: ({ startDate, endDate, page, size, q }) =>
        `/product/ledger/${startDate}/${endDate}/${page}/${size}?q=${q}`,
      // query: ({page, size, q}) => `/product`,
      providesTags: ["Product"],
    }),
    productLedgerExport: builder.query<Product, any>({
      query: ({ start, end }) => `/product/ledger/export/${start}/${end}`,
      providesTags: ["Product"],
    }),
    productLedgerDetails: builder.query<Product, any>({
      query: ({ id, startDate, endDate }) =>
        `/product/ledger/${id}/${startDate}/${endDate}`,
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation<{}, Product>({
      query: (Product) => ({
        url: "/product",
        method: "POST",
        body: Product,
      }),
      invalidatesTags: ["Product"],
    }),
    addImportProduct: builder.mutation<{}, Product>({
      query: (Product) => ({
        url: "/product/import",
        method: "POST",
        body: Product,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<void, Product>({
      query: ({ _id, ...rest }) => ({
        url: `/product/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProductPrice: builder.mutation<void, Product>({
      query: ({ _id, ...rest }) => ({
        url: `/product/price/${_id}`, //  not found
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProductMrp: builder.mutation<void, Product>({
      query: ({ _id, ...rest }) => ({
        url: `/product/mrp/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useProductsQuery,
  useProductsExportQuery,
  useProductTotalLedgerQuery,
  useProductPopularQuery,
  useProductQuery,
  useProductDetailsQuery,
  useProductAllDetailsQuery,
  useProductInfoQuery,
  useProductPriceQuery,
  useProductCountQuery,
  useProductLastQuery,
  useProductPagenationQuery,
  useProductLedgerPagenationQuery,
  useProductLedgerExportQuery,
  useProductLedgerDetailsQuery,
  useAddProductMutation,
  useAddImportProductMutation,
  useUpdateProductMutation,
  useUpdateProductPriceMutation,
  useUpdateProductMrpMutation,
  useDeleteProductMutation,
} = ProductApi;

export default ProductApi;
