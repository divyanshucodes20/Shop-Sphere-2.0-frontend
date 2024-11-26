import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllUserPendingPaymentsResponse, MessageResponse, PaymentDetailsRequest, PaymentDetailsResponse } from "../../types/api-types";


export const userPaymentAPI = createApi({
  reducerPath: "userPaymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/userPayment/`,
  }),
  tagTypes: ["userPayment"],
  endpoints: (builder) => ({
  getUserPendingPayments:builder.query<AllUserPendingPaymentsResponse,string>({
    query:(userId)=>`user/pending?userId=${userId}`,
    providesTags:["userPayment"],
  }),
  getUserCompletedPayments:builder.query<AllUserPendingPaymentsResponse,string>({
    query:(userId)=>`user/completed?userId=${userId}`,
    providesTags:["userPayment"],
  }),
  getUserAllPayments:builder.query<AllUserPendingPaymentsResponse,string>({
    query:(userId)=>`user?userId=${userId}`,
    providesTags:["userPayment"],
  }),
  getAdminPendingPayments:builder.query<AllUserPendingPaymentsResponse,string>({
    query:(id)=>`pending?id=${id}`,
    providesTags:["userPayment"],
  }),
  getPaymentById:builder.query<PaymentDetailsResponse,PaymentDetailsRequest>({
    query:({paymentId,userId})=>`pending/${paymentId}?id=${userId}`,
    providesTags:["userPayment"],
  }),
  processPayment:builder.mutation<MessageResponse,PaymentDetailsRequest>({
    query:({paymentId,userId})=>({
        url: `pending/${paymentId}?id=${userId}`,
        method: "PUT",
    }),
    invalidatesTags:["userPayment"],
  }),
  getAdminAllPayments:builder.query<AllUserPendingPaymentsResponse,string>({
    query:(id)=>`all?id=${id}`,
    providesTags:["userPayment"],
  }),
  getAdminCompletedPayments:builder.query<AllUserPendingPaymentsResponse,string>({
    query:(id)=>`completed?id=${id}`,
    providesTags:["userPayment"],
  }),
})
});
export const {
useGetAdminPendingPaymentsQuery,
useGetPaymentByIdQuery,
useGetUserAllPaymentsQuery,
useGetUserCompletedPaymentsQuery,
useGetUserPendingPaymentsQuery,
useProcessPaymentMutation,
useGetAdminAllPaymentsQuery,
useGetAdminCompletedPaymentsQuery
} = userPaymentAPI;
