"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Flame,
  ShoppingCart,
  Tag,
  Zap,
} from "lucide-react";

const offers = [
  {
    id: 1,
    badge: "BEST VALUE",
    title: "Burger Combo",
    subtitle: "Burger + Crispy Fries + Cold Drink",
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
    price: 799,
    oldPrice: 999,
    discount: "20% OFF",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85",
    bg: "bg-[var(--color-coffee)]",
  },
];

export default function SpecialOffers() {
  const [activeOffer, setActiveOffer] = useState(0);

  const offer = offers[activeOffer];

  return (
    <section className="bg-[var(--bg-body)] px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-[var(--color-secondary)]/10
                  text-[var(--color-secondary)]
                "
              >
                <Tag size={13} />
              </span>

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--color-secondary)]
                "
              >
                Don't Miss Out
              </span>
            </div>

            <h2
              className="
                text-3xl
                font-black
                tracking-tight
                text-[var(--color-text-primary)]
                md:text-4xl
              "
            >
              Special Offers
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-[var(--color-text-secondary)]
                md:text-base
              "
            >
              Big flavors, better prices. Grab your favorite
              combo before the offer ends.
            </p>
          </div>

          <div
            className="
              hidden
              items-center
              gap-2
              rounded-full
              bg-[var(--color-secondary)]/10
              px-4
              py-2
              text-xs
              font-bold
              text-[var(--color-secondary)]
              sm:flex
            "
          >
            <Flame size={14} fill="currentColor" />
            Limited Time Deals
          </div>
        </div>

        {/* =====================================================
            FEATURED OFFER
        ===================================================== */}

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-[var(--color-primary)]
            shadow-[0_20px_50px_rgba(79,125,22,0.18)]
          "
        >

          {/* Decorative circles */}

          <div
            className="
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-white
              opacity-[0.08]
            "
          />

          <div
            className="
              absolute
              -bottom-32
              left-1/3
              h-80
              w-80
              rounded-full
              bg-black
              opacity-[0.06]
            "
          />

          <div
            className="
              relative
              grid
              min-h-[390px]
              lg:grid-cols-2
            "
          >

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div className="relative z-10 flex flex-col justify-center p-7 text-white sm:p-10 lg:p-14">

              {/* Badge */}

              <div
                className="
                  mb-5
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  bg-white/15
                  px-4
                  py-2
                  text-xs
                  font-black
                  tracking-wider
                  backdrop-blur
                "
              >
                <Zap size={14} fill="currentColor" />
                {offer.badge}
              </div>

              {/* Heading */}

              <h3
                key={offer.id}
                className="
                  animate-fade-up
                  max-w-lg
                  text-4xl
                  font-black
                  leading-tight
                  sm:text-5xl
                "
              >
                {offer.title}
              </h3>

              <p
                key={`subtitle-${offer.id}`}
                className="
                  mt-4
                  max-w-md
                  text-sm
                  leading-6
                  text-white/80
                  sm:text-base
                "
              >
                {offer.subtitle}
              </p>

              {/* Price */}

              <div className="mt-6 flex items-end gap-3">
                <span className="text-3xl font-black">
                  ₹{offer.price}
                </span>

                <span className="mb-1 text-sm text-white/60 line-through">
                  ₹{offer.oldPrice}
                </span>

                <span
                  className="
                    mb-1
                    rounded-full
                    bg-[var(--color-secondary)]
                    px-3
                    py-1
                    text-[10px]
                    font-black
                  "
                >
                  {offer.discount}
                </span>
              </div>

              {/* CTA */}

              <div className="mt-7 flex flex-wrap gap-3">

                <Link
                  href="/menu"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-6
                    py-3.5
                    text-sm
                    font-black
                    text-[var(--color-primary)]
                    shadow-lg
                    transition
                    hover:-translate-y-1
                  "
                >
                  Order Now

                  <ArrowRight size={17} />
                </Link>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-white/20
                    bg-white/10
                    px-4
                    py-3.5
                    text-xs
                    font-semibold
                    text-white/90
                  "
                >
                  <Clock3 size={15} />

                  Limited time
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT IMAGE
            ================================================= */}

            <div className="relative min-h-[280px] overflow-hidden lg:min-h-full">

              <img
                key={offer.image}
                src={offer.image}
                alt={offer.title}
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                "
              />

              {/* Overlay */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[var(--color-primary)]
                  via-transparent
                  to-transparent
                  lg:from-[var(--color-primary)]
                  lg:via-[var(--color-primary)]/20
                  lg:to-transparent
                "
              />

              {/* Discount circle */}

              <div
                className="
                  absolute
                  right-5
                  top-5
                  flex
                  h-20
                  w-20
                  rotate-[-8deg]
                  flex-col
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-center
                  shadow-xl
                  sm:right-8
                  sm:top-8
                  sm:h-24
                  sm:w-24
                "
              >
                <span
                  className="
                    text-xl
                    font-black
                    text-[var(--color-secondary)]
                  "
                >
                  {offer.discount}
                </span>

                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    text-[var(--color-text-muted)]
                  "
                >
                  Today
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            OFFER SELECTORS
        ===================================================== */}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">

          {offers.map((item, index) => {
            const isActive = index === activeOffer;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveOffer(index)}
                className={`
                  group
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  p-3
                  text-left
                  transition-all
                  duration-300
                  ${
                    isActive
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-50)] shadow-sm"
                      : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/40"
                  }
                `}
              >

                {/* Mini Image */}

                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition
                      duration-300
                      group-hover:scale-105
                    "
                  />
                </div>

                {/* Info */}

                <div className="min-w-0 flex-1">

                  <p
                    className={`
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      ${
                        isActive
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-text-muted)]"
                      }
                    `}
                  >
                    {item.badge}
                  </p>

                  <h4
                    className="
                      mt-0.5
                      truncate
                      text-sm
                      font-bold
                      text-[var(--color-text-primary)]
                    "
                  >
                    {item.title}
                  </h4>

                  <div className="mt-1 flex items-center gap-2">

                    <span
                      className="
                        text-sm
                        font-black
                        text-[var(--color-primary)]
                      "
                    >
                      ₹{item.price}
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-[var(--color-text-muted)]
                        line-through
                      "
                    >
                      ₹{item.oldPrice}
                    </span>
                  </div>
                </div>

                {/* Active indicator */}

                <span
                  className={`
                    h-2
                    w-2
                    shrink-0
                    rounded-full
                    transition
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

        {/* =====================================================
            BOTTOM CTA
        ===================================================== */}

        <div className="mt-7 flex justify-center">
          <Link
            href="/offers"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-bold
              text-[var(--color-primary)]
              transition
              hover:gap-3
            "
          >
            See All Offers

            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}