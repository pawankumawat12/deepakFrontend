"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "../redux/services/wishlistApi";
import {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
} from "../redux/services/cartApi";

export default function ProductDetailsClient({
  product,
}: {
  product: any;
}) {
  const user = useSelector(
    (state: { auth: { user: any | null } }) => state.auth.user
  );
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !user,
  });
  const [toggleWishlist] = useToggleWishlistMutation();

  const { data: cartResponse } = useGetCartQuery(undefined, {
    skip: !user,
  });
  const [addCartItem] = useAddCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const inCartItem = (cartResponse?.data?.items || []).find(
    (c) => Number(c.id) === Number(product.id)
  );
  const inCartQty = inCartItem?.quantity || null;

  const isWishlisted = Boolean(
    (wishlistData?.data || []).some(
      (w) => Number(w.id || w.product_id) === Number(product.id)
    )
  );

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    try {
      const res = await toggleWishlist({ productId: Number(product.id) }).unwrap();
      if (res.inWishlist) {
        toast.success("Added to favorites ❤️");
      } else {
        toast.success("Removed from favorites");
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  const imgRef = useRef<HTMLImageElement | null>(null);

  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState<number>(1);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    requestAnimationFrame(() => el.classList.add("revealed"));
  }, []);

  const isMadeToOrder = Boolean(
    product?.isMadeToOrder ||
    String(product?.availability_type || "").toUpperCase() === "MADE_TO_ORDER"
  );
  const isOutOfStock = !isMadeToOrder && Number(product?.stock) <= 0;

  function formatRupee(v: number) {
    return Number(v).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }

  async function handleAdd() {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }
    try {
      await addCartItem({ productId: Number(product.id), quantity: qty }).unwrap();
      setAdded(true);
      toast.success("Added to cart 🛒");
      setTimeout(() => setAdded(false), 900);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add to cart");
    }
  }

  async function changeQty(newQty: number) {
    if (!user) {
      toast.error("Please sign in to modify cart");
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    if (!isMadeToOrder && newQty > Number(product.stock)) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }
    try {
      await updateCartItem({ productId: Number(product.id), quantity: newQty }).unwrap();
      if (newQty === 0) {
        toast.success("Removed from cart");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update quantity");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg-body)] pb-20">

      {/* =========================================================
          TOP / BREADCRUMB
      ========================================================= */}

      <div className="border-b border-[var(--color-border)] bg-white">

        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-xs md:px-8">

          <Link
            href="/menu"
            className="
              flex
              items-center
              gap-1.5
              font-semibold
              text-[var(--color-text-muted)]
              transition-colors
              hover:text-[var(--color-primary)]
            "
          >
            <ArrowLeft size={14} />

            Menu
          </Link>

          <ChevronRight
            size={13}
            className="text-[var(--color-text-muted)]"
          />

          <span className="truncate font-bold capitalize text-[var(--color-text-secondary)]">
            {product.categoryName || product.category}
          </span>

          <ChevronRight
            size={13}
            className="text-[var(--color-text-muted)]"
          />

          <span className="hidden truncate font-semibold text-[var(--color-text-primary)] sm:block">
            {product.name}
          </span>

        </div>

      </div>

      {/* =========================================================
          MAIN PRODUCT SECTION
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">

        <div
          className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-[1.05fr_0.95fr]
            lg:gap-10
          "
        >

          {/* =======================================================
              LEFT - IMAGE
          ======================================================= */}

          <div>

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-[var(--color-border)]
                bg-white
                shadow-sm
              "
            >

              <img
                ref={imgRef}
                src={product.img}
                alt={product.name}
                className="
                  detail-img
                  h-[320px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                  sm:h-[430px]
                  lg:h-[520px]
                "
              />

              {/* Image overlay */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  bottom-0
                  h-32
                  bg-gradient-to-t
                  from-black/40
                  to-transparent
                "
              />

              {/* Popular badge */}

              <div
                className="
                  absolute
                  left-4
                  top-4
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-[var(--color-secondary)]
                  px-3
                  py-1.5
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wide
                  text-white
                  shadow-lg
                "
              >
                <Flame size={13} />

                Popular Choice
              </div>

              {/* Wishlist Toggle Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label="Add to favorites"
                className="
                  absolute
                  right-4
                  top-4
                  z-20
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white/95
                  shadow-lg
                  backdrop-blur-md
                  transition
                  hover:scale-105
                  active:scale-95
                "
              >
                <Heart
                  size={20}
                  className={
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-stone-600 hover:text-red-500"
                  }
                />
              </button>

              {/* Category */}
              <div
                className="
                  absolute
                  left-4
                  bottom-4
                  rounded-full
                  bg-black/50
                  px-3
                  py-1
                  text-[10px]
                  font-bold
                  capitalize
                  text-white
                  shadow
                  backdrop-blur-md
                "
              >
                {product.categoryName || product.category}
              </div>

            </div>

            {/* Image info cards */}

            <div className="mt-3 grid grid-cols-3 gap-2">

              <div
                className="
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-3
                  text-center
                  shadow-sm
                "
              >
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
                  🥬
                </div>

                <p className="mt-2 text-[9px] font-black text-[var(--color-text-secondary)] sm:text-[10px]">
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
                  text-center
                  shadow-sm
                "
              >
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
                  ⚡
                </div>

                <p className="mt-2 text-[9px] font-black text-[var(--color-text-secondary)] sm:text-[10px]">
                  Quick
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-3
                  text-center
                  shadow-sm
                "
              >
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
                  ❤️
                </div>

                <p className="mt-2 text-[9px] font-black text-[var(--color-text-secondary)] sm:text-[10px]">
                  Loved
                </p>
              </div>

            </div>

          </div>

          {/* =======================================================
              RIGHT - PRODUCT INFO
          ======================================================= */}

          <div className="flex flex-col">

            {/* Small label */}

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-[var(--color-secondary)]" />

              <span
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-[var(--color-secondary)]
                "
              >
                Freshly Prepared
              </span>

            </div>

            {/* Product title */}

            <h1
              className="
                mt-3
                text-3xl
                font-black
                leading-tight
                tracking-tight
                text-[var(--color-text-primary)]
                sm:text-4xl
                lg:text-5xl
              "
            >
              {product.name}
            </h1>

            {/* Rating */}

            <div className="mt-4 flex flex-wrap items-center gap-3">

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-[var(--color-star)]/10
                  px-3
                  py-1.5
                "
              >
                <Star
                  size={14}
                  fill="currentColor"
                  className="text-[var(--color-star)]"
                />

                <span className="text-xs font-black text-[var(--color-text-primary)]">
                  4.8
                </span>
              </div>

              <span className="text-xs text-[var(--color-text-muted)]">
                Excellent choice by our customers
              </span>

            </div>

            {/* Price */}

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-white
                p-4
                shadow-sm
              "
            >

              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Price
              </p>

              <div className="mt-1 flex items-end gap-2">

                <span
                  className="
                    text-3xl
                    font-black
                    text-[var(--color-primary)]
                  "
                >
                  ₹{formatRupee(product.price)}
                </span>

                <span className="pb-1 text-xs text-[var(--color-text-muted)]">
                  / item
                </span>

              </div>

            </div>

            {/* Description */}

            <div className="mt-6">

              <h2 className="text-sm font-black text-[var(--color-text-primary)]">
                About this item
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  leading-7
                  text-[var(--color-text-secondary)]
                "
              >
                {product.description ||
                  "Delicious and freshly prepared at SFC Cafe with quality ingredients for a great taste in every bite."}
              </p>

            </div>

            {/* Product highlights */}

            <div className="mt-6 grid grid-cols-2 gap-2">

              <div
                className="
                  flex
                  items-center
                  gap-3
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
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <Utensils size={17} />
                </div>

                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-primary)]">
                    Freshly Made
                  </p>

                  <p className="mt-0.5 text-[9px] text-[var(--color-text-muted)]">
                    Prepared on order
                  </p>
                </div>

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
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
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <Clock3 size={17} />
                </div>

                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-primary)]">
                    Quick Service
                  </p>

                  <p className="mt-0.5 text-[9px] text-[var(--color-text-muted)]">
                    Fresh & ready fast
                  </p>
                </div>

              </div>

            </div>

            {/* =====================================================
                CART ACTION
            ===================================================== */}

            <div
              className="
                mt-7
                rounded-3xl
                border
                border-[var(--color-border)]
                bg-white
                p-4
                shadow-sm
                sm:p-5
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-black text-[var(--color-text-primary)]">
                    Quantity
                  </p>

                  <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                    Choose how many you want
                  </p>

                </div>

                {/* Quantity */}

                {inCartQty ? (

                  <div className="flex flex-col items-end gap-1">
                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        rounded-full
                        bg-[var(--color-primary-50)]
                        p-1
                        ring-1
                        ring-[var(--color-primary)]/10
                      "
                    >

                      <button
                        type="button"
                        onClick={() =>
                          changeQty(
                            Math.max(0, inCartQty - 1)
                          )
                        }
                        className="
                          flex
                          h-9
                          w-9
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
                          size={15}
                          strokeWidth={3}
                        />
                      </button>

                      <span
                        className="
                          min-w-[34px]
                          text-center
                          text-sm
                          font-black
                          text-[var(--color-primary)]
                        "
                      >
                        {inCartQty}
                      </span>

                      <button
                        type="button"
                        title={
                          product.availability_type !== "MADE_TO_ORDER" &&
                          inCartQty >= Number(product.stock)
                            ? `Only ${product.stock} items available in stock`
                            : "Increase quantity"
                        }
                        disabled={
                          product.availability_type !== "MADE_TO_ORDER" &&
                          inCartQty >= Number(product.stock)
                        }
                        onClick={() =>
                          changeQty(inCartQty + 1)
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-[var(--color-primary)]
                          text-white
                          shadow-sm
                          transition
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                          active:scale-90
                        "
                      >
                        <Plus
                          size={15}
                          strokeWidth={3}
                        />
                      </button>

                    </div>

                    {product.availability_type === "MADE_TO_ORDER" ? (
                      <span className="text-[10px] font-bold text-orange-600">
                        Freshly Made to Order
                      </span>
                    ) : inCartQty >= Number(product.stock) ? (
                      <span className="text-[10px] font-bold text-amber-600">
                        Max stock ({product.stock}) reached
                      </span>
                    ) : null}
                  </div>

                ) : (

                  <div className="flex flex-col items-end gap-1">
                    <div
                      className="
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
                        onClick={() =>
                          setQty(Math.max(1, qty - 1))
                        }
                        className="
                          flex
                          h-9
                          w-9
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
                          size={15}
                          strokeWidth={3}
                        />
                      </button>

                      <span
                        className="
                          min-w-[34px]
                          text-center
                          text-sm
                          font-black
                          text-[var(--color-primary)]
                        "
                      >
                        {qty}
                      </span>

                      <button
                        type="button"
                        title={
                          product.availability_type !== "MADE_TO_ORDER" &&
                          qty >= Number(product.stock)
                            ? `Only ${product.stock} items available in stock`
                            : "Increase quantity"
                        }
                        disabled={
                          product.availability_type !== "MADE_TO_ORDER" &&
                          qty >= Number(product.stock)
                        }
                        onClick={() =>
                          setQty(qty + 1)
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-[var(--color-primary)]
                          text-white
                          shadow-sm
                          transition
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                          active:scale-90
                        "
                      >
                        <Plus
                          size={15}
                          strokeWidth={3}
                        />
                      </button>

                    </div>

                    {product.availability_type === "MADE_TO_ORDER" ? (
                      <span className="text-[10px] font-bold text-orange-600">
                        Cooked on demand
                      </span>
                    ) : Number(product.stock) <= 5 && Number(product.stock) > 0 ? (
                      <span className="text-[10px] font-bold text-amber-600">
                        Only {product.stock} left in stock
                      </span>
                    ) : null}
                  </div>

                )}

              </div>

              {/* Add button */}

              {!inCartQty && (
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAdd}
                  className={`
                    mt-4
                    flex
                    h-14
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    px-5
                    text-sm
                    font-black
                    text-white
                    shadow-lg
                    transition-all
                    duration-200
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    ${added
                      ? "bg-[var(--color-success)]"
                      : isOutOfStock
                      ? "bg-stone-400"
                      : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
                    }
                  `}
                >

                  {added ? (
                    <>
                      <Check size={19} strokeWidth={3} />

                      Added to Cart
                    </>
                  ) : isOutOfStock ? (
                    <span>Out of Stock</span>
                  ) : (
                    <>
                      <ShoppingBag
                        size={19}
                        strokeWidth={2.5}
                      />

                      Add {qty} to Cart
                    </>
                  )}

                </button>
              )}

              {/* Already in cart */}

              {inCartQty && (
                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[var(--color-primary-50)]
                    py-3
                    text-xs
                    font-black
                    text-[var(--color-primary)]
                  "
                >
                  <Check size={15} strokeWidth={3} />

                  {inCartQty} item
                  {inCartQty !== 1 ? "s" : ""} already in your cart
                </div>
              )}

            </div>

            {/* Delivery info */}

            <div
              className="
                mt-3
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-[var(--color-primary-50)]
                p-4
              "
            >

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
                <Truck size={18} />
              </div>

              <div>

                <p className="text-xs font-black text-[var(--color-text-primary)]">
                  Freshness you can taste
                </p>

                <p className="mt-0.5 text-[10px] leading-4 text-[var(--color-text-secondary)]">
                  Your order is prepared fresh and packed carefully.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          LOWER INFORMATION SECTION
      ========================================================= */}

      <section className="border-y border-[var(--color-border)] bg-white">

        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

            {/* About */}

            <div>

              <div className="mb-3 flex items-center gap-2">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <Utensils size={17} />
                </div>

                <h2 className="text-sm font-black text-[var(--color-text-primary)]">
                  Made With Care
                </h2>

              </div>

              <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
                Every item is prepared with attention to taste,
                freshness and quality so you can enjoy your food
                just the way it should be.
              </p>

            </div>

            {/* Quality */}

            <div>

              <div className="mb-3 flex items-center gap-2">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <Star
                    size={17}
                    fill="currentColor"
                  />
                </div>

                <h2 className="text-sm font-black text-[var(--color-text-primary)]">
                  Customer Favorite
                </h2>

              </div>

              <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
                Loved by customers for its delicious taste,
                fresh preparation and satisfying experience.
              </p>

            </div>

            {/* Fresh */}

            <div>

              <div className="mb-3 flex items-center gap-2">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <Flame size={17} />
                </div>

                <h2 className="text-sm font-black text-[var(--color-text-primary)]">
                  Fresh & Delicious
                </h2>

              </div>

              <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
                Prepared fresh to deliver the best possible
                flavor and quality with every order.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          BOTTOM CTA
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-[var(--color-primary-dark)]
            px-5
            py-8
            shadow-xl
            md:px-10
            md:py-10
          "
        >

          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                Still hungry?
              </p>

              <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
                Explore more delicious food
              </h2>

              <p className="mt-2 text-xs text-white/60">
                Discover more favorites from our menu.
              </p>

            </div>

            <Link
              href="/menu"
              className="
                inline-flex
                h-12
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-white
                px-5
                text-xs
                font-black
                text-[var(--color-primary-dark)]
                shadow-lg
                transition
                hover:-translate-y-0.5
                active:scale-95
              "
            >
              Explore Menu

              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
