"use client";

import React from "react";
import {
  Leaf,
  Zap,
  Truck,
  Heart,
  ShieldCheck,
  Clock3,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: 1,
    icon: Leaf,
    title: "Fresh Ingredients",
    description:
      "We use fresh and carefully selected ingredients to make every meal delicious.",
    color:
      "bg-[var(--color-primary-50)] text-[var(--color-primary)]",
  },
  {
    id: 2,
    icon: Zap,
    title: "Made Fresh & Fast",
    description:
      "Your food is prepared fresh when you order, without compromising on taste.",
    color:
      "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]",
  },
  {
    id: 3,
    icon: Truck,
    title: "Quick Delivery",
    description:
      "Hot and fresh food delivered quickly and safely right to your doorstep.",
    color:
      "bg-[var(--color-primary-50)] text-[var(--color-primary)]",
  },
  {
    id: 4,
    icon: Heart,
    title: "Made With Love",
    description:
      "Every dish is prepared with care because great food should feel special.",
    color:
      "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-cream)]  px-4 py-6 md:px-8 md:py-10">

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-20
          h-72
          w-72
          rounded-full
          bg-[var(--color-primary)]
          opacity-[0.05]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-0
          h-80
          w-80
          rounded-full
          bg-[var(--color-secondary)]
          opacity-[0.06]
          blur-3xl
        "
      />

      <div className="relative mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto mb-12 max-w-2xl text-center">

          {/* Small label */}

          <div className="mb-3 flex items-center justify-center gap-2">

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-[var(--color-primary)]
              "
            />

            <span
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-[var(--color-primary)]
              "
            >
              Why Choose Us
            </span>

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-[var(--color-primary)]
              "
            />
          </div>

          {/* Heading */}

          <h2
            className="
              text-3xl
              font-black
              tracking-tight
              text-[var(--color-text-primary)]
              md:text-4xl
              lg:text-5xl
            "
          >
            More Than Just
            <span className="text-[var(--color-primary)]">
              {" "}
              Fast Food
            </span>
          </h2>

          <p
            className="
              mt-4
              text-sm
              leading-6
              text-[var(--color-text-secondary)]
              md:text-base
            "
          >
            We believe great food starts with great ingredients,
            careful preparation and a whole lot of love.
          </p>
        </div>

        {/* =====================================================
            FEATURES
        ===================================================== */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-6
                  text-center
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-[var(--color-primary)]/30
                  hover:shadow-[0_18px_40px_rgba(79,125,22,0.12)]
                "
              >

                {/* Number */}

                <span
                  className="
                    absolute
                    right-4
                    top-4
                    text-4xl
                    font-black
                    text-[var(--color-primary)]/[0.05]
                  "
                >
                  0{feature.id}
                </span>

                {/* Icon */}

                <div
                  className={`
                    relative
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    ${feature.color}
                    transition-transform
                    duration-300
                    group-hover:scale-110
                    group-hover:rotate-3
                  `}
                >
                  <Icon size={28} />
                </div>

                {/* Title */}

                <h3
                  className="
                    mt-5
                    text-lg
                    font-extrabold
                    text-[var(--color-text-primary)]
                  "
                >
                  {feature.title}
                </h3>

                {/* Description */}

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-[var(--color-text-muted)]
                  "
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            TRUST STRIP
        ===================================================== */}

        <div
          className="
            mt-8
            grid
            overflow-hidden
            rounded-2xl
            border
            border-[var(--color-border)]
            bg-white
            sm:grid-cols-3
          "
        >

          {/* Rating */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              border-b
              border-[var(--color-border)]
              px-5
              py-5
              sm:border-b-0
              sm:border-r
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[var(--color-secondary)]/10
                text-[var(--color-secondary)]
              "
            >
              <ShieldCheck size={20} />
            </div>

            <div>
              <p className="text-sm font-black text-[var(--color-text-primary)]">
                Quality Assured
              </p>

              <p className="text-[11px] text-[var(--color-text-muted)]">
                Every order
              </p>
            </div>
          </div>

          {/* Preparation */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              border-b
              border-[var(--color-border)]
              px-5
              py-5
              sm:border-b-0
              sm:border-r
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
              "
            >
              <Clock3 size={20} />
            </div>

            <div>
              <p className="text-sm font-black text-[var(--color-text-primary)]">
                Quick Preparation
              </p>

              <p className="text-[11px] text-[var(--color-text-muted)]">
                Freshly made
              </p>
            </div>
          </div>

          {/* Customer */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              px-5
              py-5
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[var(--color-secondary)]/10
                text-[var(--color-secondary)]
              "
            >
              <Heart size={20} />
            </div>

            <div>
              <p className="text-sm font-black text-[var(--color-text-primary)]">
                Customer First
              </p>

              <p className="text-[11px] text-[var(--color-text-muted)]">
                Always
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            CTA
        ===================================================== */}

        <div className="mt-10 text-center">

          <Link
            href="/menu"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[var(--color-primary)]
              px-6
              py-3.5
              text-sm
              font-bold
              shadow-[0_10px_25px_rgba(79,125,22,0.20)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[var(--color-primary-dark)]
            "
            style={{color:"white"}}
          >
            Taste The Difference

            <ArrowRight size={17} className="text-white"/>
          </Link>
        </div>
      </div>
    </section>
  );
}