import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    AllQeriesResponse,
  deleteQueryRequest,
  MessageResponse,
  NewQueryRequest,
  QueryResponse,
  UpdateQueryStatusRequest,
  UpdateUserQueryRequest,
} from "../../types/api-types";

export const queryAPI = createApi({
  reducerPath: "queryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/query/`,
  }),
  tagTypes: ["query"],
  endpoints: (builder) => ({
    getUserQueries:builder.query<AllQeriesResponse,string>({
        query: (userId) => `user/?userId=${userId}`,
        providesTags: ["query"],
    }),
    getQueryById:builder.query<QueryResponse,string>({
       query:(id)=>id,
         providesTags:["query"],
    }),
    getAdminQueries:builder.query<AllQeriesResponse,string>({
        query:(id)=>`all?id=${id}`,
        providesTags:["query"],
    }),
    getAdminPickups:builder.query<AllQeriesResponse,string>({
        query:(id)=>`pickups?id=${id}`,
        providesTags:["query"],
    }),
    updateQueryStatus:builder.mutation<MessageResponse,UpdateQueryStatusRequest>({
        query:({id,userId})=>({
          url:`${id}?id=${userId}`,
          method:"PUT"
        }),
        invalidatesTags:["query"],
  }),
  getAdminPendingReUsableProducts:builder.query<AllQeriesResponse,string>({
    query:(id)=>`pending?id=${id}`,
    providesTags:["query"],
  }),
  newQuery:builder.mutation<MessageResponse,NewQueryRequest>({
        query:({formData,userId})=>({
         url:`new?userId=${userId}`,
            method:"POST",
            body:formData,
        }),
        invalidatesTags:["query"],
  }),
  deleteQuery:builder.mutation<MessageResponse,UpdateQueryStatusRequest>({
    query:({id,userId})=>({
        url:`${id}?id=${userId}`,
        method:"DELETE",
    }),
    invalidatesTags:["query"],
  }),
  deleteUserQuery:builder.mutation<MessageResponse,deleteQueryRequest>({
    query:({id,userId})=>({
        url:`user/${id}?userId=${userId}`,
        method:"DELETE"
    }),
    invalidatesTags:["query"],
  }),
  updateUserQuery:builder.mutation<MessageResponse,UpdateUserQueryRequest>({
    query:({userId,id,formData})=>({
        url:`user/${id}?userId=${userId}`,
        method:"PUT",
        body:formData,
    }),
    invalidatesTags:["query"],
  }),
})
});
export const {
useGetAdminPickupsQuery,
useGetAdminQueriesQuery,
useGetQueryByIdQuery,
useGetUserQueriesQuery,
useUpdateQueryStatusMutation,
useNewQueryMutation,
useDeleteQueryMutation,
useDeleteUserQueryMutation,
useUpdateUserQueryMutation,
useGetAdminPendingReUsableProductsQuery
} = queryAPI;
