"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Flame,
  Tag,
  Zap,
} from "lucide-react";
import { useGetOffersQuery, OfferItem } from "@/redux/services/offerApi";

const defaultMockOffers = [
  {
    id: 1,
    badge: "BEST VALUE",
    title: "Burger Combo",
    subtitle: "Burger + Crispy Fries + Cold Drink",
    code: "BURGER24",
    price: 249,
    oldPrice: 329,
    discount: "24% OFF",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85",
    bg: "bg-[var(--color-primary)]",
  },
  {
    id: 2,
    badge: "HOT DEAL",
    title: "Pizza Party",
    subtitle: "Large Pizza + Garlic Bread + 2 Drinks",
    code: "PIZZA23",
    price: 499,
    oldPrice: 649,
    discount: "23% OFF",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85",
    bg: "bg-[var(--color-secondary)]",
  },
  {
    id: 3,
    badge: "LIMITED TIME",
    title: "Family Feast",
    subtitle: "2 Burgers + Pizza + Fries + 4 Drinks",
    code: "FEAST20",
    price: 799,
    oldPrice: 999,
    discount: "20% OFF",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85",
    bg: "bg-[var(--color-coffee)]",
  },
];

export default function SpecialOffers() {
  const { data: dbOffers = [] } = useGetOffersQuery();
  const [activeOffer, setActiveOffer] = useState(0);

  const displayOffers = (dbOffers && dbOffers.length > 0 ? dbOffers.slice(0, 3) : []).map((o, idx) => {
    let discountStr = `${o.discount_value}% OFF`;
    if (o.type === "FLAT") discountStr = `₹${o.discount_value} OFF`;
    if (o.type === "BOGO") discountStr = `BUY ${o.buy_qty} GET ${o.get_qty}`;

    return {
      id: o.id,
      badge: o.badge || (o.auto_apply ? "AUTO APPLIED" : "SPECIAL DEAL"),
      title: o.title,
      subtitle: o.description || `Use code ${o.code} at checkout`,
      code: o.code,
      discount: discountStr,
      minOrder: o.min_order_amount,
      image: o.banner_image || defaultMockOffers[idx % defaultMockOffers.length].image,
    };
  });

  const finalOffers = displayOffers.length > 0 ? displayOffers : defaultMockOffers;
  const currentActive = Math.min(activeOffer, finalOffers.length - 1);
  const offer = finalOffers[currentActive] || finalOffers[0];

  return (
    <section className="bg-[var(--bg-body)] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                <Tag size={13} />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                Don't Miss Out
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              Special Dynamic Offers
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)] md:text-base">
              Big flavors, better prices. Grab your favorite meal combo before the offer ends.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-[var(--color-secondary)]/10 px-4 py-2 text-xs font-bold text-[var(--color-secondary)] sm:flex">
            <Flame size={14} fill="currentColor" />
            Limited Time Deals
          </div>
        </div>

        {/* =====================================================
            FEATURED OFFER
        ===================================================== */}
        <div className="relative overflow-hidden rounded-3xl bg-[var(--color-primary)] shadow-[0_20px_50px_rgba(79,125,22,0.18)]">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white opacity-[0.08]" />
          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-black opacity-[0.08]" />

          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            {/* Left Content */}
            <div className="p-8 sm:p-10 lg:p-14">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-white backdrop-blur-sm">
                <Flame size={13} fill="currentColor" />
                {offer.badge}
              </div>

              <h3 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {offer.title}
              </h3>

              <p className="mt-2 text-base font-semibold text-white/90">
                {offer.subtitle}
              </p>

              {offer.code && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3.5 py-2 text-xs font-mono font-bold text-white border border-white/20">
                  <Tag size={13} />
                  CODE: {offer.code}
                </div>
              )}

              {/* Highlights */}
              <div className="mt-6 flex flex-wrap gap-4 border-t border-white/20 pt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-white/90">
                  <Zap size={15} />
                  Instant Savings
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-white/90">
                  <Clock3 size={15} />
                  Valid Today
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-[var(--color-primary)] shadow-lg transition hover:-translate-y-0.5"
                >
                  Order This Deal
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/offers"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  View All Offers
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[320px] overflow-hidden">
              <img
                src={offer.image}
                alt={offer.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-transparent to-transparent lg:from-[var(--color-primary)] lg:via-[var(--color-primary)]/20 lg:to-transparent" />

              {/* Discount Circle */}
              <div className="absolute right-5 top-5 flex h-20 w-20 rotate-[-8deg] flex-col items-center justify-center rounded-full bg-white text-center shadow-xl sm:right-8 sm:top-8 sm:h-24 sm:w-24">
                <span className="text-xl font-black text-[var(--color-secondary)]">
                  {offer.discount}
                </span>
                <span className="text-[9px] font-bold uppercase text-[var(--color-text-muted)]">
                  Special
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            OFFER SELECTORS
        ===================================================== */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {finalOffers.map((item, index) => {
            const isActive = index === currentActive;
            return (
              <button
                key={item.id || index}
                type="button"
                onClick={() => setActiveOffer(index)}
                className={`
                  group flex items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300
                  ${
                    isActive
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-50)] shadow-sm"
                      : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/40"
                  }
                `}
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`
                      text-[10px] font-bold uppercase tracking-wider
                      ${
                        isActive
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-text-muted)]"
                      }
                    `}
                  >
                    {item.badge}
                  </p>
                  <h4 className="mt-0.5 truncate text-sm font-bold text-[var(--color-text-primary)]">
                    {item.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-black text-[var(--color-secondary)]">
                      {item.discount}
                    </span>
                    {item.code && (
                      <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                        {item.code}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`
                    h-2 w-2 shrink-0 rounded-full transition
                    ${
                      isActive
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--color-border)]"
                    }
                  `}
                />
              </button>
            );
          })}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-7 flex justify-center">
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] transition hover:gap-3"
          >
            See All Offers
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}