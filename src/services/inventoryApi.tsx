import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Inventory } from "../models/inventory.model";

// console.log(BASE_URL);

export const InventoryApi = createApi({
  reducerPath: "InventoryApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Inventory"],
  endpoints: (builder) => ({
    Inventories: builder.query<Inventory[], any>({
      query: ({ warehouse, aamarId, q, startDate, endDate }) => {
        const params = new URLSearchParams({
          q: q || "",
          aamarId: aamarId || "",
          warehouseId: warehouse || "",
        });
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return `/stock-ledger/stock-summary?${params.toString()}`;
      },
      transformResponse: (response: { data: Inventory[] }) => response.data,
      providesTags: ["Inventory"],
    }),
    InventoryExport: builder.query<Inventory[], any>({
      query: () => `/inventory/export`,
      providesTags: ["Inventory"],
    }),
    InventoriesAll: builder.query<Inventory[], any>({
      query: () => `/inventory`,
      providesTags: ["Inventory"],
    }),
    InventoriesCount: builder.query<Inventory[], any>({
      query: () => `/inventory/count`,
      providesTags: ["Inventory"],
    }),
    Inventory: builder.query<Inventory, string>({
      query: (_id) => `/inventory/${_id}`,
      providesTags: ["Inventory"],
    }),
    inventoryByArticle: builder.query<Inventory, string>({
      query: (article_code) => `/inventory/article_code/${article_code}`,
      providesTags: ["Inventory"],
    }),
    inventoryCount: builder.query<any, void>({
      query: () => "/inventory/count",
      providesTags: ["Inventory"],
    }),
    masterInventory: builder.query<Inventory[], void>({
      query: (_id) => `/inventory/master`, //  not found
      providesTags: ["Inventory"],
    }),
    addInventory: builder.mutation<{}, Inventory>({
      query: (Inventory) => ({
        url: "/inventory",
        method: "POST",
        body: Inventory,
      }),
      invalidatesTags: ["Inventory"],
    }),
    addInventoryPrice: builder.mutation<{}, Inventory>({
      query: (Inventory) => ({
        url: "/inventory/price", //  not found
        method: "POST",
        body: Inventory,
      }),
      invalidatesTags: ["Inventory"],
    }),
    updateInventory: builder.mutation<void, any>({
      query: ({ _id, ...rest }) => ({
        url: `/inventory/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Inventory"],
    }),
    adjustInventory: builder.mutation<void, any>({
      query: (Inventory) => ({
        url: `/inventory/adjust`,
        method: "PUT",
        body: Inventory,
      }),
      invalidatesTags: ["Inventory"],
    }),
    deleteInventory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/inventory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),
    stockLedger: builder.query<any, any>({
      query: ({ aamarId, page, size, search, startDate, endDate }) => {
        const params = new URLSearchParams({
            page: page?.toString() || "0",
            size: size?.toString() || "10",
        });
        if (search) params.append("search", search);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        // Note: The backend route doesn't seem to use aamarId in the path, but filter by it if needed.
        // However, standard pattern here involves aamarId in path for some endpoints.
        // Checking stockLedgerRouter, it uses req.query for filters. 
        // It does NOT seem to filter by aamarId in the router code I saw! 
        // Wait, if I look at stockLedgerRouter.js again:
        // const { startDate, endDate, productId, warehouseId, transactionType, action } = req.query;
        // It does NOT extract aamarId from query. 
        // But the Schema has `aamarId`.
        // I should probably add `aamarId` to the query params in the frontend, 
        // and MAYBE update the backend router to filter by it if it's missing.
        // For now, I will match the frontend request to pass it as query param.
        if (aamarId) params.append("aamarId", aamarId);
        
        return {
            url: `/stock-ledger?${params.toString()}`,
            method: "GET"
        };
      },
      providesTags: ["Inventory"], 
    }),
  }),
});

export const {
  useInventoriesQuery,
  useInventoryExportQuery,
  useInventoriesAllQuery,
  useInventoriesCountQuery,
  useInventoryByArticleQuery,
  useInventoryCountQuery,
  useInventoryQuery,
  useMasterInventoryQuery,
  useAddInventoryMutation,
  useAddInventoryPriceMutation,
  useUpdateInventoryMutation,
  useAdjustInventoryMutation,
  useDeleteInventoryMutation,
  useStockLedgerQuery,
} = InventoryApi;

export default InventoryApi;
