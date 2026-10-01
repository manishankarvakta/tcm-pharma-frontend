import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const stockLedgerApi = createApi({
  reducerPath: "stockLedgerApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["StockLedger"],
  endpoints: (builder) => ({
    getStockLedger: builder.query<any, any>({
      query: ({ page, size, startDate, endDate, productId, warehouseId, transactionType, action }) => {
        const params = new URLSearchParams({
          page: page?.toString() || "0",
          size: size?.toString() || "10",
        });

        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (productId) params.append("productId", productId);
        if (warehouseId) params.append("warehouseId", warehouseId);
        if (transactionType) params.append("transactionType", transactionType);
        if (action) params.append("action", action);

        return `/stock-ledger?${params.toString()}`;
      },
      providesTags: ["StockLedger"],
    }),
  }),
});

export const { useGetStockLedgerQuery } = stockLedgerApi;
export default stockLedgerApi;
