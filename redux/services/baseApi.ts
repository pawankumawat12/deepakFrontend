// @ts-nocheck

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../features/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  }
});

const baseQueryWithRefresh = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && args.url !== "/auth/refresh-token") {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );
    if (refreshResult.data?.user) {
      api.dispatch(setCredentials(refreshResult.data));
      result = await rawBaseQuery(args, api, extraOptions);
      const newAccessToken = refreshResult.data?.accessToken;

      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Catalog", "Cart", "User", "Wishlist", "Settings", "Order", "Product", "Address", "Chat", "Reviews", "Offers"],
  endpoints: () => ({}),
});
