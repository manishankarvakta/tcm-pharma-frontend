import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const ReportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Reports"],
  endpoints: (builder) => ({
    CustomerWiseSales: builder.query<void[], any>({
      query: ({ aamarId, warehouse, startDate, endDate, customerId }) =>
        `/reports/customerWiseSales/${startDate}/${endDate}/${warehouse}/${aamarId}/${customerId}`,
      providesTags: ["Reports"],
    }),
    billerWiseSales: builder.query<void[], any>({
      query: ({ aamarId, warehouse, startDate, endDate,billerId }) =>
        `/reports/billerWiseSales/${startDate}/${endDate}/${warehouse}/${aamarId}/${billerId}`,
      providesTags: ["Reports"],
    }),
    SaleReturnWise: builder.query<void[], any>({
      query: ({ aamarId, warehouse, startDate, endDate }) =>
        `/reports/saleReturnWise/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Reports"],
    }),
    InvoiceWiseProfit: builder.query<void[], any>({
      query: ({ aamarId, warehouse, startDate, endDate }) =>
        `/reports/invoiceWiseProfit/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Reports"],
    }),
    ProductWiseSales: builder.query<void[], any>({
      query: ({ aamarId, warehouse, startDate, endDate,productId }) =>
        `/reports/productWiseSales/${startDate}/${endDate}/${warehouse}/${aamarId}/${productId}`,
      providesTags: ["Reports"],
    }),
    UserWiseSales: builder.query<void[], any>({
      query: ({ aamarId, warehouse, startDate, endDate,userId }) =>
        `/reports/userWiseSales/${startDate}/${endDate}/${warehouse}/${aamarId}/${userId}`,
      providesTags: ["Reports"],
    }),
    InvoiceWiseProduct: builder.query<void[], any>({
      query: ({ aamarId, warehouse, startDate, endDate,invoiceId }) =>
        `/reports/invoiceWiseProduct/${startDate}/${endDate}/${warehouse}/${aamarId}/${invoiceId}`,
      providesTags: ["Reports"],
    }),
    DateWisePurchase: builder.query<void[], any>({
      query: ({ aamarId, warehouse, startDate, endDate }) =>
        `/reports/dateWisePurchase/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Reports"],
    }),
    SupplierWisePurchase: builder.query<void[], any>({
      query: ({ aamarId, warehouse, startDate, endDate,supplier }) =>
        `/reports/supplierWisePurchase/${startDate}/${endDate}/${warehouse}/${aamarId}/${supplier}`,
      providesTags: ["Reports"],
    }),
    ProductWisePurchase: builder.query<void[], any>({
      query: ({ aamarId, warehouse, startDate, endDate,productId }) =>
        `/reports/productWisePurchase/${startDate}/${endDate}/${warehouse}/${aamarId}/${productId}`,
      providesTags: ["Reports"],
    }),
    UserWisePurchase: builder.query<void[], any>({
      query: ({ aamarId, warehouse, startDate, endDate,userId }) =>
        `/reports/userWisePurchase/${startDate}/${endDate}/${warehouse}/${aamarId}/${userId}`,
      providesTags: ["Reports"],
    }),
    ProfitLossReport: builder.query<void[], any>({
      query: ({ aamarId, warehouse, startDate, endDate }) =>
        `/reports/lossProfit/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Reports"],
    }),
    SupplierWiseSales: builder.query<void[], any>({
      query: ({ aamarId, warehouse, startDate, endDate, supplierId }) =>
        `/reports/supplierWiseSales/${startDate}/${endDate}/${warehouse}/${aamarId}/${supplierId}`,
      providesTags: ["Reports"],
    }),
  }),
});

export const {
  useCustomerWiseSalesQuery,
  useBillerWiseSalesQuery,
  useSaleReturnWiseQuery,
  useInvoiceWiseProfitQuery,
  useProductWiseSalesQuery,
  useUserWiseSalesQuery,
  useInvoiceWiseProductQuery,
  useDateWisePurchaseQuery,
  useSupplierWisePurchaseQuery,
  useProductWisePurchaseQuery,
  useUserWisePurchaseQuery,
  useProfitLossReportQuery,
  useSupplierWiseSalesQuery,
  
} = ReportsApi;

export default ReportsApi;
