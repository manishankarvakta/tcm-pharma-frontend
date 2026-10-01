import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Price } from "../models/price.model";

// console.log(BASE_URL);

export const PriceApi = createApi({
  reducerPath: "priceApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Price"],
  endpoints: (builder) => ({
    Prices: builder.query<Price[], void>({
      query: () => "/price",
      providesTags: ["Price"],
    }),
    PricesExport: builder.query<Price[], void>({
      query: () => "/price/export",
      providesTags: ["Price"],
    }),
    Price: builder.query<Price, string>({
      query: (_id) => `/price/${_id}`,
      providesTags: ["Price"],
    }),
    PriceByProduct: builder.query<Price, string>({
      query: (_id) => `/price/product/${_id}`,
      providesTags: ["Price"],
    }),
    PriceByProductSwitch: builder.query<Price, string>({
      query: (_id) => `/price/productswitch/${_id}`,
      providesTags: ["Price"],
    }),
    addPrice: builder.mutation<{}, Price>({
      query: (Price) => ({
        url: "/price",
        method: "POST",
        body: Price,
      }),
      // TODO:: GET RESPONSE
      invalidatesTags: [{ type: "Price", id: "LIST" }],
    }),
    addNewPrice: builder.mutation<{}, Price>({
      query: (Price) => ({
        url: "/price/new",
        method: "POST",
        body: Price,
      }),
      // TODO:: GET RESPONSE
      invalidatesTags: ["Price"],
    }),
    addPriceMulti: builder.mutation<{}, Price>({
      query: (Price) => ({
        url: "/price/multiprice",
        method: "PUT",
        body: Price,
      }),
      // TODO:: GET RESPONSE
      invalidatesTags: [{ type: "Price", id: "LIST" }],
    }),
    updatePrice: builder.mutation<void, Price>({
      query: ({ _id, ...rest }) => ({
        url: `/price/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Price"],
    }),
    updateEditPrice: builder.mutation<void, Price>({
      query: ({ _id, ...rest }) => ({
        url: `/price/edit/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Price"],
    }),
    deletePrice: builder.mutation<void, string>({
      query: (id) => ({
        url: `/price/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Price"],
    }),
  }),
});

export const {
  usePricesQuery,
  usePricesExportQuery,
  usePriceQuery,
  usePriceByProductQuery,
  usePriceByProductSwitchQuery,
  useAddPriceMutation,
  useAddNewPriceMutation,
  useAddPriceMultiMutation,
  useUpdatePriceMutation,
  useUpdateEditPriceMutation,
  useDeletePriceMutation,
} = PriceApi;

export default PriceApi;
