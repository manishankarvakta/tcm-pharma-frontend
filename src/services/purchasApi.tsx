import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Purchase } from "../models/purchas.model";

// console.log(BASE_URL)

export const PurchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Purchase"],
  endpoints: (builder) => ({
    Purchases: builder.query<Purchase[], void>({
      query: () => "/purchase",
      providesTags: ["Purchase"],
    }),
    PurchasesActive: builder.query<Purchase[], any>({
      query: ({ aamarId, warehouse }) =>
        `/purchase/active/${warehouse}/${aamarId}`,
      providesTags: ["Purchase"],
    }),
    WeeklyPurchases: builder.query<Purchase[], any>({
      query: ({ warehouse, aamarId, startDate, endDate }) => {
        let url = `/purchase/week-purchase/${warehouse}/${aamarId}`;
        if (startDate && endDate) {
          url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        return url;
      },
      providesTags: ["Purchase"],
    }),
    PurchaseByDate: builder.query<Purchase[], any>({
      query: ({ startDate, endDate, warehouse, aamarId }) =>
        `/purchase/byDate/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Purchase"],
    }),
    Purchase: builder.query<Purchase, string>({
      query: (_id) => `/purchase/${_id}`,
      providesTags: ["Purchase"],
    }),
    PurchaseSupplier: builder.query<Purchase, string>({
      query: (_id) => `/purchase/supplier/${_id}`,
      providesTags: ["Purchase"],
    }),
    PurchaseCount: builder.query<Purchase[], any>({
      query: ({aamarId}) => `/purchase/count/${aamarId}`,
      providesTags: ["Purchase"],
    }),
    PurchaseSupplierAccount: builder.query<Purchase, string>({
      query: (_id) => `/purchase/supplier/account/${_id}`,
      providesTags: ["Purchase"],
    }),
    addPurchase: builder.mutation<{}, Purchase>({
      query: (Purchase) => ({
        url: "/purchase",
        method: "POST",
        body: Purchase,
      }),
      invalidatesTags: ["Purchase"],
    }),
    updatePurchase: builder.mutation<void, Purchase>({
      query: ({ _id, ...rest }) => ({
        url: `/purchase/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Purchase"],
    }),
    updatePurchaseP: builder.mutation<void, Purchase>({
      query: ({ _id, ...rest }) => ({
        url: `/purchase/update/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Purchase"],
    }),

    updatePurchaseStatus: builder.mutation<void, Purchase>({
      query: ({ poNo, ...rest }) => ({
        url: `/purchase/status/${poNo}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Purchase"],
    }),
    deletePurchase: builder.mutation<void, string>({
      query: (id) => ({
        url: `/purchase/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Purchase"],
    }),
  }),
});

export const {
  usePurchasesQuery,
  usePurchaseCountQuery,
  usePurchasesActiveQuery,
  usePurchaseByDateQuery,
  useWeeklyPurchasesQuery,
  usePurchaseQuery,
  usePurchaseSupplierAccountQuery,
  usePurchaseSupplierQuery,
  useAddPurchaseMutation,
  useUpdatePurchaseMutation,
  useUpdatePurchasePMutation,
  useUpdatePurchaseStatusMutation,
  useDeletePurchaseMutation,
} = PurchaseApi;

export default PurchaseApi;
