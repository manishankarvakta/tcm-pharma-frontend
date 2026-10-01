import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { signInUser } from "../Components/Utility/Auth";
import { Customer } from "../models/customer.model";

// console.log(BASE_URL);
const auth = signInUser();
// const { aamarId, warehouse } = auth;
const aamarId = auth?.aamarId;
const warehouse = auth?.warehouse;

export const CustomerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    Customers: builder.query<Customer[], any>({
      query: ({ aamarId }) => `/customer/all/${aamarId}`,
      providesTags: ["Customer"],
    }),
    CustomersImport: builder.query<Customer[], any>({
      query: () => `/customer/${warehouse}/${aamarId}`,
      providesTags: ["Customer"],
    }),
    CustomersExport: builder.query<Customer[], any>({
      query: ({ warehouse, aamarId }) =>
        `/customer/export/${warehouse}/${aamarId}`, //  not found
      providesTags: ["Customer"],
    }),
    Customer: builder.query<Customer, string>({
      query: (_id) => `/customer/${_id}`,
      providesTags: ["Customer"],
    }),

    customerCount: builder.query<Customer[], void>({
      query: () => "/customer/count",

      providesTags: ["Customer"],
    }),
    CustomerDW: builder.query<Customer[], void>({
      query: () => `/customer/dw/`,
      providesTags: ["Customer"],
    }),

    customerContact: builder.query<Customer, any>({
      query: ({ page, size, q }) => `/customer/contact/${page}/${size}?q=${q}`,
      // query: ({page, size, q}) => `/Customer`,
      providesTags: ["Customer"],
    }),

    customerPagenation: builder.query<Customer, any>({
      query: ({ page, size, warehouse, aamarId, q }) =>
        `/customer/all/${page}/${size}/${warehouse}/${aamarId}?q=${q}`,
      // query: ({page, size, q}) => `/Customer`,
      providesTags: ["Customer"],
    }),
    addCustomer: builder.mutation<{}, Customer>({
      query: (Customer) => ({
        url: "/customer",
        method: "POST",
        body: Customer,
      }),
      invalidatesTags: ["Customer"],
    }),
    AddImportCustomer: builder.mutation<{}, Customer>({
      query: (Customer) => ({
        url: "/customer/import",
        method: "POST",
        body: Customer,
      }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation<void, Customer>({
      query: ({ _id, ...rest }) => ({
        url: `/customer/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Customer"],
    }),
    updatePointCustomer: builder.mutation<void, Customer>({
      query: ({ _id, ...rest }) => ({
        url: `/customer/point/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Customer"],
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/customer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  useCustomersQuery,
  useCustomersExportQuery,
  useCustomerQuery,
  useCustomersImportQuery,
  // useCustomerPointQuery,
  useCustomerDWQuery,
  useAddCustomerMutation,
  useCustomerCountQuery,
  useCustomerPagenationQuery,
  useCustomerContactQuery,
  useUpdateCustomerMutation,
  useAddImportCustomerMutation,
  useUpdatePointCustomerMutation,
  useDeleteCustomerMutation,
} = CustomerApi;

export default CustomerApi;
