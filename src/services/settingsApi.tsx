import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Settings } from "../models/settings.model";

// console.log(BASE_URL)

export const SettingsApi = createApi({
  reducerPath: "SettingsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    // Fetch settings
    Settings: builder.query<Settings, any>({
      query: (aamarId) => `/settings/${aamarId}`,
      providesTags: ["Settings"],
    }),

    // Add new settings
    addSettings: builder.mutation<{}, Settings>({
      query: (settingsData) => ({
        url: "/settings",
        method: "POST",
        body: settingsData,
      }),
      invalidatesTags: ["Settings"],
    }),

    // Update settings
    updateSettings: builder.mutation<void, Settings>({
      query: ({ aamarId, ...rest }) => ({
        url: `/settings/${aamarId}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Settings"],
    }),

    // Fetch specific setting by _id
    getSettingById: builder.query<Settings, string>({
      query: (_id) => `settings/${_id}`,
      providesTags: ["Settings"],
    }),

    // Fetch settings for a specific warehouse
    // getSettingForWarehouse: builder.query<Settings, string>({
    //   query: (warehouse) => /settings/warehouse/${warehouse},
    //   providesTags: ["Settings"],
    // }),
  }),
});

export const {
  useSettingsQuery,
  useAddSettingsMutation,
  useUpdateSettingsMutation,
  useGetSettingByIdQuery,
  //   useGetSettingForWarehouseQuery,
} = SettingsApi;

export default SettingsApi;
