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

export interface ContactQueryItem {
  id: number;
  user_id: number | null;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: "pending" | "in_progress" | "resolved";
  admin_notes?: string | null;
  admin_reply?: string | null;
  replied_at?: string | null;
  admin_responder_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MyContactQueriesResponse {
  success: boolean;
  data: ContactQueryItem[];
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitContactQuery: builder.mutation<ContactResponse, ContactPayload>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contact"],
    }),
    getMyContactQueries: builder.query<MyContactQueriesResponse, void>({
      query: () => "/contact/my",
      providesTags: ["Contact"],
    }),
  }),
});

export const {
  useSubmitContactQueryMutation,
  useGetMyContactQueriesQuery,
} = contactApi;

