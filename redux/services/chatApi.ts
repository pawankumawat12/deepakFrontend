import { baseApi } from "./baseApi";

export interface OrderMessage {
  id: number;
  order_id: number;
  sender_id: number | null;
  sender_role: "customer" | "admin";
  sender_name: string;
  message: string;
  attachment_url?: string | null;
  attachment_type?: "image" | "document" | null;
  attachment_name?: string | null;
  attachment_size?: string | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessagesResponse {
  success: boolean;
  message?: string;
  data: OrderMessage[];
}

export interface PostMessagePayload {
  orderId: number | string;
  message?: string;
  senderRole?: string;
  file?: File | null;
}

export interface SingleMessageResponse {
  success: boolean;
  message?: string;
  data: OrderMessage;
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrderMessages: build.query<MessagesResponse, number | string>({
      query: (orderId) => `/chat/orders/${orderId}/messages`,
      providesTags: (_res, _err, id) => [{ type: "Chat" as any, id }],
    }),
    postOrderMessage: build.mutation<SingleMessageResponse, PostMessagePayload | FormData>({
      query: (arg) => {
        if (arg instanceof FormData) {
          const orderId = arg.get("orderId");
          return {
            url: `/chat/orders/${orderId}/messages`,
            method: "POST",
            body: arg,
          };
        }
        const { orderId, ...body } = arg;
        return {
          url: `/chat/orders/${orderId}/messages`,
          method: "POST",
          body: { ...body, senderRole: "customer" },
        };
      },
      invalidatesTags: (_res, _err, arg) => {
        const id = arg instanceof FormData ? (arg.get("orderId") as string) : arg?.orderId;
        return [{ type: "Chat" as any, id }];
      },
    }),
    markMessagesRead: build.mutation<{ success: boolean }, number | string>({
      query: (orderId) => ({
        url: `/chat/orders/${orderId}/messages/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_res, _err, id) => [{ type: "Chat" as any, id }],
    }),
  }),
});

export const {
  useGetOrderMessagesQuery,
  usePostOrderMessageMutation,
  useMarkMessagesReadMutation,
} = chatApi;

