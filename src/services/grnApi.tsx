import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { signInUser } from "../Components/Utility/Auth";
import { Grn } from "../models/grn.model";

const auth = signInUser();
const aamarId = auth?.aamarId;

export const GrnApi = createApi({
  reducerPath: "GrnApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Grn"],
  endpoints: (builder) => ({
    Grns: builder.query<Grn[], void>({
      query: () => "/grn",
      providesTags: ["Grn"],
    }),
    WeeklyGrns: builder.query<Grn[], any>({
      query: ({ warehouse, aamarId, startDate, endDate }) => {
        let url = `/grn/week-grn/${warehouse}/${aamarId}`;
        if (startDate && endDate) {
          url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        return url;
      },
      providesTags: ["Grn"],
    }),
    GrnCount: builder.query<Grn[], any>({
      query: ({aamarId}) => `/grn/count/${aamarId}`,
      providesTags: ["Grn"],
    }),
    TodayGrns: builder.query<Grn[], void>({
      query: () => "/grn/today-grn",
      providesTags: ["Grn"],
    }),
    GrnByDate: builder.query<Grn[], any>({
      query: ({ startDate, endDate, warehouse, aamarId }) =>
        `/grn/byDate/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Grn"],
    }),
    Grn: builder.query<Grn, string>({
      query: (_id) => `/grn/${_id}`,
      providesTags: ["Grn"],
    }),
    GrnBySupplier: builder.query<Grn, string>({
      query: (_id) => `/grn/supplier/account/${aamarId}/${_id}`,
      providesTags: ["Grn"],
    }),
    grnPagenation: builder.query<Grn, any>({
      query: ({ page, size, q }) => `/grn/${page}/${size}?q=${q}`,
      // query: ({page, size, q}) => `/Customer`,
      providesTags: ["Grn"],
    }),

    addGrn: builder.mutation<{}, Grn>({
      query: (Grn) => ({
        url: "/grn",
        method: "POST",
        body: Grn,
      }),
      invalidatesTags: ["Grn"],
    }),
    updateGrn: builder.mutation<void, Grn>({
      query: ({ _id, ...rest }) => ({
        url: `/grn/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Grn"],
    }),
    deleteGrn: builder.mutation<void, Grn>({
      query: ({ _id, ...rest }) => ({
        url: `/grn/delete/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Grn"],
    }),
  }),
});

export const {
  useGrnsQuery,
  useWeeklyGrnsQuery,
  useTodayGrnsQuery,
  useGrnByDateQuery,
  useGrnQuery,
  useGrnBySupplierQuery,
  useAddGrnMutation,
  useUpdateGrnMutation,
  useGrnCountQuery,
  useGrnPagenationQuery,
  useDeleteGrnMutation,
} = GrnApi;

export default GrnApi;
