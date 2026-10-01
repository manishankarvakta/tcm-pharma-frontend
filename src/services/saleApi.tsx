import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { signInUser } from "../Components/Utility/Auth";
import { Sale } from "../models/sale.model";

// console.log(BASE_URL);
const auth = signInUser();
const aamarId = auth?.aamarId;

export const SaleApi = createApi({
  reducerPath: "SaleApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Sale"],
  endpoints: (builder) => ({
    Sales: builder.query<Sale[], any>({
      query: ({ aamarId }) => `/sale/all/${aamarId}`,
      providesTags: ["Sale"],
    }),
    SalesPointSpent: builder.query<Sale[], void>({
      query: () => `/sale/todayPoint`,
      providesTags: ["Sale"],
    }),
    SalesWeekly: builder.query<Sale[], any>({
      query: ({ warehouse, aamarId, startDate, endDate }) => {
        let url = `/sale/week-sale/${warehouse}/${aamarId}`;
        if (startDate && endDate) {
          url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        return url;
      },
      providesTags: ["Sale"],
    }),
    SaleCount: builder.query<Sale[], any>({
      query: ({ aamarId }) => `/sale/count/${aamarId}`,
      providesTags: ["Sale"],
    }),
    LastSale: builder.query<Sale[], any>({
      query: (params) => {
        let url = `/sale/lastsale`;
        if (params?.warehouse || params?.aamarId) {
          const queryParts = [];
          if (params.aamarId) queryParts.push(`aamarId=${params.aamarId}`);
          if (params.warehouse && params.warehouse !== "allWh") {
            queryParts.push(`warehouse=${params.warehouse}`);
          }
          if (queryParts.length > 0) url += `?${queryParts.join("&")}`;
        }
        return url;
      },
      providesTags: ["Sale"],
    }),
    Sale: builder.query<Sale, string>({
      query: (_id) => `/sale/${_id}`,
      providesTags: ["Sale"],
    }),
    SaleByInvoice: builder.query<Sale, string>({
      query: (invoiceId) => `/sale/invoice/${invoiceId}`,
      providesTags: ["Sale"],
    }),
    SaleByDate: builder.query<Sale[], any>({
      query: ({ startDate, endDate }) => `/sale/byDate/${startDate}/${endDate}`,
      providesTags: ["Sale"],
    }),
    SaleByDateInvoice: builder.query<Sale[], any>({
      query: ({ startDate, endDate, q }) =>
        `/sale/byDateInvoice/${startDate}/${endDate}?q=${q}`,
      providesTags: ["Sale"],
    }),
    SaleByDateAfterSale: builder.query<Sale[], any>({
      query: ({ startDate, endDate, supplier }) =>
        `/sale/aftersale/${startDate}/${endDate}/${supplier}`,
      providesTags: ["Sale"],
    }),
    SaleTotal: builder.query<Sale[], any>({
      query: ({ startDate, endDate, warehouse, aamarId }) =>
        `/sale/total/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Sale"],
    }),
    LossProfitTotal: builder.query<Sale[], any>({
      query: ({ startDate, endDate, warehouse, aamarId }) =>
        `/sale/lossProfitTotal/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Sale"],
    }),
    SaleFootfall: builder.query<Sale[], any>({
      query: ({ startDate, endDate }) =>
        `/sale/footfall/${startDate}/${endDate}/${aamarId}`,
      providesTags: ["Sale"],
    }),
    SaleExportByDate: builder.query<Sale[], any>({
      query: ({ startDate, endDate, warehouse, aamarId }) =>
        `/sale/export/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Sale"],
    }),
    DashboardSaleView: builder.query<Sale[], any>({
      query: ({ startDate, endDate, warehouse, aamarId }) =>
        `/sale/dashboardSaleView/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Sale"],
    }),
    SaleExportByDateAndCat: builder.query<Sale[], any>({
      query: ({ startDate, endDate, cat, warehouse, aamarId }) =>
        `/sale/byCategory/${startDate}/${endDate}/${warehouse}/${aamarId}/${cat}`,
      providesTags: ["Sale"],
    }),
    SaleExportByDatePopular: builder.query<Sale[], any>({
      query: ({ startDate, endDate }) =>
        `/sale/popular-product/${startDate}/${endDate}/${aamarId}`,
      providesTags: ["Sale"],
    }),
    SaleExportByDateAndSupplier: builder.query<Sale[], any>({
      query: ({ startDate, endDate, supplier }) =>
        `/sale/bySupplier/${startDate}/${endDate}/${aamarId}/${supplier}`,
      providesTags: ["Sale"],
    }),
    DelSaleExportByDate: builder.query<Sale[], any>({
      query: ({ startDate, endDate }) =>
        `/sale/exportDel/${startDate}/${endDate}`,
      providesTags: ["Sale"],
    }),

    SaleArticelExportByDate: builder.query<Sale[], any>({
      query: ({ startDate, endDate, warehouse, aamarId, q }) =>
        `/sale/exportArticale/${startDate}/${endDate}/${warehouse}/${aamarId}?q=${q}`,
      providesTags: ["Sale"],
    }),
    SaleCategoryByDate: builder.query<Sale[], any>({
      query: ({ startDate, endDate }) =>
        `/sale/category/${startDate}/${endDate}/${aamarId}`,
      providesTags: ["Sale"],
    }),

    addSale: builder.mutation<{}, Sale>({
      query: (Sale) => ({
        url: "/sale",
        method: "POST",
        body: Sale,
      }),
      invalidatesTags: ["Sale"],
    }),
    updateSale: builder.mutation<void, Sale>({
      query: ({ _id, ...rest }) => ({
        url: `/sale/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Sale"],
    }),
    // deleteSale: builder.mutation<void, string>({
    //     query: (id) => ({
    //         url: `/sale/${ id }`,
    //         method: 'DELETE',
    //     }),
    //     invalidatesTags: ['Sale']
    // }),
    deleteTempSale: builder.mutation<void, Sale>({
      query: ({ _id, ...rest }) => ({
        url: `/sale/${_id}`, //  not found
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Sale"],
    }),
  }),
});

export const {
  useSalesQuery,
  useSaleCountQuery,
  useSalesPointSpentQuery,
  useSalesWeeklyQuery,
  useSaleQuery,
  useSaleByDateQuery,
  useSaleByDateInvoiceQuery,
  useSaleByDateAfterSaleQuery,
  useSaleTotalQuery,
  useLossProfitTotalQuery,
  useSaleFootfallQuery,
  useSaleByInvoiceQuery,
  useDashboardSaleViewQuery,
  useSaleExportByDateQuery,
  useSaleExportByDateAndCatQuery,
  useSaleExportByDatePopularQuery,
  useSaleExportByDateAndSupplierQuery,
  useDelSaleExportByDateQuery,
  useSaleArticelExportByDateQuery,
  useSaleCategoryByDateQuery,
  useLastSaleQuery,
  useAddSaleMutation,
  useDeleteTempSaleMutation,
  useUpdateSaleMutation,
  // useDeleteSaleMutation
} = SaleApi;

export default SaleApi;
