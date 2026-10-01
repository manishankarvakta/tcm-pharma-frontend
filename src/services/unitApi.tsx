import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Unit } from "../models/unit.model";

// console.log(BASE_URL);

export const UnitApi = createApi({
  reducerPath: "UnitApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Unit"],
  endpoints: (builder) => ({
    Units: builder.query<Unit[], void>({
      query: () => "/unit",
      providesTags: ["Unit"],
    }),
    unitList: builder.query<Unit[], any>({
      query: () => `/unit`,
      providesTags: ["Unit"],
    }),
    UnitsSearch: builder.query<Unit[], void>({
      query: (q) => `/unit/search/${q}`,
      providesTags: ["Unit"],
    }),
    UnitImport: builder.query<Unit[], any>({
      query: (name) => `/unit/name/${name}`,
      providesTags: ["Unit"],
    }),
    Unit: builder.query<Unit, string>({
      query: (_id) => `/unit/${_id}`,
      providesTags: ["Unit"],
    }),

    addUnit: builder.mutation<{}, Unit>({
      query: (Damage) => ({
        url: "/unit",
        method: "POST",
        body: Damage,
      }),
      invalidatesTags: ["Unit"],
    }),
    updateUnit: builder.mutation<void, Unit>({
      query: ({ _id, ...rest }) => ({
        url: `/unit/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Unit"],
    }),
    deleteUnit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/unit/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Unit"],
    }),
  }),
});

export const {
  useUnitsQuery,
  useUnitListQuery,
  useUnitImportQuery,
  useUnitsSearchQuery,
  useUnitQuery,
  useAddUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = UnitApi;

export default UnitApi;
