import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Tpn } from "../models/tpn.model";

// console.log(BASE_URL);

export const TpnApi = createApi({
  reducerPath: "tpnApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Tpn"],
  endpoints: (builder) => ({
    Tpns: builder.query<Tpn[], any>({
      query: (aamarId) => `/tpn/all/${aamarId}`,
      providesTags: ["Tpn"],
    }),
    Tpn: builder.query<Tpn, string>({
      query: (_id) => `/tpn/${_id}`,
      providesTags: ["Tpn"],
    }),
    TpnByDate: builder.query<Tpn, any>({
      query: ({ startDate, endDate, warehouse, aamarId }) =>
        `/tpn/byDate/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Tpn"],
    }),
    addTpn: builder.mutation<{}, Tpn>({
      query: (Tpn) => ({
        url: "/tpn",
        method: "POST",
        body: Tpn,
      }),
      invalidatesTags: ["Tpn"],
    }),
    updateTpn: builder.mutation<void, Tpn>({
      query: ({ _id, ...rest }) => ({
        url: `/tpn/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Tpn"],
    }),
    TpnCount: builder.query<Tpn[], any>({
      query: ({aamarId}) => `/tpn/count/${aamarId}`,
      providesTags: ["Tpn"],
    }),
    deleteTpn: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tpn/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tpn"],
    }),
  }),
});

export const {
  useTpnsQuery,
  useTpnQuery,
  useTpnCountQuery,
  useTpnByDateQuery,
  useAddTpnMutation,
  useUpdateTpnMutation,
  useDeleteTpnMutation,
} = TpnApi;

export default TpnApi;
