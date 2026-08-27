"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  LoaderCircle,
  LogIn,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  Utensils,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useClearCartMutation,
  CartItem,
} from "../redux/services/cartApi";
import { useCreateOrderMutation } from "../redux/services/orderApi";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

function formatRupee(v: number) {
  return Number(v).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function CartClient() {
  const router = useRouter();
  const user = useSelector(
    (state: { auth: { user: any | null } }) => state.auth.user
  );

  const [authOpen, setAuthOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    data: cartResponse,
    isLoading,
    isFetching,
  } = useGetCartQuery(undefined, {
    skip: !user,
  });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();

  const items: CartItem[] = cartResponse?.data?.items || [];
  const summary = cartResponse?.data?.summary || {
    totalItems: 0,
    itemTypesCount: 0,
    subtotal: 0,
    deliveryFee: 0,
    discount: 0,
    grandTotal: 0,
    hasOutOfStockItems: false,
  };

  const handleUpdateQty = async (
    productId: number,
    nextQty: number,
    maxStock: number,
    isMadeToOrder?: boolean
  ) => {
    if (!isMadeToOrder && nextQty > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`);
      return;
    }
    try {
      setUpdatingId(productId);
      await updateCartItem({ productId, quantity: nextQty }).unwrap();
      if (nextQty === 0) {
        toast.success("Item removed from cart");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteItem = async (productId: number) => {
    try {
      setDeletingId(productId);
      await deleteCartItem(productId).unwrap();
      toast.success("Item removed from cart");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove item");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    try {
      await clearCart().unwrap();
      toast.success("Cart cleared successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to clear cart");
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (summary.hasOutOfStockItems) {
      toast.error("Please remove or adjust out-of-stock items before checkout");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    try {
      await createOrder({
        customerName: user.name || "Customer",
        customerEmail: user.email || "",
        customerPhone: user.phone || "",
        shippingAddress: "Jaipur, Rajasthan",
        paymentMethod: "Cash on Delivery",
      }).unwrap();

      toast.success("🎉 Order placed successfully! Fresh food is being prepared.");
      router.push("/orders");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place order. Please try again.");
    }
  };

  /* ============================================================
     1. NOT LOGGED IN (FLIPKART STYLE: "Missing Cart items?")
  ============================================================ */
  if (!user) {
    return (
      <main className="min-h-screen bg-[var(--bg-body)] pt-24 pb-20">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm sm:p-12">
            <div
              className="
                mx-auto
                flex
                h-28
                w-28
                items-center
                justify-center
                rounded-full
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
                shadow-inner
              "
            >
              <ShoppingBag size={48} strokeWidth={1.8} />
            </div>

            <p className="mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Flipkart-Style Cart
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Missing Cart items?
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-[var(--color-text-muted)] sm:text-sm">
              Login to see the items you added previously and manage your delicious orders.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[var(--color-primary)]
                  px-8
                  text-xs
                  font-black
                  text-white
                  shadow-lg
                  shadow-[var(--color-primary)]/25
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[var(--color-primary-dark)]
                  active:scale-95
                "
              >
                <LogIn size={16} />
                Login to view Cart
              </button>

              <Link
                href="/menu"
                className="
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  px-6
                  text-xs
                  font-bold
                  text-[var(--color-text-primary)]
                  transition
                  hover:bg-[var(--color-primary-50)]
                  hover:text-[var(--color-primary)]
                "
              >
                <Utensils size={15} />
                Explore Menu
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-2 border-t border-[var(--color-border)] pt-8">
              <div className="p-2">
                <div className="text-xl">🥬</div>
                <p className="mt-1 text-[10px] font-bold text-[var(--color-text-secondary)]">
                  Fresh Food
                </p>
              </div>
              <div className="p-2">
                <div className="text-xl">⚡</div>
                <p className="mt-1 text-[10px] font-bold text-[var(--color-text-secondary)]">
                  Quick Service
                </p>
              </div>
              <div className="p-2">
                <div className="text-xl">🛡️</div>
                <p className="mt-1 text-[10px] font-bold text-[var(--color-text-secondary)]">
                  Safe & Secure
                </p>
              </div>
            </div>
          </div>
        </div>

        <LoginModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onOpenRegister={() => {
            setAuthOpen(false);
            setRegisterOpen(true);
          }}
        />
        <RegisterModal
          open={registerOpen}
          onClose={() => setRegisterOpen(false)}
        />
      </main>
    );
  }

  /* ============================================================
     2. LOADING SPINNER
  ============================================================ */
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--bg-body)] pt-28 pb-20">
        <div className="mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4">
          <LoaderCircle size={44} className="animate-spin text-[var(--color-primary)]" />
          <p className="mt-4 text-sm font-bold text-[var(--color-text-muted)]">
            Loading your persistent cart...
          </p>
        </div>
      </main>
    );
  }

  /* ============================================================
     3. EMPTY CART (LOGGED IN)
  ============================================================ */
  if (!items.length) {
    return (
      <main className="min-h-screen bg-[var(--bg-body)] pt-24 pb-20">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm sm:p-12">
            <div
              className="
                mx-auto
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
                shadow-inner
              "
            >
              <ShoppingBag size={40} />
            </div>

            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Your Cart
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-text-primary)]">
              Your cart is empty!
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-[var(--color-text-secondary)] sm:text-sm">
              Looks like you haven't added anything yet. Explore our freshly prepared menu and find something delicious.
            </p>

            <Link
              href="/menu"
              className="
                mx-auto
                mt-7
                inline-flex
                h-12
                items-center
                gap-2
                rounded-2xl
                bg-[var(--color-primary)]
                px-8
                text-xs
                font-black
                text-white
                shadow-lg
                shadow-[var(--color-primary)]/25
                transition-all
                hover:-translate-y-0.5
                hover:bg-[var(--color-primary-dark)]
                active:scale-95
              "
            >
              <Utensils size={16} />
              Explore Menu
              <ArrowRight size={15} />
            </Link>

            <div className="mt-10 grid grid-cols-3 gap-2 border-t border-[var(--color-border)] pt-6">
              <div className="rounded-xl bg-[var(--color-primary-50)] p-3 text-center">
                <div className="text-lg">🥬</div>
                <p className="mt-1 text-[9px] font-black text-[var(--color-text-secondary)]">
                  Fresh
                </p>
              </div>
              <div className="rounded-xl bg-[var(--color-primary-50)] p-3 text-center">
                <div className="text-lg">⚡</div>
                <p className="mt-1 text-[9px] font-black text-[var(--color-text-secondary)]">
                  Fast
                </p>
              </div>
              <div className="rounded-xl bg-[var(--color-primary-50)] p-3 text-center">
                <div className="text-lg">❤️</div>
                <p className="mt-1 text-[9px] font-black text-[var(--color-text-secondary)]">
                  Delicious
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     4. ACTIVE CART WITH ITEMS (FLIPKART STYLE)
  ============================================================ */
  return (
    <main className="min-h-screen bg-[var(--bg-body)] pt-20 pb-24">
      {/* HEADER BAR */}
      <section className="bg-[var(--color-primary-dark)]">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-9">
          <Link
            href="/menu"
            className="
              inline-flex
              items-center
              gap-1.5
              text-xs
              font-bold
              text-white/70
              transition
              hover:text-white
            "
          >
            <ArrowLeft size={14} />
            Back to Menu
          </Link>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-[var(--color-primary-light)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                  Flipkart-Style Cart
                </span>
              </div>
              <h1 className="mt-1.5 text-2xl font-black text-white sm:text-3xl md:text-4xl">
                My Cart ({summary.totalItems})
              </h1>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-right backdrop-blur-md sm:block">
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/50">
                Cart Total
              </p>
              <p className="mt-0.5 text-xl font-black text-white">
                ₹{formatRupee(summary.grandTotal)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CART CONTENT GRID */}
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_390px] lg:items-start">
          {/* ITEMS LIST */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-[var(--color-text-primary)] sm:text-lg">
                  Cart Items ({items.length})
                </h2>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Persistent authenticated cart saved in database
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearCart}
                disabled={isClearing}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  px-3.5
                  py-2
                  text-[11px]
                  font-bold
                  text-[var(--color-error)]
                  transition
                  hover:bg-red-50
                  disabled:opacity-50
                "
              >
                <Trash2 size={13} />
                {isClearing ? "Clearing..." : "Clear Cart"}
              </button>
            </div>

            {/* CART ITEMS LIST */}
            <div className="space-y-3.5">
              {items.map((it) => {
                const isItemUpdating = updatingId === it.id;
                const isItemDeleting = deletingId === it.id;

                return (
                  <article
                    key={it.id}
                    className={`
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[var(--color-border)]
                      bg-white
                      p-4
                      shadow-sm
                      transition-all
                      duration-200
                      hover:shadow-md
                      ${it.isOutOfStock ? "opacity-60 grayscale" : ""}
                    `}
                  >
                    <div className="flex gap-4">
                      {/* Product Thumbnail */}
                      <Link
                        href={`/product/${it.id}`}
                        className="
                          group
                          relative
                          h-24
                          w-24
                          shrink-0
                          overflow-hidden
                          rounded-xl
                          bg-stone-100
                          sm:h-28
                          sm:w-28
                        "
                      >
                        <img
                          src={it.img || "/images/placeholder.png"}
                          alt={it.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {it.isOutOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[9px] font-black text-white uppercase">
                            Out of Stock
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/product/${it.id}`}
                                className="line-clamp-1 text-sm font-black text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition sm:text-base"
                              >
                                {it.name}
                              </Link>
                              <p className="mt-0.5 text-[10px] font-medium text-[var(--color-text-muted)] capitalize">
                                {it.category_name}
                              </p>
                            </div>

                            {/* Item Price */}
                            <div className="shrink-0 text-right">
                              <p className="text-base font-black text-[var(--color-text-primary)]">
                                ₹{formatRupee(it.itemTotal)}
                              </p>
                              <p className="text-[10px] text-[var(--color-text-muted)]">
                                ₹{formatRupee(it.price)} each
                              </p>
                            </div>
                          </div>

                          {/* Stock Warnings & Badges */}
                          {it.isMadeToOrder ? (
                            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-700">
                              <Sparkles size={13} className="text-orange-500 shrink-0" />
                              <span>Freshly Made to Order — prepared hot on demand</span>
                            </div>
                          ) : it.isOutOfStock ? (
                            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
                              <AlertTriangle size={13} className="shrink-0" />
                              This item is currently out of stock. Please remove it to place your order.
                            </div>
                          ) : it.exceedsStock ? (
                            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                              <AlertTriangle size={13} className="shrink-0" />
                              Only {it.stock} item(s) available in stock. Please decrease quantity.
                            </div>
                          ) : it.quantity >= it.stock && it.stock > 0 ? (
                            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary)]">
                              <Check size={13} />
                              Maximum stock reached ({it.stock} items).
                            </div>
                          ) : it.stock <= 5 ? (
                            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-amber-600">
                              <Clock3 size={12} />
                              Only {it.stock} left in stock — order soon!
                            </div>
                          ) : null}
                        </div>

                        {/* Controls: Stepper & Remove */}
                        <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                          {/* Quantity Stepper */}
                          <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary-50)] p-1 ring-1 ring-[var(--color-primary)]/10">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              disabled={isItemUpdating || isItemDeleting}
                              onClick={() => handleUpdateQty(it.id, it.quantity - 1, it.stock, it.isMadeToOrder)}
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-[var(--color-primary)]
                                shadow-sm
                                transition
                                hover:bg-red-50
                                hover:text-red-500
                                disabled:opacity-40
                                active:scale-90
                              "
                            >
                              {it.quantity === 1 ? (
                                <Trash2 size={12} />
                              ) : (
                                <Minus size={12} strokeWidth={3} />
                              )}
                            </button>

                            <span className="min-w-[28px] text-center text-xs font-black text-[var(--color-primary)]">
                              {isItemUpdating ? (
                                <LoaderCircle size={12} className="mx-auto animate-spin" />
                              ) : (
                                it.quantity
                              )}
                            </span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              title={!it.isMadeToOrder && it.quantity >= it.stock ? `Only ${it.stock} items available` : "Increase quantity"}
                              disabled={isItemUpdating || isItemDeleting || (!it.isMadeToOrder && it.quantity >= it.stock) || it.isOutOfStock}
                              onClick={() => handleUpdateQty(it.id, it.quantity + 1, it.stock, it.isMadeToOrder)}
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-full
                                bg-[var(--color-primary)]
                                text-white
                                shadow-sm
                                transition
                                hover:bg-[var(--color-primary-dark)]
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                active:scale-90
                              "
                            >
                              <Plus size={12} strokeWidth={3} />
                            </button>
                          </div>

                          {/* Delete Item Action */}
                          <button
                            type="button"
                            disabled={isItemDeleting}
                            onClick={() => handleDeleteItem(it.id)}
                            className="
                              flex
                              items-center
                              gap-1.5
                              rounded-xl
                              px-3
                              py-1.5
                              text-[11px]
                              font-bold
                              text-[var(--color-text-muted)]
                              transition
                              hover:bg-red-50
                              hover:text-red-600
                              disabled:opacity-50
                            "
                          >
                            <Trash2 size={14} />
                            <span>{isItemDeleting ? "Removing..." : "Remove"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* BENEFITS CARD */}
            <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary-50)] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--color-primary)] shadow-sm">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-[var(--color-text-primary)]">
                    Delicious & Freshly Made
                  </p>
                  <p className="mt-0.5 text-[10px] leading-5 text-[var(--color-text-secondary)]">
                    All items are made to order with authentic ingredients and packed with hygiene standards.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FLIPKART-STYLE PRICE DETAILS SIDEBAR */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
              {/* Header */}
              <div className="border-b border-[var(--color-border)] p-5">
                <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Price Details
                </h2>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">
                    Price ({summary.totalItems} item{summary.totalItems === 1 ? "" : "s"})
                  </span>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    ₹{formatRupee(summary.subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">
                    Delivery Charges
                  </span>
                  <span className="font-bold text-[var(--color-success)] flex items-center gap-1">
                    <span>FREE</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">
                    Packaging & Prep
                  </span>
                  <span className="font-bold text-[var(--color-success)]">
                    Included
                  </span>
                </div>

                <div className="border-t border-dashed border-[var(--color-border)] pt-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                        Total Amount
                      </p>
                      <p className="mt-1 text-2xl font-black text-[var(--color-text-primary)]">
                        ₹{formatRupee(summary.grandTotal)}
                      </p>
                    </div>
                    <span className="pb-1 text-[10px] font-bold text-[var(--color-success)]">
                      Safe Payment
                    </span>
                  </div>
                </div>

                {summary.hasOutOfStockItems && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-[11px] font-bold text-red-600">
                    <AlertTriangle size={15} className="shrink-0" />
                    <span>Please remove or adjust out-of-stock items before checkout.</span>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  type="button"
                  disabled={summary.hasOutOfStockItems || isPlacingOrder || items.length === 0}
                  onClick={handleCheckout}
                  className="
                    flex
                    h-13
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[var(--color-primary)]
                    px-5
                    py-3.5
                    text-xs
                    font-black
                    text-white
                    shadow-lg
                    shadow-[var(--color-primary)]/25
                    transition-all
                    hover:bg-[var(--color-primary-dark)]
                    hover:shadow-xl
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <span>
                    {isPlacingOrder
                      ? "Placing Order..."
                      : summary.hasOutOfStockItems
                      ? "Resolve Stock Issues"
                      : "Proceed to Checkout"}
                  </span>
                  {isPlacingOrder ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                </button>
              </div>

              {/* Secure guarantee badge */}
              <div className="border-t border-[var(--color-border)] bg-stone-50 p-4 text-center">
                <p className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[var(--color-text-muted)]">
                  <ShieldCheck size={16} className="text-[var(--color-primary)]" />
                  Safe and Secure Payments • 100% Authentic Food
                </p>
              </div>
            </div>

            {/* Quick delivery cards */}
            <div className="mt-3.5 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <Clock3 size={15} />
                </div>
                <p className="mt-2 text-[10px] font-black text-[var(--color-text-primary)]">
                  Quick Service
                </p>
                <p className="mt-0.5 text-[9px] text-[var(--color-text-muted)]">
                  Freshly cooked on order
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <Truck size={15} />
                </div>
                <p className="mt-2 text-[10px] font-black text-[var(--color-text-primary)]">
                  Carefully Packed
                </p>
                <p className="mt-0.5 text-[9px] text-[var(--color-text-muted)]">
                  Ready to serve hot
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
