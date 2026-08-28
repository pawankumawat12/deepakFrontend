import { baseApi } from "./baseApi";

export interface NotificationItem {
  id: number;
  user_id: number | null;
  role: "customer" | "admin";
  type: string;
  title: string;
  message: string;
  order_id: number | null;
  data_json: any;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: NotificationItem[];
    unreadCount: number;
  };
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<NotificationsResponse, { limit?: number; offset?: number } | void>({
      query: (params) => ({
        url: "/notifications",
        params: params || {},
      }),
      providesTags: ["Notification" as any],
    }),
    getUnreadNotificationCount: build.query<{ success: boolean; data: { unreadCount: number } }, void>({
      query: () => "/notifications/unread-count",
      providesTags: ["Notification" as any],
    }),
    markNotificationRead: build.mutation<{ success: boolean }, number | string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification" as any],
    }),
    markAllNotificationsRead: build.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification" as any],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;

