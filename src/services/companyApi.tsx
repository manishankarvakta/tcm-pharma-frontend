import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from "./baseQuery";
import { Company } from '../models/company.model';

// console.log(BASE_URL)

export const CompanyApi = createApi({
    reducerPath: "companyApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Company'],
    endpoints: (builder) => ({
        Companies: builder.query<Company[], void>({
            query: () => '/Company',
            providesTags: ['Company']
        }),
        Company: builder.query<Company, string>({
            query: (_id) => `/Company/${ _id }`,
            providesTags: ['Company']
        }),
        masterCompany: builder.query<Company[], void>({
            query: (_id) => `/Company/master`,
            providesTags: ['Company']
        }),
        addCompany: builder.mutation<{}, Company>({
            query: Company => ({
                url: '/company',
                method: 'POST',
                body: Company    
            }),
            invalidatesTags: ['Company']
        }),
        updateCompany: builder.mutation<void, Company>({
            query: ({_id, ...rest}) => ({
                url: `/company/${ _id }`,
                method: 'PUT',
                body: rest
            }),
            invalidatesTags: ['Company']
        }),
        deleteCompany: builder.mutation<void, string>({
            query: (id) => ({
                url: `/company/${ id }`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Company']
        })
    })
})

export const {
    useCompaniesQuery,
    useCompanyQuery,
    useMasterCompanyQuery,
    useAddCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation
} = CompanyApi;

export default CompanyApi;