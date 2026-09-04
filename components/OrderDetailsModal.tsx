"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  X,
  MapPin,
  User,
  Phone,
  Receipt,
  Banknote,
  CreditCard,
  MessageCircle,
  RotateCcw,
  CheckCircle2,
  Clock3,
  Truck,
  XCircle,
  Package,
  ShieldCheck,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react";

interface OrderItem {
  id: number | string;
  name: string;
  qty: number;
  price: number;
  img?: string;
  availability_type?: string;
  production_status?: string;
}

interface OrderDetailsModalProps {
  order: any | null;
  onClose: () => void;
  onOpenChat?: (order: any) => void;
}

const backendUrl = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) ||
  process.env.VITE_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
  ""
).replace(/\/+$/, "");

const toAssetUrl = (path?: string | null) => {
  if (!path || /^https?:\/\//i.test(path) || /^(?:blob:|data:)/i.test(path)) return path || "";
  return `${backendUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

function formatRupee(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Delivered":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          <CheckCircle2 size={14} />
          Delivered
        </span>
      );
    case "Cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
          <XCircle size={14} />
          Cancelled
        </span>
      );
    case "Out for Delivery":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
          <Truck size={14} />
          Out for Delivery
        </span>
      );
    case "Preparing":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          <Clock3 size={14} />
          Preparing
        </span>
      );
    case "Pending":
    case "Order Placed":
    case "Pending Payment":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
          <Clock3 size={14} />
          {status || "Pending"}
        </span>
      );
  }
}

export default function OrderDetailsModal({
  order,
  onClose,
  onOpenChat,
}: OrderDetailsModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!order) return null;

  const p = order.pricingJson || {};
  const subtotal = Number(p.subtotal ?? order.subtotal ?? 0);
  const discount = Number(p.discount ?? order.discount ?? 0);
  const deliveryFee = Number(p.delivery_fee ?? order.deliveryFee ?? 0);
  const packagingFee = Number(p.packaging_fee ?? 0);
  const platformFee = Number(p.platform_fee ?? 0);
  const codFee = Number(p.cod_fee ?? 0);
  const taxAmount = Number(p.tax_amount ?? order.taxAmount ?? 0);
  const grandTotal = Number(p.grand_total ?? order.total ?? 0);
  const isFreeDelivery = Boolean(p.is_free_delivery || (deliveryFee === 0 && subtotal > 0));

  const isCancelled = order.status === "Cancelled";

  const timelineSteps = [
    { key: "Pending", label: "Pending", stepNumber: 1 },
    { key: "Preparing", label: "Preparing", stepNumber: 2 },
    { key: "Out for Delivery", label: "Out for Delivery", stepNumber: 3 },
    { key: "Delivered", label: "Delivered", stepNumber: 4 },
  ];

  const getActiveStepIndex = () => {
    switch (order.status) {
      case "Delivered":
        return 4;
      case "Out for Delivery":
        return 3;
      case "Preparing":
        return 2;
      case "Pending":
      case "Order Placed":
      case "Pending Payment":
      default:
        return 1;
    }
  };

  const currentStep = getActiveStepIndex();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl my-auto rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4 sm:px-6 sm:py-5 bg-gradient-to-r from-[var(--color-primary-50)]/40 to-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white shadow-md">
              <Receipt size={20} />
            </div>
            <div  className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="order-details-title"
                  className="text-base sm:text-lg font-black text-[var(--color-text-primary)]"
                >
                  Order #{order.id}
                </h2>
                <StatusBadge status={order.status} />
              </div>
              <div>
                <span>Payment: </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${order.paymentStatus === "Paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                    }`}
                >
                  <ShieldCheck size={11} />
                  {order.paymentStatus || "Pending"}
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                <Calendar size={12} />
                <span>
                  Placed on {order.date} at {order.time}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Order Progress Tracker */}
          {isCancelled ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-red-800">
                    Order Cancelled
                  </h4>
                  <p className="text-[11px] text-red-700 mt-0.5">
                    {order.cancel_reason ||
                      "This order was declined or cancelled. If you were charged online, a refund will be processed to your original payment source."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--color-border)] bg-stone-50/60 p-4 sm:p-5">
              <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                Order Status Progression
              </p>
              <div className="grid grid-cols-4 gap-2 text-center relative">
                {timelineSteps.map((step, idx) => {
                  const isCompleted = currentStep >= step.stepNumber;
                  const isCurrent = currentStep === step.stepNumber;

                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div
                        className={`
                          flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all
                          ${isCompleted
                            ? "bg-[var(--color-primary)] text-white shadow-sm"
                            : "bg-stone-200 text-stone-500"
                          }
                          ${isCurrent ? "ring-4 ring-[var(--color-primary-50)]" : ""}
                        `}
                      >
                        {isCompleted ? <CheckCircle2 size={16} /> : step.stepNumber}
                      </div>
                      <p
                        className={`mt-1.5 text-[10px] font-bold ${isCompleted
                            ? "text-[var(--color-text-primary)]"
                            : "text-stone-400"
                          }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Status explanation notice */}
              {(order.status === "Pending" ||
                order.status === "Order Placed" ||
                order.status === "Pending Payment") && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <div>
                    <p className="text-xs font-bold text-amber-950">Waiting for order confirmation</p>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Your order has been placed and received by our store. Waiting for store confirmation to begin preparation.
                    </p>
                  </div>
                </div>
              )}

              {order.status === "Preparing" && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-left">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                  </span>
                  <div>
                    <p className="text-xs font-bold text-blue-950">Your order has been accepted and is being prepared.</p>
                    <p className="text-[11px] text-blue-800 mt-0.5">
                      The store accepted your order and our kitchen is preparing fresh food for you.
                    </p>
                  </div>
                </div>
              )}

              {order.status === "Out for Delivery" && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-orange-200 bg-orange-50 p-3 text-left">
                  <Truck size={16} className="text-orange-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-orange-950">Out for Delivery</p>
                    <p className="text-[11px] text-orange-800 mt-0.5">
                      Your order is on the way with our delivery partner.
                    </p>
                  </div>
                </div>
              )}

              {order.status === "Delivered" && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-950">Order Delivered</p>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Your order has been delivered successfully. Enjoy your meal!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Items Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
                <Package size={14} />
                <span>Items in this Order ({order.items?.length || 0})</span>
              </h3>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] divide-y divide-[var(--color-border)] overflow-hidden">
              {(order.items || []).map((item: OrderItem) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 p-3.5 bg-white transition hover:bg-stone-50/50"
                >
                  <img
                    src={toAssetUrl(item.img)}
                    alt={item.name}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover bg-stone-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-[var(--color-text-primary)] truncate">
                        {item.name}
                      </p>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                      {formatRupee(item.price)} × {item.qty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-[var(--color-text-primary)]">
                      {formatRupee(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Special Instructions / Order Note */}
          {order.notes && order.notes.trim() && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-1.5">
                <FileText size={13} />
                <span>Special Instructions / Order Note</span>
              </p>
              <p className="text-xs text-amber-950 font-medium leading-relaxed whitespace-pre-line">
                "{order.notes.trim()}"
              </p>
            </div>
          )}

          {/* Two-Column Grid: Delivery Address & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Delivery Address */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-stone-50/50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1 mb-2">
                <MapPin size={12} /> Delivery Address
              </p>
              {order.customerName && (
                <p className="text-xs font-black text-[var(--color-text-primary)] flex items-center gap-1.5">
                  <User size={13} className="text-[var(--color-primary)]" />
                  <span>{order.customerName}</span>
                </p>
              )}
              {order.customerPhone && (
                <p className="text-[11px] text-[var(--color-text-secondary)] flex items-center gap-1.5 mt-1">
                  <Phone size={12} className="text-stone-400" />
                  <span>{order.customerPhone}</span>
                </p>
              )}
              <p className="text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed">
                {order.address}
              </p>
            </div>

          </div>

          {/* Bill Breakdown */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-stone-50/30 p-4 sm:p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Bill Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[var(--color-text-secondary)]">
                <span>Item Subtotal</span>
                <span>{formatRupee(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount Savings</span>
                  <span>- {formatRupee(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[var(--color-text-secondary)]">
                <span>Delivery Partner Fee</span>
                <span>
                  {isFreeDelivery ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatRupee(deliveryFee)
                  )}
                </span>
              </div>

              {packagingFee > 0 && (
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Packaging & Handling</span>
                  <span>{formatRupee(packagingFee)}</span>
                </div>
              )}

              {platformFee > 0 && (
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Platform Fee</span>
                  <span>{formatRupee(platformFee)}</span>
                </div>
              )}

              {codFee > 0 && (
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Cash on Delivery Handling</span>
                  <span>{formatRupee(codFee)}</span>
                </div>
              )}

              {taxAmount > 0 && (
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Taxes & GST</span>
                  <span>{formatRupee(taxAmount)}</span>
                </div>
              )}

              <div className="border-t border-[var(--color-border)] pt-2 mt-2 flex justify-between items-center text-sm font-black text-[var(--color-text-primary)]">
                <span>Grand Total</span>
                <span className="text-base text-[var(--color-primary)]">
                  {formatRupee(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="border-t border-[var(--color-border)] px-5 py-3.5 sm:px-6 sm:py-4 bg-stone-50/70 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {onOpenChat && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenChat(order);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary-50)] px-3.5 py-2 text-xs font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition"
              >
                <MessageCircle size={14} />
                <span>Chat with Store</span>
              </button>
            )}

            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-white px-3.5 py-2 text-xs font-bold text-[var(--color-text-primary)] hover:bg-stone-100 transition"
            >
              <RotateCcw size={14} />
              <span>Order Again</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-stone-200 hover:bg-stone-300 px-5 py-2 text-xs font-bold text-stone-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

