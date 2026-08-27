"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
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
  Trash2,
  X,
} from "lucide-react";

type Notification = {
  id: number;
  type: "order" | "offer" | "promo" | "favorite" | "info";
  title: string;
  message: string;
  time: string;
  unread: boolean;
  orderId?: string;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "order",
    title: "Order Confirmed 🎉",
    message:
      "Your order #SFC1024 has been confirmed and is being prepared.",
    time: "10 min ago",
    unread: true,
    orderId: "SFC1024",
  },
  {
    id: 2,
    type: "offer",
    title: "Weekend Special 🔥",
    message:
      "Get 20% OFF on burgers and pizzas this weekend. Order now!",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    type: "promo",
    title: "Free Delivery Today 🚚",
    message:
      "Enjoy free delivery on orders above ₹299. Don't miss it!",
    time: "3 hours ago",
    unread: true,
  },
  {
    id: 4,
    type: "favorite",
    title: "Something You Love Is Back ❤️",
    message:
      "Your favourite Farmhouse Pizza is available again.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 5,
    type: "order",
    title: "Order Delivered ✅",
    message:
      "Your order #SFC1018 was delivered successfully. Enjoy your meal!",
    time: "Yesterday",
    unread: false,
    orderId: "SFC1018",
  },
  {
    id: 6,
    type: "info",
    title: "Welcome to SFC Cafe 👋",
    message:
      "Thanks for being part of SFC Cafe. Explore our menu and discover your new favourite.",
    time: "2 days ago",
    unread: false,
  },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Orders", value: "order" },
  { label: "Offers", value: "offer" },
  { label: "Updates", value: "info" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const [activeFilter, setActiveFilter] = useState("all");

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return notifications;
    }

    if (activeFilter === "offer") {
      return notifications.filter(
        (notification) =>
          notification.type === "offer" ||
          notification.type === "promo"
      );
    }

    return notifications.filter(
      (notification) => notification.type === activeFilter
    );
  }, [notifications, activeFilter]);

  function getIcon(type: Notification["type"]) {
    switch (type) {
      case "order":
        return ShoppingBag;

      case "offer":
        return Gift;

      case "promo":
        return Tag;

      case "favorite":
        return Heart;

      default:
        return Info;
    }
  }

  function markAsRead(id: number) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  }

  function deleteNotification(id: number) {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  }

  function clearAll() {
    setNotifications([]);
  }

  return (
    <main className="min-h-screen bg-[var(--bg-body)]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="">

        <div className="mx-auto max-w-5xl px-5 py-9 sm:px-8 md:py-12">

          <Link
            href="/profile"
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              text-xs
              font-semibold
              text-white/60
              transition
              hover:text-white
            "
          >
            <ArrowLeft size={15} />
            Back to Profile
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div
                  className="
                    relative
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary)]
                    text-white
                  "
                >
                  <Bell size={18} />

                  {unreadCount > 0 && (
                    <span
                      className="
                        absolute
                        -right-1
                        -top-1
                        flex
                        h-4
                        min-w-4
                        items-center
                        justify-center
                        rounded-full
                        bg-[var(--color-secondary)]
                        px-1
                        text-[8px]
                        font-black
                        text-white
                      "
                    >
                      {unreadCount}
                    </span>
                  )}

                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-primary-light)]">
                  Stay Updated
                </p>

              </div>

              <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                Notifications
              </h1>

              <p className="mt-2 max-w-lg text-xs leading-5">
                Get updates about your orders, offers and everything
                happening at SFC Cafe.
              </p>

            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/10
                  px-4
                  py-3
                  text-xs
                  font-bold
                  backdrop-blur
                  transition
                  hover:bg-white/15
                "
              >
                <CheckCheck size={15} />
                Mark all as read
              </button>
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="mx-auto max-w-5xl px-5 pt-7 sm:px-8">

        <div
          className="
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-[var(--color-border)]
            bg-white
            p-4
            shadow-sm
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
              "
            >
              <Bell size={18} />
            </div>

            <div>

              <p className="text-xs font-black text-[var(--color-text-primary)]">
                {notifications.length} Notifications
              </p>

              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1 ? "s" : ""
                    }`
                  : "You're all caught up"}
              </p>

            </div>

          </div>

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="
                hidden
                items-center
                gap-1.5
                rounded-lg
                px-3
                py-2
                text-[10px]
                font-bold
                text-[var(--color-text-muted)]
                transition
                hover:bg-red-50
                hover:text-red-500
                sm:flex
              "
            >
              <Trash2 size={14} />
              Clear all
            </button>
          )}

        </div>

      </section>

      {/* =====================================================
          FILTERS
      ===================================================== */}

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
                  shrink-0
                  rounded-full
                  border
                  px-4
                  py-2
                  text-[10px]
                  font-bold
                  transition
                  ${
                    active
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
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

      {/* =====================================================
          NOTIFICATION LIST
      ===================================================== */}

      <section className="mx-auto max-w-5xl px-5 py-6 pb-20 sm:px-8">

        {filteredNotifications.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div
            className="
              rounded-[2rem]
              border
              border-[var(--color-border)]
              bg-white
              px-6
              py-16
              text-center
              shadow-sm
            "
          >

            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-[1.5rem]
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
              "
            >
              <Bell size={34} strokeWidth={1.7} />
            </div>

            <h2 className="mt-6 text-xl font-black text-[var(--color-text-primary)]">
              You're all caught up!
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--color-text-muted)]">
              There are no notifications to show right now.
              We'll let you know when something exciting happens.
            </p>

            <Link
              href="/menu"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[var(--color-primary)]
                px-5
                py-3
                text-xs
                font-bold
                text-white
                shadow-md
                transition
                hover:bg-[var(--color-primary-dark)]
              "
            >
              <ShoppingBag size={15} />
              Explore Menu
            </Link>

          </div>

        ) : (

          <div className="space-y-3">

            {filteredNotifications.map((notification) => {

              const Icon = getIcon(notification.type);

              return (
                <article
                  key={notification.id}
                  className={`
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    bg-white
                    p-4
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:shadow-md
                    ${
                      notification.unread
                        ? "border-[var(--color-primary-light)]"
                        : "border-[var(--color-border)]"
                    }
                  `}
                >

                  {/* Unread indicator */}

                  {notification.unread && (
                    <span
                      className="
                        absolute
                        left-0
                        top-0
                        h-full
                        w-1
                        bg-[var(--color-primary)]
                      "
                    />
                  )}

                  <div className="flex gap-3">

                    {/* ICON */}

                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${
                          notification.type === "offer" ||
                          notification.type === "promo"
                            ? "bg-orange-50 text-[var(--color-secondary)]"
                            : notification.type === "favorite"
                            ? "bg-red-50 text-red-500"
                            : "bg-[var(--color-primary-50)] text-[var(--color-primary)]"
                        }
                      `}
                    >
                      <Icon
                        size={19}
                        fill={
                          notification.type === "favorite"
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <div className="flex items-center gap-2">

                            <h2
                              className={`
                                text-xs
                                ${
                                  notification.unread
                                    ? "font-black"
                                    : "font-bold"
                                }
                                text-[var(--color-text-primary)]
                              `}
                            >
                              {notification.title}
                            </h2>

                            {notification.unread && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                            )}

                          </div>

                          <p className="mt-1.5 text-[11px] leading-5 text-[var(--color-text-secondary)]">
                            {notification.message}
                          </p>

                        </div>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            deleteNotification(notification.id)
                          }
                          aria-label="Delete notification"
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-[var(--color-text-muted)]
                            opacity-0
                            transition
                            hover:bg-red-50
                            hover:text-red-500
                            group-hover:opacity-100
                          "
                        >
                          <X size={15} />
                        </button>

                      </div>

                      {/* BOTTOM */}

                      <div className="mt-3 flex flex-wrap items-center gap-3">

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1
                            text-[9px]
                            font-semibold
                            text-[var(--color-text-muted)]
                          "
                        >
                          <Clock3 size={11} />
                          {notification.time}
                        </span>

                        {notification.orderId && (
                          <Link
                            href="/orders"
                            className="
                              text-[9px]
                              font-bold
                              text-[var(--color-primary)]
                              hover:underline
                            "
                          >
                            View Order →
                          </Link>
                        )}

                        {notification.unread && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsRead(notification.id)
                            }
                            className="
                              ml-auto
                              inline-flex
                              items-center
                              gap-1
                              rounded-lg
                              px-2.5
                              py-1.5
                              text-[9px]
                              font-bold
                              text-[var(--color-primary)]
                              transition
                              hover:bg-[var(--color-primary-50)]
                            "
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

      {/* =====================================================
          MOBILE CLEAR BUTTON
      ===================================================== */}

      {notifications.length > 0 && (
        <div className="mx-auto max-w-5xl px-5 pb-24 sm:hidden">

          <button
            type="button"
            onClick={clearAll}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-red-100
              bg-white
              py-3
              text-[10px]
              font-bold
              text-red-500
              transition
              hover:bg-red-50
            "
          >
            <Trash2 size={14} />
            Clear All Notifications
          </button>

        </div>
      )}

    </main>
  );
}