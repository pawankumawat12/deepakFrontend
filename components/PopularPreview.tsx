"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import data from "./data/products";
import { useRouter } from "next/navigation";

const { categories } = data;

export default function PopularPreview() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [autoplay, setAutoplay] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      el.scrollBy({ left: el.clientWidth * 0.6, behavior: "smooth" });
    }, 3500);
    return () => clearInterval(id);
  }, [autoplay]);

  function goToCategory(id: string) {
    router.push(`/menu?category=${encodeURIComponent(id)}`);
  }

  function scrollBy(dir: number) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Shop by Category</h2>
        <div className="flex items-center gap-3">
          <Link href="/menu" className="text-sm rounded-full bg-[var(--color-primary)] px-4 py-1 text-white">
            View all products
          </Link>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
          className="flex gap-4 overflow-x-auto px-2 pb-2 scroll-smooth snap-x touch-pan-x scrollbar-x"
        >
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => goToCategory(c.id)}
              className="snap-start min-w-[220px] max-w-xs overflow-hidden rounded-lg bg-white p-0 shadow transition-transform hover:-translate-y-1"
            >
              <div className="h-36 w-full overflow-hidden">
                <img src={c.img} alt={c.name} className="h-full w-full object-cover" />
              </div>
              <div className="px-3 py-2">
                <div className="font-medium">{c.name}</div>
              </div>
            </button>
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
