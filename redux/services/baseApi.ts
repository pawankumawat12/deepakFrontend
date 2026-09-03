// @ts-nocheck

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../features/authSlice";

class SimpleMutex {
  private _queue: Promise<void> = Promise.resolve();
  private _locked = false;

  isLocked(): boolean {
    return this._locked;
  }

  async acquire(): Promise<() => void> {
    this._locked = true;
    let release: () => void;
    const ticket = new Promise<void>((resolve) => {
      release = resolve;
    });
    const wait = this._queue;
    this._queue = this._queue.then(() => ticket);
    await wait;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this._locked = false;
      release();
    };
  }

  async waitForUnlock(): Promise<void> {
    while (this._locked) {
      await this._queue;
    }
  }
}

const mutex = new SimpleMutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const stateToken = (getState() as any)?.auth?.accessToken;
    const localToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const accessToken = stateToken || localToken;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithRefresh = async (args: any, api: any, extraOptions: any) => {
  // Wait if another request is currently refreshing the token
  await mutex.waitForUnlock();
  let result = await rawBaseQuery(args, api, extraOptions);

  const url = typeof args === "string" ? args : args?.url;
  const isAuthEndpoint =
    url === "/auth/refresh-token" ||
    url === "/auth/login" ||
    url === "/auth/verify-otp";

  if (result.error?.status === 401 && !isAuthEndpoint) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await rawBaseQuery(
          { url: "/auth/refresh-token", method: "POST" },
          api,
          extraOptions
        );

        if (refreshResult.data?.accessToken || refreshResult.data?.token) {
          const newAccessToken =
            refreshResult.data.accessToken || refreshResult.data.token;
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", newAccessToken);
          }
          api.dispatch(setCredentials(refreshResult.data));

          // Retry the original query with the new access token
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
          }
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      // Wait until the active refresh completes and then retry
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
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
