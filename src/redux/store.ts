import { configureStore } from "@reduxjs/toolkit";
import { productAPI } from "./api/productAPI";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";
import { orderApi } from "./api/orderAPI";
import { dashboardApi } from "./api/dashboardAPI";
import { notificationAPI } from "./api/notificationAPI";
import { queryAPI } from "./api/queryAPI";
import { reusableAPI } from "./api/reusableAPI";
import { userPaymentAPI } from "./api/userPaymentAPI";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [notificationAPI.reducerPath]: notificationAPI.reducer,
    [queryAPI.reducerPath]:queryAPI.reducer,
    [reusableAPI.reducerPath]:reusableAPI.reducer,
    [userPaymentAPI.reducerPath]:userPaymentAPI.reducer,
    [userReducer.name]: userReducer.reducer,
    [cartReducer.name]: cartReducer.reducer,
  },
  middleware: (mid) => [
    ...mid(),
    userAPI.middleware,
    productAPI.middleware,
    orderApi.middleware,
    dashboardApi.middleware,
    notificationAPI.middleware,
    queryAPI.middleware,
    reusableAPI.middleware,
    userPaymentAPI.middleware,
  ],
});

export type RootState = ReturnType<typeof store.getState>;
