import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Warehouse } from "../models/warehouse.model";
// console.log(BASE_URL);

export const WarehouseApi = createApi({
  reducerPath: "WarehouseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Warehouse"],
  endpoints: (builder) => ({
    Warehouses: builder.query<Warehouse[], any>({
      query: ({ aamarId }) => `/warehouse/all/${aamarId}`,
      providesTags: ["Warehouse"],
    }),
    Warehouse: builder.query<Warehouse, string>({
      query: (_id) => `/warehouse/${_id}`,
      providesTags: ["Warehouse"],
    }),
    // masterDamage: builder.query<Warehouse[], void>({
    //     query: (_id) => `/damage/master`,
    //     providesTags: ['Warehouse']
    // }),
     WarehouseCount: builder.query<Warehouse[], any>({
          query: ({aamarId}) => `/warehouse/count/${aamarId}`,
          providesTags: ["Warehouse"],
        }),
    addWarehouse: builder.mutation<{}, Warehouse>({
      query: (Warehouse) => ({
        url: "/warehouse",
        method: "POST",
        body: Warehouse,
      }),
      invalidatesTags: ["Warehouse"],
    }),
    updateWarehouse: builder.mutation<void, Warehouse>({
      query: ({ _id, ...rest }) => ({
        url: `/warehouse/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Warehouse"],
    }),
    deleteWarehouse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/warehouse/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Warehouse"],
    }),
  }),
});

export const {
  useWarehousesQuery,
  useWarehouseQuery,
  useWarehouseCountQuery,
  useAddWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} = WarehouseApi;

export default WarehouseApi;
