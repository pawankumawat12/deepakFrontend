"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Flame,
  Tag,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Percent,
  Gift,
} from "lucide-react";
import { useGetOffersQuery, OfferItem } from "@/redux/services/offerApi";
import SkeletonLoader from "@/components/SkeletonLoader";
import toast from "react-hot-toast";

const filters = ["All", "Percentage Deals", "Flat Discounts", "BOGO / Combos"];

export default function OffersPage() {
  const { data: offers = [], isLoading } = useGetOffersQuery();
  const [activeFilter, setActiveFilter] = useState("All");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredOffers = useMemo(() => {
    if (!offers || offers.length === 0) return [];
    if (activeFilter === "All") return offers;
    if (activeFilter === "Percentage Deals") {
      return offers.filter(
        (o) =>
          o.type === "PERCENTAGE" ||
          o.type === "PRODUCT" ||
          o.type === "CATEGORY"
      );
    }
    if (activeFilter === "Flat Discounts") {
      return offers.filter((o) => o.type === "FLAT");
    }
    if (activeFilter === "BOGO / Combos") {
      return offers.filter((o) => o.type === "BOGO");
    }
    return offers;
  }, [offers, activeFilter]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Promo code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const formatDiscountPill = (offer: OfferItem) => {
    if (
      offer.type === "PERCENTAGE" ||
      offer.type === "PRODUCT" ||
      offer.type === "CATEGORY"
    ) {
      return `${offer.discount_value}% OFF`;
    }
    if (offer.type === "FLAT") {
      return `₹${offer.discount_value} OFF`;
    }
    if (offer.type === "BOGO") {
      return `BUY ${offer.buy_qty || 1} GET ${offer.get_qty || 1} FREE`;
    }
    return "DEAL";
  };

  const getFallbackBanner = (offer: OfferItem) => {
    if (offer.banner_image) return offer.banner_image;
    if (offer.type === "FLAT") {
      return "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=85";
    }
    if (offer.type === "BOGO") {
      return "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=85";
    }
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85";
  };

  return (
    <main className="min-h-screen bg-[var(--bg-body)]">
      <section className="relative overflow-hidden bg-[var(--color-primary)]">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-black/5" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 md:py-16 ">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>

          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wider text-white">
              <Flame size={15} fill="currentColor" />
              Exclusive Dynamic Deals
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Big Flavors.
              <br />
              <span className="text-[var(--color-secondary)]">
                Better Prices.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              Hungry for a great deal? Explore our latest combos, family offers,
              and delicious discounts made for your cravings.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-[var(--color-primary)] shadow-lg transition hover:-translate-y-0.5"
              >
                Explore Menu
                <ArrowRight size={17} />
              </Link>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-xs font-bold text-white">
                <Tag size={15} />
                Fresh Deals Every Day
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUST STRIP
      ========================================================= */}
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {[
            {
              icon: Zap,
              title: "Instant Auto-Apply",
              text: "Best savings on checkout",
            },
            { icon: Tag, title: "Great Value", text: "More food, less price" },
            {
              icon: CheckCircle2,
              title: "Fresh Food",
              text: "Prepared with care",
            },
            {
              icon: Clock3,
              title: "Limited Time",
              text: "Grab before it ends",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-3 border-b border-[var(--color-border)] p-4 last:border-b-0 sm:p-5 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-[var(--color-text-primary)]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          OFFERS LIST
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                <Tag size={14} />
              </span>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                Today's Special Offers
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
              All Active Promo Offers
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Pick your favorite deal, copy the promo code, or enjoy automatic
              discounts during checkout.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`
                  shrink-0 rounded-full px-5 py-2.5 text-xs font-bold transition
                  ${active
                    ? "bg-[var(--color-primary)] text-white shadow-md"
                    : "border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }
                `}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Offer Cards */}
        {isLoading ? (
          <SkeletonLoader
            variant="card"
            count={6}
            gridClassName="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOffers.map((offer) => (
              <article
                key={offer.id}
                className="group overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(45,27,15,0.12)] flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    <img
                      src={getFallbackBanner(offer)}
                      alt={offer.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badge */}
                    <div className="absolute left-4 top-4 rounded-full bg-[var(--color-secondary)] px-3 py-1.5 text-[10px] font-black text-white shadow-lg">
                      {offer.badge ||
                        (offer.auto_apply ? "AUTO APPLIED" : "SPECIAL DEAL")}
                    </div>

                    {/* Discount Circle */}
                    <div className="absolute bottom-4 right-4 flex h-16 w-16 rotate-[-6deg] flex-col items-center justify-center rounded-full bg-white text-center shadow-xl">
                      <span className="text-sm font-black text-[var(--color-secondary)]">
                        {formatDiscountPill(offer)}
                      </span>
                      <span className="text-[8px] font-bold uppercase text-[var(--color-text-muted)]">
                        Save
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-black text-[var(--color-text-primary)]">
                          {offer.title}
                        </h3>
                        {offer.min_order_amount > 0 && (
                          <p className="mt-1 text-xs font-semibold text-[var(--color-primary)]">
                            Min. Order: ₹{offer.min_order_amount}
                            {offer.max_discount_amount
                              ? ` (Up to ₹${offer.max_discount_amount})`
                              : ""}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                      {offer.description ||
                        `Use promo code ${offer.code} at checkout to claim this special offer.`}
                    </p>

                    {/* Coupon Box */}
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-[var(--color-primary)]/40 bg-[var(--color-primary-50)]/50 p-3">
                      <div className="flex items-center gap-2">
                        <Tag
                          size={16}
                          className="text-[var(--color-primary)]"
                        />
                        <span className="font-mono text-sm font-black uppercase tracking-wider text-[var(--color-text-primary)]">
                          {offer.code}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyCode(offer.code)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[var(--color-primary)] shadow-sm transition hover:bg-[var(--color-primary)] hover:text-white"
                      >
                        {copiedCode === offer.code ? (
                          <>
                            <Check size={13} className="text-green-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-5 pt-0">
                  <div className="flex items-center gap-3">
                    <Link
                      href="/menu"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
                    style={{color: "white"}}
                    >
                      Order Now
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredOffers.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-[var(--color-border)] bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
              <Tag size={24} />
            </div>
            <h3 className="mt-4 text-lg font-black text-[var(--color-text-primary)]">
              No offers available in this category
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Check back soon for fresh deals and discounts!
            </p>
          </div>
        )}
      </section>

      {/* =========================================================
          BOTTOM CTA
      ========================================================= */}
      <section className="px-4 pb-16 sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[var(--color-secondary)] px-6 py-10 text-center sm:px-10">
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white">
              <Flame size={23} fill="currentColor" />
            </div>
            <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
              Still hungry?
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Check out the complete SFC Cafe menu and find your next favorite
              meal.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-[var(--color-secondary-dark)] shadow-lg transition hover:-translate-y-0.5"
            >
              View Full Menu
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
