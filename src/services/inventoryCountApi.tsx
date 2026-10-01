import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { InventoryCount } from "../models/inventoryCount.model";

// console.log(BASE_URL);

export const InventoryCountApi = createApi({
  reducerPath: "InventoryCountApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["InventoryCount"],
  endpoints: (builder) => ({
    inventories: builder.query<InventoryCount[], void>({
      query: () => "/inventoryCount",
      providesTags: ["InventoryCount"],
    }),
    inventoryCountByUser: builder.query<InventoryCount, string>({
      query: (_id) => `/inventoryCount/byUser/${_id}`,
      providesTags: ["InventoryCount"],
    }),
    inventoryCount: builder.query<InventoryCount, string>({
      query: (_id) => `/inventoryCount/${_id}`,
      providesTags: ["InventoryCount"],
    }),
    addInventoryCount: builder.mutation<{}, InventoryCount>({
      query: (InventoryCount) => ({
        url: "/inventoryCount",
        method: "POST",
        body: InventoryCount,
      }),
      invalidatesTags: ["InventoryCount"],
    }),
    updateInventoryCount: builder.mutation<void, any>({
      query: ({ _id, ...rest }) => ({
        url: `/inventoryCount/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["InventoryCount"],
    }),
    deleteInventoryCount: builder.mutation<void, string>({
      query: (id) => ({
        url: `/inventoryCount/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InventoryCount"],
    }),
  }),
});

export const {
  useInventoriesQuery,
  useInventoryCountQuery,
  useInventoryCountByUserQuery,
  useAddInventoryCountMutation,
  useUpdateInventoryCountMutation,
  useDeleteInventoryCountMutation,
} = InventoryCountApi;

export default InventoryCountApi;
