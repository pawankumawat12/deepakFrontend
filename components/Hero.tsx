"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    title: "Fresh Cakes Delivered",
    subtitle: "Baked daily at SFC Cafe",
    cta: "Order Now",
    href: "/menu",
    img: "https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Celebrate With Flavor",
    subtitle: "Custom cakes, cupcakes & more",
    cta: "Explore Menu",
    href: "/menu",
    img: "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Warm Coffee & Pastries",
    subtitle: "Perfect morning combo",
    cta: "Visit Us",
    href: "/contact",
    img: "https://images.unsplash.com/photo-1516685018646-549b8b5a13b1?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh]">
        {slides.map((s, i) => (
          <div
            key={s.title}
            className={`absolute inset-0 flex items-center justify-center px-6 hero-slide transition-transform ${
              i === index ? "translate-x-0 opacity-100 z-20" : i < index ? "-translate-x-full opacity-0 z-10" : "translate-x-full opacity-0 z-10"
            }`}
          >
            <img
              src={s.img}
              alt={s.title}
              className="absolute inset-0 h-full w-full object-cover brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.12)] to-[rgba(0,0,0,0.28)]" />
            <div className="relative z-30 max-w-4xl text-center text-white">
              <h1 className="animate-fade-up mb-4 text-3xl font-extrabold leading-tight md:text-5xl">
                {s.title}
              </h1>
              <p className="animate-fade-up mb-6 text-sm md:text-lg text-white/90">{s.subtitle}</p>
              <div className="animate-fade-up">
                <Link
                  href={s.href}
                  className="inline-block rounded-3xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-white)] shadow-lg transition-transform duration-200 hover:-translate-y-1"
                >
                  {s.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
              i === index ? "bg-[var(--color-primary)] w-8 shadow-md" : "bg-[var(--color-cream)]/60 w-4"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-y-0 left-4 flex items-center z-30 md:left-6">
        <button
          aria-label="Previous"
          onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
          className="rounded-full bg-[rgba(255,255,255,0.8)]/40 p-2 shadow hover:scale-105"
        >
          ‹
        </button>
      </div>

      <div className="absolute inset-y-0 right-4 flex items-center z-30 md:right-6">
        <button
          aria-label="Next"
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
          className="rounded-full bg-[rgba(255,255,255,0.8)]/40 p-2 shadow hover:scale-105"
        >
          ›
        </button>
      </div>
    </section>
  );
}
