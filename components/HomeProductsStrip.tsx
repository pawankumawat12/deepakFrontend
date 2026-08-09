"use client";

import React, { useEffect, useRef, useState } from "react";
import data from "./data/products";
import Link from "next/link";

const { products } = data;

function formatRupee(v: number) {
  return v % 100 === 0 ? (v / 100).toFixed(0) : (v / 100).toFixed(2);
}

export default function HomeProductsStrip() {
  const preview = products.slice(0, 12);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      el.scrollBy({ left: el.clientWidth * 0.6, behavior: "smooth" });
    }, 3800);
    return () => clearInterval(id);
  }, [autoplay]);

  function scrollBy(dir: number) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Popular Picks</h3>
        <Link href="/menu" className="text-sm rounded-full px-3 py-1 btn-accent">
          See all
        </Link>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
          className="flex gap-4 overflow-x-auto px-2 pb-2 scroll-smooth snap-x touch-pan-x scrollbar-x"
        >
          {preview.map((p) => (
            <article key={p.id} className="snap-start min-w-[220px] max-w-xs rounded-lg bg-white p-3 shadow">
              <Link href={`/product/${p.id}`} className="block">
                <div className="overflow-hidden rounded-md">
                  <img src={p.img} alt={p.name} className="h-36 w-full object-cover" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{p.category}</div>
                  </div>
                  <div className="text-sm font-semibold">₹{formatRupee(p.price)}</div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <button aria-label="Prev" onClick={() => scrollBy(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow">
          ‹
        </button>
        <button aria-label="Next" onClick={() => scrollBy(1)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow">
          ›
        </button>
      </div>
    </section>
  );
}
