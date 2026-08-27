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
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import OrderChat from "./OrderChat";
import { useGetOrdersQuery } from "../redux/services/orderApi";

type OrderStatus = "Delivered" | "Preparing" | "Out for Delivery" | "Cancelled";

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

function StatusIcon({ status }: { status: string }) {
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

function statusClasses(status: string) {
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

  const { data: orderResponse, isLoading } = useGetOrdersQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
  });

  const rawOrders = orderResponse?.data || [];

  const orders = useMemo(() => {
    return rawOrders.map((o) => {
      const d = new Date(o.created_at);
      let addressJson = o.delivery_address_json;
      if (typeof addressJson === "string") {
        try {
          addressJson = JSON.parse(addressJson);
        } catch {
          addressJson = null;
        }
      }

      return {
        id: o.order_number || `SFC-${o.id}`,
        dbId: o.id,
        customerName: o.customer_name || addressJson?.receiver_name,
        customerPhone: o.customer_phone || addressJson?.phone_number,
        date: d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        time: d.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        status: o.status as OrderStatus,
        total: Number(o.total_amount || 0),
        address: o.shipping_address || (addressJson ? `${addressJson.house_number}, ${addressJson.formatted_address || `${addressJson.city} - ${addressJson.pincode}`}` : "Jaipur, Rajasthan"),
        addressJson,
        payment: o.payment_method || "Cash on Delivery",
        items: (o.items || []).map((it) => ({
          id: it.id,
          name: it.product_name,
          qty: it.quantity,
          price: Number(it.price || 0),
          img: it.image || "/images/placeholder.png",
          availability_type: it.availability_type,
          production_status: it.production_status,
        })),
      };
    });
  }, [rawOrders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") return orders;
    return orders.filter((order) => order.status === activeFilter);
  }, [activeFilter, orders]);

  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const preparing = orders.filter((o) => o.status === "Preparing").length;
    const cancelled = orders.filter((o) => o.status === "Cancelled").length;
    return { total, delivered, preparing, cancelled };
  }, [orders]);

  return (
    <main className="min-h-screen bg-[var(--bg-body)]">

      <section className="bg-[var(--color-primary-dark)]">
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
            style={{ color: "white" }}
          >
            <ArrowLeft size={15} />
            Back to Profile
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-primary-light)]">
                SFC Cafe
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl text-white">
                My Orders
              </h1>

              <p className="mt-2 max-w-lg text-xs leading-5 text-white/70">
                Track your current order and fresh kitchen preparation in real time.
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
              style={{ color: "white" }}
            >
              <ShoppingBag size={16} />
              Order Again
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-7 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">
              Total Orders
            </p>

            <p className="mt-2 text-2xl font-black text-[var(--color-text-primary)]">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">
              Delivered
            </p>

            <p className="mt-2 text-2xl font-black text-[var(--color-primary)]">
              {stats.delivered}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">
              Preparing
            </p>

            <p className="mt-2 text-2xl font-black text-[var(--color-secondary)]">
              {stats.preparing}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">
              Cancelled
            </p>

            <p className="mt-2 text-2xl font-black text-red-500">
              {stats.cancelled}
            </p>
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
                  ${active
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
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-[var(--color-primary)]">
            <LoaderCircle size={32} className="animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
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
                        key={item.id}
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
                          <div className="flex items-center gap-2">
                            <p className="truncate text-xs font-bold text-[var(--color-text-primary)]">
                              {item.name}
                            </p>
                            {item.availability_type === "MADE_TO_ORDER" && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-black text-orange-700 border border-orange-200/60">
                                <Sparkles size={10} />
                                Made to Order
                              </span>
                            )}
                          </div>

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
                      <Link
                        href="/menu"
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
                      </Link>

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
                        </>
                      )}
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
