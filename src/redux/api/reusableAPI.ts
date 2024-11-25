import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllReusableProductResponse,
  DeleteReusableProductRequest,
  MessageResponse,
  NewReusableProductRequest,
  ReusableCategoriesResponse,
  ReusableProductResponse,
  SearchReusableProductsRequest,
  SearchReusableProductsResponse,
  UpdateReusableProductRequest,
} from "../../types/api-types";

export const reusableAPI = createApi({
  reducerPath: "reusableApi",
  baseQuery: fetchBaseQuery({
    //@ts-ignore
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/reusable-product/`,
  }),
  tagTypes: ["reusable"],
  endpoints: (builder) => ({
  getUserReusableProducts:builder.query<AllReusableProductResponse,string>({
    query:(userId)=>`user/all?userId=${userId}`,
    providesTags:["reusable"],
  }),
  getLatestReusableProducts:builder.query<AllReusableProductResponse,string>({
    query:()=>`latest`,
    providesTags:["reusable"],
  }),
  getAllReusableCategories:builder.query<ReusableCategoriesResponse,string>({
    query:()=>`categories`,
    providesTags:["reusable"],
  }),
  getAdminReusableProducts:builder.query<AllReusableProductResponse,string>({
    query:(id)=>`admin/all?id=${id}`,
    providesTags:["reusable"],
  }),
  getReusableProductDetails:builder.query<ReusableProductResponse,string>({
    query:(id)=>id,
    providesTags:["reusable"],
  }),
  searchReusableProducts:builder.query<SearchReusableProductsResponse,SearchReusableProductsRequest>({
    query: ({ price, search, sort, category, page }) => {
      let base = `all?search=${search}&page=${page}`;

      if (price) base += `&price=${price}`;
      if (sort) base += `&sort=${sort}`;
      if (category) base += `&category=${category}`;

      return base;
    },
    providesTags: ["reusable"],
  }),
  newReusableProduct:builder.mutation<MessageResponse,NewReusableProductRequest>({
    query: ({ formData, id }) => ({
      url: `new?id=${id}`,
      method: "POST",
      body: formData,
    }),
    invalidatesTags: ["reusable"],
  }),
  updateReusableProduct:builder.mutation<MessageResponse,UpdateReusableProductRequest>({
    query:({formData,id,userId})=>({
      url:`${id}?id=${userId}`,
      method:"PUT",
      body:formData,
    }),
    invalidatesTags:["reusable"],
  }),
  deleteReusableProduct:builder.mutation<MessageResponse,DeleteReusableProductRequest>({
    query:({id,userId})=>({
      url:`${id}?id=${userId}`,
      method:"DELETE",
    }),
    invalidatesTags:["reusable"],
  }),
})
});
export const {
useDeleteReusableProductMutation,
useGetAdminReusableProductsQuery,
useGetAllReusableCategoriesQuery,
useGetLatestReusableProductsQuery,
useGetReusableProductDetailsQuery,
useGetUserReusableProductsQuery,
useNewReusableProductMutation,
useSearchReusableProductsQuery,
useUpdateReusableProductMutation,
} = reusableAPI;
