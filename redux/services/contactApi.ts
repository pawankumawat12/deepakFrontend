import { baseApi } from "./baseApi";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitContactQuery: builder.mutation<ContactResponse, ContactPayload>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSubmitContactQueryMutation } = contactApi;

