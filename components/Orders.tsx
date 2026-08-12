"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Clock3,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  MessageCircle,
} from "lucide-react";
import OrderChat from "./OrderChat";

type OrderStatus = "Delivered" | "Preparing" | "Out for Delivery" | "Cancelled";

type Order = {
  id: string;
  date: string;
  time: string;
  status: OrderStatus;
  items: {
    name: string;
    qty: number;
    price: number;
    img: string;
  }[];
  total: number;
  address: string;
  payment: string;
};

const orders: Order[] = [
  {
    id: "SFC-1025",
    date: "12 Aug 2026",
    time: "07:35 PM",
    status: "Preparing",
    items: [
      {
        name: "Classic Cheese Burger",
        qty: 2,
        price: 149,
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "French Fries",
        qty: 1,
        price: 99,
        img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80",
      },
    ],
    total: 397,
    address: "Jaipur, Rajasthan",
    payment: "UPI",
  },
  {
    id: "SFC-1021",
    date: "09 Aug 2026",
    time: "02:15 PM",
    status: "Delivered",
    items: [
      {
        name: "Veg Pizza",
        qty: 1,
        price: 299,
        img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Cold Coffee",
        qty: 2,
        price: 119,
        img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=300&q=80",
      },
    ],
    total: 537,
    address: "Jaipur, Rajasthan",
    payment: "Cash on Delivery",
  },
  {
    id: "SFC-1014",
    date: "04 Aug 2026",
    time: "08:10 PM",
    status: "Delivered",
    items: [
      {
        name: "Chicken Burger",
        qty: 1,
        price: 189,
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Coke",
        qty: 1,
        price: 60,
        img: "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=300&q=80",
      },
    ],
    total: 249,
    address: "Jaipur, Rajasthan",
    payment: "UPI",
  },
  {
    id: "SFC-1007",
    date: "28 Jul 2026",
    time: "06:20 PM",
    status: "Cancelled",
    items: [
      {
        name: "Paneer Wrap",
        qty: 2,
        price: 129,
        img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=300&q=80",
      },
    ],
    total: 258,
    address: "Jaipur, Rajasthan",
    payment: "UPI",
  },
];

const filters = [
  "All",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function formatRupee(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function StatusIcon({ status }: { status: OrderStatus }) {
  if (status === "Delivered") {
    return <CheckCircle2 size={17} />;
  }

  if (status === "Cancelled") {
    return <XCircle size={17} />;
  }

  if (status === "Out for Delivery") {
    return <Truck size={17} />;
  }

  return <Clock3 size={17} />;
}

function statusClasses(status: OrderStatus) {
  switch (status) {
    case "Delivered":
      return "bg-green-50 text-green-700 border-green-100";

    case "Cancelled":
      return "bg-red-50 text-red-600 border-red-100";

    case "Out for Delivery":
      return "bg-orange-50 text-orange-700 border-orange-100";

    default:
      return "bg-[var(--color-primary-50)] text-[var(--color-primary)] border-[var(--color-primary-light)]";
  }
}

export default function Orders() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [chatOrderId, setChatOrderId] = useState<string | null>(null);
  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") return orders;

    return orders.filter((order) => order.status === activeFilter);
  }, [activeFilter]);

  return (
    <main className="min-h-screen bg-[var(--bg-body)]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="bg-[var(--color-chocolate-dark)]">
        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-8 md:py-12">
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
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-primary-light)]">
                SFC Cafe
              </p>

              <h1 className="mt-2 text-3xl font-black  sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 max-w-lg text-xs leading-5 ">
                Track your current order and quickly reorder your favourite
                food.
              </p>
            </div>

            <Link
              href="/menu"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[var(--color-primary)]
                px-5
                py-3
                text-xs
                font-bold
                text-white
                shadow-lg
                transition
                hover:-translate-y-0.5
                hover:bg-[var(--color-primary-dark)]
              "
            >
              <ShoppingBag size={16} />
              Order Again
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          ORDER STATS
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-5 pt-7 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">
              Total Orders
            </p>

            <p className="mt-2 text-2xl font-black text-[var(--color-text-primary)]">
              24
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">
              Delivered
            </p>

            <p className="mt-2 text-2xl font-black text-[var(--color-primary)]">
              21
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">
              Preparing
            </p>

            <p className="mt-2 text-2xl font-black text-[var(--color-secondary)]">
              1
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">
              Cancelled
            </p>

            <p className="mt-2 text-2xl font-black text-red-500">2</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-5 pt-8 sm:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filters.map((filter) => {
            const active = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`
                  shrink-0
                  rounded-full
                  border
                  px-4
                  py-2
                  text-[11px]
                  font-bold
                  transition
                  ${
                    active
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm"
                      : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }
                `}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          ORDERS
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-5 py-6 pb-16 sm:px-8">
        {filteredOrders.length === 0 ? (
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
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
              "
            >
              <ShoppingBag size={28} />
            </div>

            <h2 className="mt-5 text-lg font-black text-[var(--color-text-primary)]">
              No orders found
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--color-text-muted)]">
              You don't have any orders with this status yet.
            </p>

            <Link
              href="/menu"
              className="
                mt-5
                inline-flex
                rounded-xl
                bg-[var(--color-primary)]
                px-5
                py-3
                text-xs
                font-bold
                text-white
              "
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <article
                key={order.id}
                className="
                  overflow-hidden
                  rounded-[1.75rem]
                  border
                  border-[var(--color-border)]
                  bg-white
                  shadow-sm
                  transition
                  hover:shadow-md
                "
              >
                {/* Order top */}

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    border-b
                    border-[var(--color-border)]
                    p-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-6
                  "
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-black text-[var(--color-text-primary)]">
                        #{order.id}
                      </h2>

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1
                          rounded-full
                          border
                          px-2.5
                          py-1
                          text-[9px]
                          font-bold
                          ${statusClasses(order.status)}
                        `}
                      >
                        <StatusIcon status={order.status} />
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1">
                        <Clock3 size={12} />
                        {order.date} · {order.time}
                      </span>

                      <span className="hidden sm:block">•</span>

                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {order.address}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Order Total
                    </p>

                    <p className="mt-1 text-lg font-black text-[var(--color-text-primary)]">
                      {formatRupee(order.total)}
                    </p>
                  </div>
                </div>

                {/* Products */}

                <div className="p-5 sm:px-6">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.name}
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          className="
                            h-14
                            w-14
                            shrink-0
                            rounded-xl
                            object-cover
                          "
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-[var(--color-text-primary)]">
                            {item.name}
                          </p>

                          <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                            Qty: {item.qty}
                          </p>
                        </div>

                        <p className="text-xs font-bold text-[var(--color-text-primary)]">
                          {formatRupee(item.price * item.qty)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Bottom */}

                  <div
                    className="
                      mt-5
                      flex
                      flex-col
                      gap-4
                      border-t
                      border-[var(--color-border)]
                      pt-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-[var(--color-primary-50)]
                          text-[var(--color-primary)]
                        "
                      >
                        <PackageCheck size={15} />
                      </div>

                      <div>
                        <p className="text-[9px] font-bold text-[var(--color-text-muted)]">
                          Payment
                        </p>

                        <p className="text-[10px] font-bold text-[var(--color-text-primary)]">
                          {order.payment}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {order.status === "Delivered" && (
                        <button
                          type="button"
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-[var(--color-border)]
                            px-4
                            py-2.5
                            text-[10px]
                            font-bold
                            text-[var(--color-primary)]
                            transition
                            hover:bg-[var(--color-primary-50)]
                          "
                        >
                          <RotateCcw size={14} />
                          Reorder
                        </button>
                      )}

                      {order.status === "Preparing" && (
                        <>
                          <button
                            type="button"
                            onClick={() => setChatOrderId(order.id)}
                            className="
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-xl
    border
    border-[var(--color-primary)]
    bg-[var(--color-primary-50)]
    px-4
    py-2.5
    text-[10px]
    font-bold
    text-[var(--color-primary)]
    transition
    hover:bg-[var(--color-primary)]
    hover:text-white
  "
                          >
                            <MessageCircle size={14} />
                            Chat
                          </button>

                          <button
                            type="button"
                            className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[var(--color-primary)]
                            px-4
                            py-2.5
                            text-[10px]
                            font-bold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-[var(--color-primary-dark)]
                          "
                          >
                            Track Order
                            <ChevronRight size={14} />
                          </button>
                        </>
                      )}

                      {order.status === "Cancelled" && (
                        <button
                          type="button"
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-[var(--color-border)]
                            px-4
                            py-2.5
                            text-[10px]
                            font-bold
                            text-[var(--color-primary)]
                            transition
                            hover:bg-[var(--color-primary-50)]
                          "
                        >
                          <RotateCcw size={14} />
                          Order Again
                        </button>
                      )}

                      <button
                        type="button"
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-1
                          rounded-xl
                          border
                          border-[var(--color-border)]
                          px-4
                          py-2.5
                          text-[10px]
                          font-bold
                          text-[var(--color-text-secondary)]
                          transition
                          hover:border-[var(--color-primary)]
                          hover:text-[var(--color-primary)]
                        "
                      >
                        Details
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {chatOrderId && (
        <OrderChat
          open={true}
          orderId={chatOrderId}
          onClose={() => setChatOrderId(null)}
        />
      )}
    </main>
  );
}
