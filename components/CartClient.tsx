"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  Utensils,
} from "lucide-react";

import cartStore from "./cart/store";
import { useGetStoreProductsQuery } from "../redux/services/catalogApi";

const EMPTY_PRODUCTS: never[] = [];

export default function CartClient() {
  const [items, setItems] = useState(() => cartStore.getCart());
  const { data: productResponse } = useGetStoreProductsQuery({});
  const products = productResponse?.data || EMPTY_PRODUCTS;

  useEffect(() => {
    setItems(cartStore.getCart());
  }, []);

  useEffect(() => {
    function onUpdate() {
      setItems(cartStore.getCart());
    }

    window.addEventListener("sfc_cart_updated", onUpdate);

    return () =>
      window.removeEventListener("sfc_cart_updated", onUpdate);
  }, []);

  const enriched = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        product: products.find((p) => p.id === it.id),
      })),
    [items, products]
  );

  function changeQty(id: number, qty: number) {
    const next = cartStore.updateQty(id, qty);

    setItems(next);
  }

  function clear() {
    cartStore.clearCart();

    setItems([]);
  }

  const total = enriched.reduce(
    (acc, it) =>
      acc + (it.product?.price || 0) * it.qty,
    0
  );

  const totalItems = items.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  function formatRupee(v: number) {
    return Number(v).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }

  /* ============================================================
     EMPTY CART
  ============================================================ */

  if (!items.length) {
    return (
      <main className="min-h-screen bg-[var(--bg-body)]">

        <div className="mx-auto flex min-h-[75vh] max-w-xl items-center justify-center px-4">

          <div className="w-full text-center">

            {/* Icon */}

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
                shadow-sm
              "
            >
              <ShoppingBag size={38} />
            </div>

            <p
              className="
                mt-6
                text-[10px]
                font-black
                uppercase
                tracking-[0.2em]
                text-[var(--color-secondary)]
              "
            >
              Your cart
            </p>

            <h1
              className="
                mt-2
                text-3xl
                font-black
                tracking-tight
                text-[var(--color-text-primary)]
              "
            >
              Your cart is empty
            </h1>

            <p
              className="
                mx-auto
                mt-3
                max-w-sm
                text-sm
                leading-6
                text-[var(--color-text-secondary)]
              "
            >
              Looks like you haven't added anything yet.
              Explore our menu and find something delicious.
            </p>

            {/* CTA */}

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
                px-6
                text-xs
                font-black
                text-white
                shadow-lg
                shadow-[var(--color-primary)]/20
                transition
                hover:bg-[var(--color-primary-dark)]
                active:scale-95
              "
            >
              <Utensils size={16} />

              Explore Menu

              <ArrowRight size={15} />
            </Link>

            {/* Small benefits */}

            <div className="mt-10 grid grid-cols-3 gap-2">

              <div
                className="
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-3
                "
              >
                <div className="text-lg">🥬</div>

                <p className="mt-1 text-[9px] font-black text-[var(--color-text-secondary)]">
                  Fresh
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-3
                "
              >
                <div className="text-lg">⚡</div>

                <p className="mt-1 text-[9px] font-black text-[var(--color-text-secondary)]">
                  Fast
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-3
                "
              >
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
     CART
  ============================================================ */

  return (
    <main className="min-h-screen bg-[var(--bg-body)] pb-20">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <section className="bg-[var(--color-primary-dark)]">

        <div className="mx-auto max-w-7xl px-4 py-7 md:px-8 md:py-10">

          <Link
            href="/menu"
            className="
              inline-flex
              items-center
              gap-1.5
              text-xs
              font-bold
              text-white/60
              transition
              hover:text-white
            "
          >
            <ArrowLeft size={14} />

            Continue Shopping
          </Link>

          <div className="mt-5 flex items-end justify-between gap-4">

            <div>

              <div className="flex items-center gap-2">

                <ShoppingBag
                  size={16}
                  className="text-[var(--color-primary-light)]"
                />

                <span
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-white/50
                  "
                >
                  Your Order
                </span>

              </div>

              <h1
                className="
                  mt-2
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                  md:text-4xl
                "
              >
                Your Cart
              </h1>

              <p className="mt-2 text-xs text-white/55">
                {totalItems} item
                {totalItems !== 1 ? "s" : ""} ready to order
              </p>

            </div>

            {/* Total in header */}

            <div
              className="
                hidden
                rounded-2xl
                border
                border-white/10
                bg-white/10
                px-5
                py-3
                text-right
                backdrop-blur-md
                sm:block
              "
            >

              <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">
                Cart Total
              </p>

              <p className="mt-1 text-xl font-black text-white">
                ₹{formatRupee(total)}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">

        <div
          className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-[1fr_380px]
            lg:items-start
          "
        >

          {/* ======================================================
              CART ITEMS
          ====================================================== */}

          <section>

            {/* Top bar */}

            <div className="mb-4 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-black text-[var(--color-text-primary)]">
                  Order Items
                </h2>

                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  Review your selected items
                </p>

              </div>

              <button
                type="button"
                onClick={clear}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  px-3
                  py-2
                  text-[10px]
                  font-black
                  text-[var(--color-error)]
                  transition
                  hover:bg-[var(--color-error)]/5
                "
              >
                <Trash2 size={13} />

                Clear Cart
              </button>

            </div>

            {/* Items */}

            <div className="space-y-3">

              {enriched.map((it) => {

                if (!it.product) return null;

                const itemTotal =
                  it.product.price * it.qty;

                return (
                  <article
                    key={it.id}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[var(--color-border)]
                      bg-white
                      shadow-sm
                      transition
                      hover:shadow-md
                    "
                  >

                    <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">

                      {/* Product image */}

                      <Link
                        href={`/product/${it.product.id}`}
                        className="
                          group
                          relative
                          h-24
                          w-24
                          shrink-0
                          overflow-hidden
                          rounded-xl
                          sm:h-28
                          sm:w-28
                        "
                      >
                        <img
                          src={it.product.img}
                          alt={it.product.name}
                          className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-110
                          "
                        />
                      </Link>

                      {/* Product details */}

                      <div className="flex min-w-0 flex-1 flex-col">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <Link
                              href={`/product/${it.product.id}`}
                              className="
                                line-clamp-1
                                text-sm
                                font-black
                                text-[var(--color-text-primary)]
                                transition
                                hover:text-[var(--color-primary)]
                                sm:text-base
                              "
                            >
                              {it.product.name}
                            </Link>

                            <p className="mt-1 text-[10px] capitalize text-[var(--color-text-muted)]">
                              {it.product.categoryName}
                            </p>

                          </div>

                          {/* Item total */}

                          <div className="shrink-0 text-right">

                            <p className="text-sm font-black text-[var(--color-text-primary)]">
                              ₹{formatRupee(itemTotal)}
                            </p>

                            <p className="mt-0.5 text-[9px] text-[var(--color-text-muted)]">
                              ₹{formatRupee(it.product.price)} each
                            </p>

                          </div>

                        </div>

                        <div className="mt-auto flex items-end justify-between gap-3 pt-4">

                          {/* Rating */}

                          <div className="hidden items-center gap-1 sm:flex">

                            <span className="text-[var(--color-star)]">
                              ★
                            </span>

                            <span className="text-[10px] font-bold text-[var(--color-text-secondary)]">
                              4.8
                            </span>

                          </div>

                          {/* Quantity */}

                          <div
                            className="
                              ml-auto
                              flex
                              items-center
                              gap-1
                              rounded-full
                              bg-[var(--color-primary-50)]
                              p-1
                            "
                          >

                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                changeQty(
                                  it.id,
                                  Math.max(0, it.qty - 1)
                                )
                              }
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-[var(--color-primary)]
                                shadow-sm
                                transition
                                active:scale-90
                              "
                            >
                              <Minus
                                size={14}
                                strokeWidth={3}
                              />
                            </button>

                            <span
                              className="
                                min-w-[30px]
                                text-center
                                text-xs
                                font-black
                                text-[var(--color-primary)]
                              "
                            >
                              {it.qty}
                            </span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                changeQty(
                                  it.id,
                                  it.qty + 1
                                )
                              }
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                bg-[var(--color-primary)]
                                text-white
                                shadow-sm
                                transition
                                active:scale-90
                              "
                            >
                              <Plus
                                size={14}
                                strokeWidth={3}
                              />
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

            {/* ==================================================
                FREE DELIVERY / BENEFIT
            ================================================== */}

            <div
              className="
                mt-5
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-[var(--color-primary-50)]
                p-4
              "
            >

              <div className="flex items-start gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    text-[var(--color-primary)]
                    shadow-sm
                  "
                >
                  <Sparkles size={18} />
                </div>

                <div>

                  <p className="text-xs font-black text-[var(--color-text-primary)]">
                    Great choice!
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[var(--color-text-secondary)]">
                    Your food will be prepared fresh and packed
                    carefully before serving.
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ======================================================
              ORDER SUMMARY
          ====================================================== */}

          <aside className="lg:sticky lg:top-24">

            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-[var(--color-border)]
                bg-white
                shadow-sm
              "
            >

              {/* Summary header */}

              <div className="border-b border-[var(--color-border)] p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-base font-black text-[var(--color-text-primary)]">
                      Order Summary
                    </h2>

                    <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                      {totalItems} item
                      {totalItems !== 1 ? "s" : ""}
                    </p>

                  </div>

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
                    <ShoppingBag size={18} />
                  </div>

                </div>

              </div>

              {/* Price breakdown */}

              <div className="space-y-4 p-5">

                <div className="flex items-center justify-between">

                  <span className="text-xs text-[var(--color-text-secondary)]">
                    Subtotal
                  </span>

                  <span className="text-xs font-bold text-[var(--color-text-primary)]">
                    ₹{formatRupee(total)}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-xs text-[var(--color-text-secondary)]">
                    Preparation
                  </span>

                  <span className="text-xs font-bold text-[var(--color-success)]">
                    Included
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-xs text-[var(--color-text-secondary)]">
                    Service charge
                  </span>

                  <span className="text-xs font-bold text-[var(--color-success)]">
                    Included
                  </span>

                </div>

                <div className="border-t border-dashed border-[var(--color-border)] pt-4">

                  <div className="flex items-end justify-between">

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                        Total
                      </p>

                      <p className="mt-1 text-2xl font-black text-[var(--color-text-primary)]">
                        ₹{formatRupee(total)}
                      </p>

                    </div>

                    <span className="pb-1 text-[9px] text-[var(--color-text-muted)]">
                      Incl. applicable charges
                    </span>

                  </div>

                </div>

                {/* Checkout */}

                <button
                  type="button"
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
                    shadow-[var(--color-primary)]/20
                    transition-all
                    hover:bg-[var(--color-primary-dark)]
                    hover:shadow-xl
                    active:scale-[0.98]
                  "
                >
                  Proceed to Checkout

                  <ArrowRight size={16} />
                </button>

              </div>

            </div>

            {/* ==================================================
                ORDER INFO
            ================================================== */}

            <div className="mt-3 grid grid-cols-2 gap-2">

              <div
                className="
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-3
                "
              >

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
                  <Clock3 size={15} />
                </div>

                <p className="mt-2 text-[10px] font-black text-[var(--color-text-primary)]">
                  Quick Service
                </p>

                <p className="mt-1 text-[9px] leading-4 text-[var(--color-text-muted)]">
                  Freshly prepared
                </p>

              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-3
                "
              >

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
                  <Truck size={15} />
                </div>

                <p className="mt-2 text-[10px] font-black text-[var(--color-text-primary)]">
                  Carefully Packed
                </p>

                <p className="mt-1 text-[9px] leading-4 text-[var(--color-text-muted)]">
                  Ready to serve
                </p>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}
