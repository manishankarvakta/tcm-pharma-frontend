import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { Product } from "../models/product.model";

// console.log(BASE_URL);

export const SearchApi = createApi({
  reducerPath: "SearchApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    productSearch: builder.query<Product[], any>({
      query: ({q}) => `/product/search/${q}`,
      providesTags: ["Product"],
    }),
    // ecomSearch: builder.query<Product[], String>({
    //   query: (q) => `/product/search/${q}`,
    //   providesTags: ["Product"],
    // }),
  }),
});

export const { useProductSearchQuery } = SearchApi;

export default SearchApi;
