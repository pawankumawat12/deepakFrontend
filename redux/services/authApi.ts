import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    sendOtp: builder.mutation({
      query: (body) => ({ url: "/auth/send-otp", method: "POST", body }),
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({ url: "/auth/verify-otp", method: "POST", body }),
    }),
    refreshToken: builder.mutation({
      query: () => ({ url: "/auth/refresh-token", method: "POST" }),
    }),
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRefreshTokenMutation,
  useLoginMutation,
} = authApi;
