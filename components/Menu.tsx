"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Flame,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Utensils,
} from "lucide-react";

import data from "./data/products";

const { categories, products } = data;

import cartStore from "./cart/store";

function formatRupee(v: number) {
  return v % 100 === 0 ? (v / 100).toFixed(0) : (v / 100).toFixed(2);
}

type CartItem = {
  id: number;
  qty: number;
};

export default function Menu() {
  const [selected, setSelected] = useState<string>(categories[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [page, setPage] = useState<number>(1);

  const pageSize = 8;

  const gridRef = useRef<HTMLDivElement | null>(null);

  const visibleProducts = useMemo(() => {
    if (selected === "all") return products;

    return products.filter((p) => p.category === selected);
  }, [selected]);

  // pagination via infinite scroll
  const totalPages = Math.max(
    1,
    Math.ceil(visibleProducts.length / pageSize)
  );

  useEffect(() => setPage(1), [selected]);

  // if URL contains ?category=..., set selected accordingly
  const searchParams = useSearchParams();

  useEffect(() => {
    const cat = searchParams?.get("category");

    if (cat && categories.find((c) => c.id === cat)) {
      setSelected(cat);
      setPage(1);
    }
  }, [searchParams]);

  // fallback: sometimes searchParams may be empty immediately after client nav,
  // read window.location.search on mount as a robust fallback.
  useEffect(() => {
    try {
      const qp = new URLSearchParams(window.location.search);
      const cat = qp.get("category");

      if (cat && categories.find((c) => c.id === cat)) {
        setSelected(cat);
        setPage(1);
      }
    } catch (e) {
      /* ignore */
    }
  }, []);

  const pagedProducts = useMemo(() => {
    const start = 0;

    return visibleProducts.slice(0, page * pageSize);
  }, [visibleProducts, page]);

  function addToCart(productId: number) {
    const next = cartStore.addToCart(productId, 1);

    setCart(next);
  }

  function changeQty(productId: number, qty: number) {
    const next = cartStore.updateQty(productId, qty);

    setCart(next);
  }

  const summary = useMemo(() => {
    const items = cart.reduce((acc, it) => acc + it.qty, 0);

    const total = cart.reduce((acc, it) => {
      const p = products.find((x) => x.id === it.id)!;

      return acc + p?.price * it.qty;
    }, 0);

    return {
      items,
      total,
    };
  }, [cart]);

  // sync cart from storage on mount
  useEffect(() => {
    setCart(cartStore.getCart());
  }, []);

  // listen for cart updates from other components
  useEffect(() => {
    function onUpdate() {
      setCart(cartStore.getCart());
    }

    window.addEventListener("sfc_cart_updated", onUpdate);

    return () => {
      window.removeEventListener("sfc_cart_updated", onUpdate);
    };
  }, []);

  // Smooth scroll to grid when selecting category
  function selectCategory(id: string) {
    setSelected(id);
    setPage(1);

    setTimeout(() => {
      gridRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  // IntersectionObserver to add 'product-seen' when entering viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("product-seen");
          }
        });
      },
      {
        threshold: 0.18,
      }
    );

    const grid = gridRef.current;

    if (!grid) return;

    const items = grid.querySelectorAll(".product-card");

    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [page, selected]);

  // sentinel for infinite loading
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;

    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && page < totalPages) {
            setPage((p) => Math.min(totalPages, p + 1));
          }
        });
      },
      {
        root: null,
        rootMargin: "200px",
      }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, [page, totalPages, selected]);

  const selectedCategoryName =
    selected === "all"
      ? "All Food"
      : categories.find((c) => c.id === selected)?.name || "Menu";

  return (
    <main className="min-h-screen bg-[var(--bg-body)] pb-32">

      {/* =========================================================
          HERO / MENU HEADER
      ========================================================= */}

      <section className="relative overflow-hidden bg-[var(--color-primary-dark)]">

        {/* Decorative background */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />

        <div className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[var(--color-secondary)]/10" />

        <div className="pointer-events-none absolute right-[20%] top-1/2 h-20 w-20 rounded-full bg-white/[0.03]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">

          <div className="max-w-3xl">

            {/* Small badge */}

            <div
              className="
                mb-5
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/10
                px-3
                py-1.5
                backdrop-blur-md
              "
            >
              <Utensils
                size={14}
                className="text-[var(--color-primary-light)]"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                Fresh • Fast • Delicious
              </span>
            </div>

            {/* Heading */}

            <h1
              className="
                text-4xl
                font-black
                tracking-tight
                text-white
                md:text-5xl
                lg:text-6xl
              "
            >
              Our Menu
            </h1>

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-white/65
                md:text-base
              "
            >
              Explore our freshly prepared favorites, made with
              quality ingredients and served with great taste.
            </p>

          </div>

          {/* Hero quick stats */}

          <div className="mt-8 flex flex-wrap gap-2">

            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur">
              <span className="text-xs font-bold text-white">
                🍔 Freshly Prepared
              </span>
            </div>

            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur">
              <span className="text-xs font-bold text-white">
                ⚡ Quick Service
              </span>
            </div>

            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur">
              <span className="text-xs font-bold text-white">
                ❤️ Customer Favorites
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          CATEGORY NAVIGATION
      ========================================================= */}

      <section
        className="
          sticky
          top-0
          z-40
          border-b
          border-[var(--color-border)]
          bg-[var(--bg-body)]/95
          backdrop-blur-xl
        "
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8">

          <div
            className="
              flex
              gap-2
              overflow-x-auto
              py-3
              scrollbar-x
            "
          >

            {/* ALL */}

            <button
              type="button"
              onClick={() => selectCategory("all")}
              className={`
                flex
                h-11
                shrink-0
                items-center
                gap-2
                rounded-full
                px-5
                text-xs
                font-black
                transition-all
                duration-200
                active:scale-95
                ${
                  selected === "all"
                    ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                    : "border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }
              `}
            >
              <Utensils size={15} />

              All
            </button>

            {/* CATEGORIES */}

            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCategory(c.id)}
                className={`
                  group
                  flex
                  h-11
                  min-w-[120px]
                  shrink-0
                  items-center
                  gap-2
                  overflow-hidden
                  rounded-full
                  px-2
                  pr-4
                  text-xs
                  font-bold
                  transition-all
                  duration-200
                  active:scale-95
                  ${
                    selected === c.id
                      ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                      : "border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }
                `}
              >
                <img
                  src={c.img}
                  alt={c.name}
                  className="
                    h-9
                    w-9
                    rounded-full
                    object-cover
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />

                <span>{c.name}</span>

              </button>
            ))}

          </div>
        </div>
      </section>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div
        ref={gridRef}
        className="mx-auto max-w-7xl scroll-mt-20 px-4 md:px-8"
      >

        {/* =======================================================
            QUICK BENEFITS
        ======================================================= */}

        <section className="py-7 md:py-9">

          <div
            className="
              grid
              grid-cols-3
              gap-2
              rounded-2xl
              border
              border-[var(--color-border)]
              bg-white
              p-2
              shadow-sm
              md:gap-3
              md:p-3
            "
          >

            <div
              className="
                rounded-xl
                bg-[var(--color-primary-50)]
                px-2
                py-3
                text-center
                md:py-4
              "
            >
              <div className="text-lg md:text-xl">
                🥬
              </div>

              <p className="mt-1 text-[9px] font-black text-[var(--color-text-secondary)] sm:text-[10px]">
                Fresh Ingredients
              </p>
            </div>

            <div
              className="
                rounded-xl
                bg-[var(--color-primary-50)]
                px-2
                py-3
                text-center
                md:py-4
              "
            >
              <div className="text-lg md:text-xl">
                ⚡
              </div>

              <p className="mt-1 text-[9px] font-black text-[var(--color-text-secondary)] sm:text-[10px]">
                Quick Preparation
              </p>
            </div>

            <div
              className="
                rounded-xl
                bg-[var(--color-primary-50)]
                px-2
                py-3
                text-center
                md:py-4
              "
            >
              <div className="text-lg md:text-xl">
                ❤️
              </div>

              <p className="mt-1 text-[9px] font-black text-[var(--color-text-secondary)] sm:text-[10px]">
                Made With Care
              </p>
            </div>

          </div>

        </section>

        {/* =======================================================
            SECTION TITLE
        ======================================================= */}

        <section className="pb-5">

          <div className="flex items-end justify-between gap-4">

            <div>

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

              <h2
                className="
                  mt-2
                  text-2xl
                  font-black
                  tracking-tight
                  text-[var(--color-text-primary)]
                  md:text-3xl
                "
              >
                {selectedCategoryName}
              </h2>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {visibleProducts.length} delicious items
              </p>

            </div>

            <div
              className="
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-[var(--color-border)]
                bg-white
                px-4
                py-2
                text-xs
                font-bold
                text-[var(--color-text-secondary)]
                shadow-sm
                sm:flex
              "
            >
              <Flame
                size={15}
                className="text-[var(--color-secondary)]"
              />

              Customer Favorites
            </div>

          </div>

        </section>

        {/* =======================================================
            PRODUCT GRID
        ======================================================= */}

        <section>

          <div
            className="
              grid
              grid-cols-2
              gap-3
              pb-8
              sm:gap-5
              md:grid-cols-3
              lg:grid-cols-4
            "
          >

            {pagedProducts.map((p, index) => {

              const inCart = cart.find(
                (c) => c.id === p.id
              );

              return (
                <article
                  key={p.id}
                  className="
                    product-card
                    group
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[var(--color-border)]
                    bg-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="relative overflow-hidden">

                    <Link
                      href={`/product/${p.id}`}
                      className="block"
                    >
                      <img
                        src={p.img}
                        alt={p.name}
                        className="
                          h-40
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                          sm:h-48
                        "
                      />
                    </Link>

                    {/* Image gradient */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        bottom-0
                        h-20
                        bg-gradient-to-t
                        from-black/35
                        to-transparent
                      "
                    />

                    {/* Popular */}

                    {index < 2 && (
                      <div
                        className="
                          absolute
                          left-2
                          top-2
                          flex
                          items-center
                          gap-1
                          rounded-full
                          bg-[var(--color-secondary)]
                          px-2.5
                          py-1
                          text-[9px]
                          font-black
                          uppercase
                          text-white
                          shadow-lg
                        "
                      >
                        <Flame size={11} />

                        Popular
                      </div>
                    )}

                    {/* Category */}

                    <div
                      className="
                        absolute
                        right-2
                        top-2
                        max-w-[45%]
                        truncate
                        rounded-full
                        bg-white/90
                        px-2.5
                        py-1
                        text-[9px]
                        font-bold
                        capitalize
                        text-[var(--color-text-secondary)]
                        shadow
                        backdrop-blur-md
                      "
                    >
                      {p.category}
                    </div>

                  </div>

                  {/* =================================================
                      PRODUCT INFO
                  ================================================= */}

                  <div className="p-3.5 sm:p-4">

                    <Link
                      href={`/product/${p.id}`}
                      className="block"
                    >
                      <h3
                        className="
                          line-clamp-1
                          text-sm
                          font-black
                          text-[var(--color-text-primary)]
                          transition-colors
                          group-hover:text-[var(--color-primary)]
                          sm:text-base
                        "
                      >
                        {p.name}
                      </h3>

                      <p
                        className="
                          mt-1
                          line-clamp-2
                          min-h-[32px]
                          text-[10px]
                          leading-4
                          text-[var(--color-text-muted)]
                          sm:text-xs
                        "
                      >
                        Handcrafted — {p.category}
                      </p>
                    </Link>

                    {/* Rating */}

                    <div className="mt-3 flex items-center gap-1.5">

                      <div
                        className="
                          flex
                          items-center
                          gap-1
                          rounded-full
                          bg-[var(--color-star)]/10
                          px-2
                          py-1
                        "
                      >
                        <Star
                          size={11}
                          fill="currentColor"
                          className="text-[var(--color-star)]"
                        />

                        <span className="text-[10px] font-black text-[var(--color-text-primary)]">
                          4.8
                        </span>
                      </div>

                      <span className="hidden text-[9px] text-[var(--color-text-muted)] sm:block">
                        Loved by customers
                      </span>

                    </div>

                    {/* Price + Cart */}

                    <div className="mt-4 flex items-center justify-between gap-2">

                      <div>
                        <p className="text-[9px] font-medium text-[var(--color-text-muted)]">
                          Price
                        </p>

                        <div className="text-base font-black text-[var(--color-text-primary)] sm:text-lg">
                          ₹{formatRupee(p.price)}
                        </div>
                      </div>

                      {/* =================================================
                          EXISTING CART LOGIC
                      ================================================= */}

                      {inCart ? (

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
                            aria-label="Decrease quantity"
                            onClick={() =>
                              changeQty(
                                p.id,
                                Math.max(0, inCart.qty - 1)
                              )
                            }
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
                              active:scale-90
                            "
                          >
                            <Minus size={13} strokeWidth={3} />
                          </button>

                          <div
                            className="
                              min-w-[22px]
                              text-center
                              text-xs
                              font-black
                              text-[var(--color-primary)]
                            "
                          >
                            {inCart.qty}
                          </div>

                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              changeQty(
                                p.id,
                                inCart.qty + 1
                              )
                            }
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
                              active:scale-90
                            "
                          >
                            <Plus size={13} strokeWidth={3} />
                          </button>

                        </div>

                      ) : (

                        <button
                          type="button"
                          onClick={() => addToCart(p.id)}
                          className="
                            flex
                            h-9
                            items-center
                            gap-1.5
                            rounded-full
                            bg-[var(--color-primary)]
                            px-3.5
                            text-[10px]
                            font-black
                            text-white
                            shadow-md
                            shadow-[var(--color-primary)]/20
                            transition-all
                            duration-200
                            hover:bg-[var(--color-primary-dark)]
                            hover:shadow-lg
                            active:scale-90
                            sm:px-4
                            sm:text-xs
                          "
                        >
                          <Plus
                            size={14}
                            strokeWidth={3}
                          />

                          Add
                        </button>
                      )}

                    </div>

                    {/* Details */}

                    <Link
                      href={`/product/${p.id}`}
                      className="
                        mt-3
                        flex
                        items-center
                        justify-between
                        border-t
                        border-[var(--color-border)]
                        pt-3
                        text-[10px]
                        font-bold
                        text-[var(--color-text-muted)]
                        transition-colors
                        hover:text-[var(--color-primary)]
                      "
                    >
                      <span>View details</span>

                      <ChevronRight size={13} />

                    </Link>

                  </div>

                </article>
              );
            })}

          </div>

          {/* =======================================================
              INFINITE SCROLL SENTINEL
          ======================================================= */}

          <div
            ref={sentinelRef}
            className="h-8"
          />

        </section>

      </div>

      {/* =========================================================
          STICKY CART
      ========================================================= */}

      {summary.items > 0 && (
        <div
          className="
            cart-bar
            fixed
            inset-x-3
            bottom-4
            z-50
            mx-auto
            max-w-lg
            rounded-2xl
            border
            border-white/10
            bg-[var(--color-primary-dark)]/95
            p-2
            text-white
            shadow-[0_14px_45px_rgba(0,0,0,0.25)]
            backdrop-blur-xl
            sm:inset-x-auto
            sm:right-6
            sm:left-auto
            sm:mx-0
            sm:w-[360px]
          "
        >

          <div className="flex items-center justify-between gap-3 px-2">

            {/* Cart information */}

            <div className="flex min-w-0 items-center gap-3">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/10
                "
              >
                <ShoppingBag size={19} />
              </div>

              <div className="min-w-0">

                <p className="truncate text-[10px] font-semibold text-white/60">
                  {summary.items} item
                  {summary.items !== 1 ? "s" : ""} in your cart
                </p>

                <p className="text-sm font-black">
                  ₹{formatRupee(summary.total)}
                </p>

              </div>

            </div>

            {/* View cart */}

            <Link
              href="/cart"
              className="
                flex
                h-11
                shrink-0
                items-center
                gap-2
                rounded-xl
                bg-white
                px-4
                text-xs
                font-black
                text-[var(--color-primary-dark)]
                transition
                hover:-translate-y-0.5
                active:scale-95
              "
            >
              View Cart

              <ArrowRight size={15} />
            </Link>

          </div>

        </div>
      )}

    </main>
  );
}