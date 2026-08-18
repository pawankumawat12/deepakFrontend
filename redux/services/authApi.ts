import { baseApi } from "./baseApi";

export type AuthUser = {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
};

export type AuthResponse = {
  user: AuthUser;
};

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
    getMe: builder.query<AuthResponse, void>({
      query: () => ({ url: "/auth/me" }),
    }),
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    logout: builder.mutation<unknown, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
} = authApi;
