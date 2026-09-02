"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  Clock3,
  Gift,
  Heart,
  Info,
  ShoppingBag,
  Tag,
  ShieldCheck,
  MessageSquare,
  Star,
  RefreshCw,
} from "lucide-react";
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  NotificationItem,
} from "@/redux/services/notificationApi";
import { getSocket } from "@/lib/socket";

const filters = [
  { label: "All", value: "all" },
  { label: "Orders", value: "order" },
  { label: "Offers & Promos", value: "offer" },
  { label: "Account & Support", value: "support" },
];

export default function NotificationsPage() {
  const user = useSelector((state: any) => state.auth?.user);
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");

  const {
    data: notifData,
    isLoading,
    isFetching,
    refetch,
  } = useGetNotificationsQuery(undefined, {
    skip: !user,
  });

  const { data: unreadData, refetch: refetchUnread } = useGetUnreadNotificationCountQuery(
    undefined,
    { skip: !user }
  );

  const [markAsRead] = useMarkNotificationReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();

  const notifications: NotificationItem[] = notifData?.data?.notifications || [];
  const unreadCount = unreadData?.data?.unreadCount ?? (notifData?.data?.unreadCount || 0);

  // Live Socket.IO listener
  useEffect(() => {
    if (!user?.id) return;

    const socket = getSocket(user.id);

    const handleNewNotification = () => {
      refetch();
      refetchUnread();
    };

    socket.on("notification:new", handleNewNotification);
    socket.on("notification:unread_count", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:unread_count", handleNewNotification);
    };
  }, [user?.id, refetch, refetchUnread]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;

    if (activeFilter === "order") {
      return notifications.filter(
        (n) => n.type.toLowerCase().includes("order") || n.order_id != null
      );
    }

    if (activeFilter === "offer") {
      return notifications.filter(
        (n) =>
          n.type.toLowerCase().includes("offer") ||
          n.type.toLowerCase().includes("promo") ||
          n.type.toLowerCase().includes("bogo")
      );
    }

    if (activeFilter === "support") {
      return notifications.filter(
        (n) =>
          n.type.toLowerCase().includes("support") ||
          n.type.toLowerCase().includes("unblock") ||
          n.type.toLowerCase().includes("auth")
      );
    }

    return notifications;
  }, [notifications, activeFilter]);

  function getIcon(type: string) {
    const t = type.toLowerCase();
    if (t.includes("order")) return ShoppingBag;
    if (t.includes("offer") || t.includes("bogo")) return Gift;
    if (t.includes("promo")) return Tag;
    if (t.includes("favorite")) return Heart;
    if (t.includes("review")) return Star;
    if (t.includes("support") || t.includes("unblock")) return ShieldCheck;
    if (t.includes("chat") || t.includes("message") || t.includes("inquiry"))
      return MessageSquare;
    return Info;
  }

  const handleNotificationClick = async (notification: NotificationItem) => {
    // Mark as read
    if (!notification.is_read) {
      try {
        await markAsRead(notification.id).unwrap();
      } catch {
        toast.error("Failed to mark as read");
      }
    }

    // For chat notifications: navigate to /orders and signal which order's chat to open
    if (notification.type === "chat_message" && notification.order_id) {
      // Store the target orderId for Orders page to pick up
      if (typeof window !== "undefined") {
        window.__sfcPendingChatOrderId = notification.order_id;
      }
      router.push("/orders");
    }
  };

  const handleMarkSingleRead = async (id: number) => {
    try {
      await markAsRead(id).unwrap();
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[var(--bg-body)]">
        <section className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
            <Bell size={34} />
          </div>
          <h1 className="mt-6 text-2xl font-black text-[var(--color-text-primary)]">
            Sign In to View Notifications
          </h1>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Please log in to check your order updates, special offers, and messages.
          </p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("sfc_open_login"))}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[var(--color-primary-dark)]"
          >
            Sign In to Account
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-body)]">
      {/* HEADER */}
      <section className="border-b border-[var(--color-border)] bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
          <Link
            href="/profile"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={14} />
            Back to Profile
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-sm">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-black text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                  Live Updates
                </p>
              </div>

              <h1 className="mt-2 text-2xl font-black text-[var(--color-text-primary)] sm:text-3xl">
                Notifications
              </h1>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Real-time updates about your orders, exclusive cafe offers, and support.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-xs font-bold text-[var(--color-text-secondary)] shadow-sm transition hover:bg-slate-50"
              >
                <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={isMarkingAll}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--color-primary-dark)]"
                >
                  <CheckCheck size={14} />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="mx-auto max-w-5xl px-5 pt-6 sm:px-8">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((filter) => {
            const active = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`
                  shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold transition
                  ${
                    active
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm"
                      : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }
                `}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* NOTIFICATIONS LIST */}
      <section className="mx-auto max-w-5xl px-5 py-6 pb-24 sm:px-8">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl border border-[var(--color-border)] bg-white p-4"
              />
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="rounded-3xl border border-[var(--color-border)] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
              <Bell size={28} />
            </div>
            <h2 className="mt-5 text-lg font-black text-[var(--color-text-primary)]">
              You're all caught up!
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--color-text-muted)]">
              No notifications to display. As your orders are placed, prepared, and dispatched, updates will appear here in real time.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[var(--color-primary-dark)]"
            >
              <ShoppingBag size={14} />
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const isUnread = !notification.is_read;

              const isChatNotif = notification.type === "chat_message" && notification.order_id;

              return (
                <article
                  key={notification.id}
                  onClick={isChatNotif ? () => handleNotificationClick(notification) : undefined}
                  className={`
                    group relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                    ${
                      isUnread
                        ? "border-[var(--color-primary-light)] bg-gradient-to-r from-emerald-50/30 to-white"
                        : "border-[var(--color-border)]"
                    }
                    ${isChatNotif ? "cursor-pointer" : ""}
                  `}
                >
                  {isUnread && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-[var(--color-primary)]" />
                  )}

                  <div className="flex gap-3.5">
                    {/* ICON */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                      <Icon size={19} />
                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2
                              className={`text-xs ${
                                isUnread ? "font-black" : "font-bold"
                              } text-[var(--color-text-primary)]`}
                            >
                              {notification.title}
                            </h2>
                            {isUnread && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                            )}
                          </div>

                          <p className="mt-1 text-[11px] leading-5 text-[var(--color-text-secondary)]">
                            {notification.message}
                          </p>
                        </div>
                      </div>

                      {/* ACTIONS & TIMESTAMP */}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--color-text-muted)]">
                          <Clock3 size={11} />
                          {formatTime(notification.created_at)}
                        </span>

                        {notification.order_id && (
                          isChatNotif ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(notification);
                              }}
                              className="text-[10px] font-bold text-[var(--color-primary)] hover:underline"
                            >
                              Open Chat →
                            </button>
                          ) : (
                            <Link
                              href="/orders"
                              className="text-[10px] font-bold text-[var(--color-primary)] hover:underline"
                            >
                              View Order #{notification.order_id} →
                            </Link>
                          )
                        )}

                        {isUnread && !isChatNotif && (
                          <button
                            type="button"
                            onClick={() => handleMarkSingleRead(notification.id)}
                            className="ml-auto inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-50)]"
                          >
                            <Check size={12} />
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}