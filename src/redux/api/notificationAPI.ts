import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllNotificationsResponse } from "../../types/api-types";

interface DeleteNotificationResponse {
    message: string;
  }
  
  interface DeleteNotificationArgs {
    userId: string;
    productId: string;
    email: string;
  }

export const notificationAPI = createApi({
  reducerPath: "notificationAPI",
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/notification/`,
}),
  endpoints: (builder) => ({
    // Fetch all notifications for a user
    fetchNotifications: builder.query<AllNotificationsResponse, string>({
      query: (userId) => `all?id=${userId}`,

    }),

    // Delete a notification
    deleteNotification: builder.mutation<DeleteNotificationResponse, DeleteNotificationArgs>({
        query: ({ userId, productId, email }) => ({
          url: `?id=${userId}`,
          method: "DELETE",
          body: { productId, email }
      }),
    }),
  }),
});

export const { useFetchNotificationsQuery, useDeleteNotificationMutation } = notificationAPI;
