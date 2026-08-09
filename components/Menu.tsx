"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import data from "./data/products";
const { categories, products } = data;
import cartStore from "./cart/store";

function formatRupee(v: number) {
  return v % 100 === 0 ? (v / 100).toFixed(0) : (v / 100).toFixed(2);
}

type CartItem = { id: number; qty: number };

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
  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
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
      return acc + p.price * it.qty;
    }, 0);
    return { items, total };
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
    return () => window.removeEventListener("sfc_cart_updated", onUpdate);
  }, []);

  // Smooth scroll to grid when selecting category
  function selectCategory(id: string) {
    setSelected(id);
    setPage(1);
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  // IntersectionObserver to add 'product-seen' when entering viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("product-seen");
        });
      },
      { threshold: 0.18 }
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
      { root: null, rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [page, totalPages, selected]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-xl font-bold">Menu</h1>
          <div className="hidden items-center gap-3 rounded-full bg-white/60 px-3 py-1 shadow sm:flex">
          <div className="text-sm">Cart:</div>
          <div className="font-semibold">{summary.items} items</div>
          <div className="text-sm text-[var(--color-text-secondary)]">₹{formatRupee(summary.total)}</div>
        </div>
      </div>

      <div className="-mx-4 mb-6 px-4">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory touch-pan-x scrollbar-x py-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => selectCategory(c.id)}
              className={`relative snap-center flex min-w-[140px] cursor-pointer items-end justify-center overflow-hidden rounded-2xl p-3 text-sm shadow-md transition-all duration-300 hover:scale-105 ${
                selected === c.id ? "ring-2 ring-[var(--color-primary)]" : "opacity-90"
              }`}
            >
              <img src={c.img} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="relative z-10 text-white text-sm font-semibold">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div ref={gridRef}>
        <h2 className="mb-4 text-lg font-semibold">{categories.find((x) => x.id === selected)?.name}</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pagedProducts.map((p) => {
            const accent = p.category === "cakes" ? "bg-pink-50" : p.category === "coffee" ? "bg-amber-50" : p.category === "bread" ? "bg-amber-100" : "bg-violet-50";
            const border = p.category === "cakes" ? "border-pink-200" : p.category === "coffee" ? "border-amber-200" : p.category === "bread" ? "border-amber-300" : "border-violet-200";
            const emoji = p.category === "cakes" ? "🎂" : p.category === "cupcakes" ? "🧁" : p.category === "coffee" ? "☕" : p.category === "bread" ? "🥐" : "🍽️";

            return (
              <div key={p.id} className={`product-card relative overflow-hidden rounded-xl border ${border} ${accent} p-3 shadow transition-transform duration-200`}>
                <div className="absolute right-3 top-3 rounded-full bg-white/80 px-2 py-1 text-xs font-semibold shadow">{emoji}</div>

                <div className="mb-3 overflow-hidden rounded-lg">
                  <Link href={`/product/${p.id}`} className="block">
                    <img src={p.img} alt={p.name} className="h-40 w-full object-cover" />
                  </Link>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/product/${p.id}`} className="block">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-[var(--color-text-secondary)]">Handcrafted — {p.category}</div>
                    </Link>
                  </div>
                  <div className="text-sm font-semibold">₹{formatRupee(p.price)}</div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {(() => {
                    const inCart = cart.find((c) => c.id === p.id);
                    if (inCart) {
                      return (
                        <div className="flex items-center gap-2">
                          <button onClick={() => changeQty(p.id, Math.max(0, inCart.qty - 1))} className="rounded-full bg-gray-100 px-3 py-1">-</button>
                          <div className="px-3">{inCart.qty}</div>
                          <button onClick={() => changeQty(p.id, inCart.qty + 1)} className="rounded-full bg-gray-100 px-3 py-1">+</button>
                        </div>
                      );
                    }

                    return (
                      <button
                        onClick={() => addToCart(p.id)}
                        className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-95"
                      >
                        Add
                      </button>
                    );
                  })()}

                  <Link href={`/product/${p.id}`} className="text-sm text-[var(--color-text-secondary)] hover:underline">
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* sentinel for infinite loading */}
        <div ref={sentinelRef} className="h-8" />
      </div>

      {summary.items > 0 && (
        <div className="cart-bar fixed inset-x-4 bottom-24 z-50 mx-auto max-w-7xl rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md sm:inset-x-auto sm:right-6 sm:left-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">{summary.items} item(s)</div>
              <div className="text-xs text-[var(--color-text-secondary)]">Total ₹{formatRupee(summary.total)}</div>
            </div>
            <div className="flex gap-2">
              <Link href="/cart" className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white">
                View Cart
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
