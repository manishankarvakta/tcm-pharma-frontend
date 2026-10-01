import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Damage } from "../models/damage.model";

// console.log(BASE_URL);

export const DamageApi = createApi({
  reducerPath: "damageApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Damage"],
  endpoints: (builder) => ({
    Damages: builder.query<Damage[], void>({
      query: () => "/damage",
      providesTags: ["Damage"],
    }),
    TodayDamages: builder.query<Damage[], void>({
      query: () => "/damage/today-damage",
      providesTags: ["Damage"],
    }),
    DamagesExport: builder.query<Damage, any>({
      query: ({ startDate, endDate, warehouse }) =>
        `/damage/export/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Damage"],
    }),
    DamageByDate: builder.query<Damage, any>({
      query: ({ startDate, endDate, warehouse, aamarId }) =>
        `/damage/byDate/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Damage"],
    }),
    Damage: builder.query<Damage, string>({
      query: (_id) => `/damage/${_id}`,
      providesTags: ["Damage"],
    }),

    addDamage: builder.mutation<{}, Damage>({
      query: (Damage) => ({
        url: "/damage",
        method: "POST",
        body: Damage,
      }),
      invalidatesTags: ["Damage"],
    }),
    DamageCount: builder.query<Damage[], any>({
      query: ({aamarId}) => `/damage/count/${aamarId}`,
      providesTags: ["Damage"],
    }),
    updateDamage: builder.mutation<void, Damage>({
      query: ({ _id, ...rest }) => ({
        url: `/damage/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Damage"],
    }),
    deleteDamage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/damage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Damage"],
    }),
  }),
});

export const {
  useDamagesQuery,
  useDamageCountQuery,
  useTodayDamagesQuery,
  useDamageByDateQuery,
  useDamagesExportQuery,
  useDamageQuery,
  useAddDamageMutation,
  useUpdateDamageMutation,
  useDeleteDamageMutation,
} = DamageApi;

export default DamageApi;
