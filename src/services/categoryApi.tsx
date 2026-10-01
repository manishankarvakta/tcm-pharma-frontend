import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from "./baseQuery";
import { Category } from '../models/category.model';

// console.log(BASE_URL)

export const CategoryApi = createApi({
    reducerPath: "CategoryApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        categories: builder.query<Category[], void>({
            query: () => '/category',
            providesTags: ['Category']
        }),
        categoriesExport: builder.query<Category[], void>({
            query: () => '/category/export',
            providesTags: ['Category']
        }),
        category: builder.query<Category, string>({
            query: (_id) => `/category/${_id}`,
            providesTags: ['Category']
        }),
        masterCategory: builder.query<Category[], void>({
            query: () => `/category/master`,
            providesTags: ['Category']
        }),
        categoryPagenation: builder.query<Category, any>({
            query: ({ page, size, q }) => `/category/all/${page}/${size}?q=${q}`,
            providesTags: ['Category']
        }),

        categoryCount: builder.query<Category[], void>({
            query: () => '/category/count',
            providesTags: ['Category']
        }),
        addCategory: builder.mutation<{}, Category>({
            query: Category => ({
                url: '/category',
                method: 'POST',
                body: Category
            }),
            invalidatesTags: ['Category']
        }),
        updateCategory: builder.mutation<void, Category>({
            query: ({ _id, ...rest }) => ({
                url: `/category/${_id}`, 
                method: 'PUT',
                body: rest
            }),
            invalidatesTags: ['Category']
        }),
        uploadCategoryPhoto: builder.mutation<any, any>({
            query: ({ _id, ...rest }) => ({
                url: `/category/upload/category/${_id}`,
                method: 'POST',
                headers: {
                    'content-type': 'multipart/form-data',
                },
                body: rest
            }),
            invalidatesTags: ['Category']
        }),
        deleteCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `/category/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category']
        })
    })
})

export const {
    useCategoriesQuery,
    useCategoriesExportQuery,
    useCategoryQuery,
    useMasterCategoryQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useUploadCategoryPhotoMutation,
    useDeleteCategoryMutation,
    useCategoryPagenationQuery,
    useCategoryCountQuery
} = CategoryApi;

export default CategoryApi;