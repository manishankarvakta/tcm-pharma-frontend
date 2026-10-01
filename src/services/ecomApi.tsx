import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { EcomSale } from "../models/ecomSale.model";

// console.log(BASE_URL)

export const EcomSaleApi = createApi({
    reducerPath: "EcomSaleApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ['EcomSale'],
    endpoints: (builder) => ({
        ecomSales: builder.query<EcomSale[], void>({
            query: () => `/ecom/sale`, 
            providesTags: ['EcomSale']
        }),
        ecomSalesByStatus: builder.query<EcomSale[], string>({
            query: (status) => `/ecom/sale/${status}`, //  not found
            providesTags: ['EcomSale']
        }),
        ecomSalesById: builder.query<EcomSale[], string>({
            query: (id) => `/ecom/sale/details/${id}`,
            providesTags: ['EcomSale']
        }),
        updateEcomSale: builder.mutation<void, EcomSale>({
            query: ({ _id, ...rest }) => ({
                url: `/ecom/sale/${_id}`,
                method: 'PUT',
                body: rest
            }),
            invalidatesTags: ['EcomSale']
        }),
    })
})
export const {
    useEcomSalesQuery,
    useEcomSalesByStatusQuery,
    useEcomSalesByIdQuery,
    useUpdateEcomSaleMutation,
} = EcomSaleApi;

export default EcomSaleApi;