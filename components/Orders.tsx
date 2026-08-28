"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
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
  QrCode,
  Banknote,
  Check,
  X,
  ExternalLink,
  Copy,
  Zap,
  ShieldCheck,
} from "lucide-react";
import OrderChat from "./OrderChat";
import {
  useGetOrdersQuery,
  useConfirmPaymentMutation,
} from "../redux/services/orderApi";
import { useGetPaymentQrQuery } from "../redux/services/settingsApi";
import { getSocket } from "../lib/socket";
import toast from "react-hot-toast";

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
  const user = useSelector(
    (state: { auth: { user: any | null } }) => state.auth.user
  );

  const searchParams = useSearchParams();
  const payOrderIdParam = searchParams ? searchParams.get("payOrderId") : null;

  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedChatOrder, setSelectedChatOrder] = useState<any | null>(null);
  const [paymentModalOrder, setPaymentModalOrder] = useState<any | null>(null);
  const [selectedPaymentApp, setSelectedPaymentApp] = useState("Google Pay");

  const { data: qrResponse } = useGetPaymentQrQuery();
  const paymentQr = qrResponse?.data;

  const [confirmPaymentMutation, { isLoading: isSubmittingProof }] =
    useConfirmPaymentMutation();

  const { data: orderResponse, isLoading, refetch } = useGetOrdersQuery(undefined, {
    pollingInterval: 20000,
    refetchOnFocus: true,
  });

  // Socket.IO real-time event listeners for customer
  useEffect(() => {
    if (!user?.id) return;

    const socket = getSocket(user.id);

    const handleOrderAccepted = (data: any) => {
      toast.success(
        `🎉 Your Order #${data.orderNumber || data.orderId} was ACCEPTED! Food is being prepared.`,
        { duration: 6000 }
      );
      refetch();
    };

    const handleOrderRejected = (data: any) => {
      toast.error(
        `⚠️ Your Order #${data.orderNumber || data.orderId} was declined. Reason: ${data.cancelReason || "Not specified"}`,
        { duration: 8000 }
      );
      refetch();
    };

    const handleOrderStatusUpdated = (data: any) => {
      toast(
        `📦 Order #${data.orderNumber || data.orderId} status updated to: ${data.status}`,
        { icon: "🔔" }
      );
      refetch();
    };

    const handlePaymentStatusUpdated = (data: any) => {
      toast.success(
        `💳 Payment status for Order #${data.orderNumber || data.orderId}: ${data.paymentStatus}`,
        { duration: 5000 }
      );
      refetch();
    };

    const handleNewMessage = (data: any) => {
      if (!selectedChatOrder || String(selectedChatOrder.dbId) !== String(data.orderId)) {
        toast(
          `💬 New message from store on #${data.orderNumber}: "${data.message?.message?.substring(0, 40)}..."`,
          { icon: "💬" }
        );
      }
    };

    socket.on("order_accepted", handleOrderAccepted);
    socket.on("order_rejected", handleOrderRejected);
    socket.on("order_status_updated", handleOrderStatusUpdated);
    socket.on("payment_status_updated", handlePaymentStatusUpdated);
    socket.on("customer_new_message", handleNewMessage);

    return () => {
      socket.off("order_accepted", handleOrderAccepted);
      socket.off("order_rejected", handleOrderRejected);
      socket.off("order_status_updated", handleOrderStatusUpdated);
      socket.off("payment_status_updated", handlePaymentStatusUpdated);
      socket.off("customer_new_message", handleNewMessage);
    };
  }, [user?.id, selectedChatOrder, refetch]);

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

      let pricingJson = (o as any).pricing_details_json;
      if (typeof pricingJson === "string") {
        try {
          pricingJson = JSON.parse(pricingJson);
        } catch {
          pricingJson = null;
        }
      }

      let paymentDetailsJson = (o as any).payment_details_json;
      if (typeof paymentDetailsJson === "string") {
        try {
          paymentDetailsJson = JSON.parse(paymentDetailsJson);
        } catch {
          paymentDetailsJson = null;
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
        subtotal: Number(o.subtotal || 0),
        deliveryFee: Number(o.delivery_fee || 0),
        discount: Number(o.discount || 0),
        taxAmount: Number((o as any).tax_amount || 0),
        total: Number(o.total_amount || 0),
        pricingJson,
        address: o.shipping_address || (addressJson ? `${addressJson.house_number}, ${addressJson.formatted_address || `${addressJson.city} - ${addressJson.pincode}`}` : "Jaipur, Rajasthan"),
        addressJson,
        payment: o.payment_method || "Cash on Delivery",
        paymentStatus: (o as any).payment_status || "Pending",
        transactionId: (o as any).transaction_id,
        paymentDetailsJson,
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

  // Auto-open UPI Payment modal when redirected from checkout
  useEffect(() => {
    if (payOrderIdParam && orders.length > 0) {
      const match = orders.find(
        (o) => String(o.dbId) === String(payOrderIdParam) || o.id === payOrderIdParam
      );
      if (match && match.paymentStatus !== "Paid") {
        setPaymentModalOrder(match);
      }
    }
  }, [payOrderIdParam, orders]);

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
                    <div className="flex items-center gap-3">
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
                        {order.payment?.toLowerCase().includes("online") ? (
                          <QrCode size={15} />
                        ) : (
                          <Banknote size={15} />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-bold text-[var(--color-text-primary)]">
                            {order.payment}
                          </p>
                          {order.paymentStatus === "Paid" ? (
                            <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black text-emerald-700">
                              ✓ Paid
                            </span>
                          ) : order.paymentStatus === "Pending Verification" ? (
                            <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[9px] font-black text-purple-700">
                              ⏱ Verification Pending
                            </span>
                          ) : (
                            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-black text-amber-700">
                              Payment Pending
                            </span>
                          )}
                        </div>
                        {order.transactionId && (
                          <p className="text-[9px] text-stone-400 font-mono">
                            Ref: {order.transactionId}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {order.payment?.toLowerCase().includes("online") &&
                        order.paymentStatus !== "Paid" && (
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentModalOrder(order);
                            }}
                            className="
                              inline-flex
                              items-center
                              justify-center
                              gap-1.5
                              rounded-xl
                              border
                              border-emerald-500
                              bg-emerald-500
                              px-4
                              py-2.5
                              text-[10px]
                              font-black
                              text-white
                              shadow-sm
                              transition
                              hover:bg-emerald-600
                              active:scale-95
                            "
                          >
                            <Zap size={13} className="fill-current" />
                            {order.paymentStatus === "Pending Verification"
                              ? "⚡ Pay Again / In Review"
                              : `⚡ Pay Now (${formatRupee(order.total)})`}
                          </button>
                        )}

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

                      <button
                        type="button"
                        onClick={() => setSelectedChatOrder(order)}
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
                        Chat with Store
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* SEAMLESS UPI DEEP LINK PAYMENT MODAL (NO MANUAL UTR REQUIRED) */}
      {paymentModalOrder && (() => {
        const merchantUpi = paymentQr?.upi_id || "sfccafe@upi";
        const merchantName = paymentQr?.merchant_name || "SFC Cafe";
        const totalAmount = Number(paymentModalOrder.total || 0).toFixed(2);
        const orderNote = `Order ${paymentModalOrder.id}`;

        const baseUpiUrl = `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(
          merchantName
        )}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(orderNote)}`;

        const gpayUrl = `tez://upi/pay?pa=${merchantUpi}&pn=${encodeURIComponent(
          merchantName
        )}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(orderNote)}`;

        const phonepeUrl = `phonepe://pay?pa=${merchantUpi}&pn=${encodeURIComponent(
          merchantName
        )}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(orderNote)}`;

        const paytmUrl = `paytmmp://pay?pa=${merchantUpi}&pn=${encodeURIComponent(
          merchantName
        )}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(orderNote)}`;

        const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
          baseUpiUrl
        )}`;

        const handleDirectPay = (url: string, appName: string) => {
          setSelectedPaymentApp(appName);
          window.location.href = url;
        };

        const handleConfirmPayment = async () => {
          try {
            await confirmPaymentMutation({
              orderId: paymentModalOrder.dbId,
              paymentApp: selectedPaymentApp,
              paymentDetails: {
                method: "UPI Deep Link",
                app: selectedPaymentApp,
                status: "Payment Completed by Customer",
              },
            }).unwrap();

            toast.success(
              "🎉 Payment status updated! The store manager has been notified to confirm your order."
            );
            setPaymentModalOrder(null);
            refetch();
          } catch (err: any) {
            toast.error(err?.data?.message || "Failed to submit payment confirmation");
          }
        };

        return (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in"
            onClick={() => setPaymentModalOrder(null)}
          >
            <div
              className="w-full max-w-lg rounded-t-[2rem] sm:rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <Zap size={20} className="fill-current" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-stone-900 leading-tight">
                      Pay with UPI
                    </h3>
                    <p className="text-xs text-stone-500 font-mono">
                      #{paymentModalOrder.id}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentModalOrder(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Exact Amount Banner (Non-editable) */}
              <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white shadow-md flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                    Exact Payable Amount
                  </p>
                  <p className="text-2xl font-black tracking-tight">
                    {formatRupee(paymentModalOrder.total)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs">
                    <ShieldCheck size={12} /> Pre-filled & Verified
                  </span>
                  <p className="text-[10px] text-emerald-100 mt-1 font-mono">
                    {merchantUpi}
                  </p>
                </div>
              </div>

              {/* QR Scanner & Merchant details */}
              <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
                <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-stone-200 shadow-xs shrink-0">
                  <img
                    src={qrCodeApiUrl}
                    alt="Scan UPI QR"
                    className="h-32 w-32 object-contain"
                  />
                  <span className="text-[9px] font-bold text-stone-500 mt-1">
                    Scan with Any UPI App
                  </span>
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Merchant Name
                    </span>
                    <p className="text-xs font-bold text-stone-800">
                      {merchantName}
                    </p>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <div className="rounded-lg bg-white px-2.5 py-1 border border-stone-200 font-mono text-[11px] font-bold text-stone-700">
                      {merchantUpi}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(merchantUpi);
                        toast.success("Merchant UPI ID copied!");
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-stone-200/80 px-2 py-1 text-[10px] font-bold text-stone-700 hover:bg-stone-300"
                    >
                      <Copy size={11} /> Copy
                    </button>
                  </div>

                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    Amount is pre-filled automatically when opening UPI app.
                  </p>
                </div>
              </div>

              {/* Quick 1-Click Launch UPI App Buttons */}
              <div className="mt-4">
                <p className="text-xs font-black text-stone-700 mb-2">
                  Choose your UPI app to pay:
                </p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {[
                    {
                      name: "Google Pay",
                      url: gpayUrl,
                      bg: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
                    },
                    {
                      name: "PhonePe",
                      url: phonepeUrl,
                      bg: "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200",
                    },
                    {
                      name: "Paytm",
                      url: paytmUrl,
                      bg: "bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200",
                    },
                    {
                      name: "Any UPI / BHIM",
                      url: baseUpiUrl,
                      bg: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200",
                    },
                  ].map((app) => (
                    <button
                      key={app.name}
                      type="button"
                      onClick={() => handleDirectPay(app.url, app.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition shadow-xs active:scale-95 text-center ${app.bg}`}
                    >
                      <span className="leading-tight">{app.name}</span>
                      <span className="mt-1 flex items-center gap-0.5 text-[9px] opacity-80">
                        <span>Open</span>
                        <ExternalLink size={9} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Pay Now Deep Link Primary Action */}
              <div className="mt-5 space-y-2.5">
                <a
                  href={baseUpiUrl}
                  onClick={() => setSelectedPaymentApp("Default UPI App")}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-emerald-700 active:scale-98"
                >
                  <Zap size={17} className="fill-current" />
                  <span>Pay Now ({formatRupee(paymentModalOrder.total)})</span>
                </a>

                {/* Confirm Payment Submission Button */}
                <button
                  type="button"
                  disabled={isSubmittingProof}
                  onClick={handleConfirmPayment}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-stone-100 py-3 text-xs font-bold text-stone-800 transition hover:bg-stone-200 active:scale-98 disabled:opacity-50"
                >
                  {isSubmittingProof ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    <Check size={15} />
                  )}
                  <span>✓ I Have Completed Payment</span>
                </button>

                <div className="flex items-center justify-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentModalOrder(null);
                      setSelectedChatOrder(paymentModalOrder);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline"
                  >
                    <MessageCircle size={13} />
                    <span>Have payment questions? Chat with Store</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {selectedChatOrder && (
        <OrderChat
          open={true}
          orderId={selectedChatOrder.dbId}
          dbOrderId={selectedChatOrder.dbId}
          orderNumber={selectedChatOrder.id}
          orderStatus={selectedChatOrder.status}
          onClose={() => setSelectedChatOrder(null)}
        />
      )}
    </main>
  );
}
