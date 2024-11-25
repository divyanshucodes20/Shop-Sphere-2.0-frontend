import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    AllQeriesResponse,
  AllReusableProductResponse,
  deleteQueryRequest,
  MessageResponse,
  NewQueryRequest,
  QueryResponse,
  UpdateQueryStatusRequest,
  UpdateUserQueryRequest,
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
})
});
export const {

} = reusableAPI;
