import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Rtv } from "../models/rtv.model";

// console.log(BASE_URL);

export const RtvApi = createApi({
  reducerPath: "RtvApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Rtv"],
  endpoints: (builder) => ({
    Rtves: builder.query<Rtv[], void>({
      query: () => "/Rtv",
      providesTags: ["Rtv"],
    }),
    RtvByDate: builder.query<Rtv, any>({
      query: ({ startDate, endDate, warehouse, aamarId }) =>
        `/rtv/byDate/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Rtv"],
    }),
    Rtv: builder.query<Rtv, string>({
      query: (_id) => `/Rtv/${_id}`,
      providesTags: ["Rtv"],
    }),

    addRtv: builder.mutation<{}, Rtv>({
      query: (Rtv) => ({
        url: "/Rtv",
        method: "POST",
        body: Rtv,
      }),
      invalidatesTags: ["Rtv"],
    }),
    updateRtv: builder.mutation<void, Rtv>({
      query: ({ _id, ...rest }) => ({
        url: `/Rtv/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Rtv"],
    }),
    deleteRtv: builder.mutation<void, string>({
      query: (id) => ({
        url: `/Rtv/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rtv"],
    }),

    rtvCount: builder.query<Rtv[], any>({
      query: ({aamarId}) => `/rtv/count/${aamarId}`,

      providesTags: ["Rtv"],
    }),

    rtvPagenation: builder.query<Rtv, any>({
      query: ({ page, size, q }) => `/rtv/${page}/${size}?q=${q}`,
      // query: ({page, size, q}) => `/Customer`,
      providesTags: ["Rtv"],
    }),
  }),
});

export const {
  useRtvesQuery,
  useRtvByDateQuery,
  useRtvQuery,
  useAddRtvMutation,
  useUpdateRtvMutation,
  useRtvCountQuery,
  useRtvPagenationQuery,
  useDeleteRtvMutation,
} = RtvApi;

export default RtvApi;
