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
  Star,
  Award,
  Sparkles,
  Utensils,
  Flame,
  Coffee,
  Smile,
  ThumbsUp,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useGetWhyChooseUsQuery } from "../redux/services/whyChooseUsApi";
import { toAssetUrl } from "../utils/backendUrl";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Leaf,
  Zap,
  Truck,
  Heart,
  ShieldCheck,
  Clock3,
  Star,
  Award,
  Sparkles,
  Utensils,
  Flame,
  Coffee,
  Smile,
  ThumbsUp,
  CheckCircle2,
};

const FALLBACK_FEATURES = [
  {
    id: 1,
    icon: "Leaf",
    title: "Fresh Ingredients",
    description:
      "We use fresh and carefully selected ingredients to make every meal delicious.",
    color_class: "bg-[var(--color-primary-50)] text-[var(--color-primary)]",
  },
  {
    id: 2,
    icon: "Zap",
    title: "Made Fresh & Fast",
    description:
      "Your food is prepared fresh when you order, without compromising on taste.",
    color_class: "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]",
  },
  {
    id: 3,
    icon: "Truck",
    title: "Quick Delivery",
    description:
      "Hot and fresh food delivered quickly and safely right to your doorstep.",
    color_class: "bg-[var(--color-primary-50)] text-[var(--color-primary)]",
  },
  {
    id: 4,
    icon: "Heart",
    title: "Made With Love",
    description:
      "Every dish is prepared with care because great food should feel special.",
    color_class: "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]",
  },
];

const FALLBACK_SECTION = {
  badge: "Why Choose Us",
  title: "More Than Just",
  highlight: "Fast Food",
  subtitle:
    "We believe great food starts with great ingredients, careful preparation and a whole lot of love.",
  cta_text: "Taste The Difference",
  cta_href: "/menu",
};

export default function WhyChooseUs() {
  const { data } = useGetWhyChooseUsQuery();

  const section = data?.section || FALLBACK_SECTION;
  const features =
    data?.items && data.items.length > 0 ? data.items : FALLBACK_FEATURES;

  return (
    <section className="relative overflow-hidden bg-[var(--color-cream)] px-4 py-6 md:px-8 md:py-10">
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
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              {section.badge || "Why Choose Us"}
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
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
            {section.title || "More Than Just"}{" "}
            {section.highlight && (
              <span className="text-[var(--color-primary)]">
                {section.highlight}
              </span>
            )}
          </h2>

          {section.subtitle && (
            <p
              className="
                mt-4
                text-sm
                leading-6
                text-[var(--color-text-secondary)]
                md:text-base
              "
            >
              {section.subtitle}
            </p>
          )}
        </div>

        {/* =====================================================
            FEATURES
        ===================================================== */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => {
            const IconComponent =
              (feature.icon && ICON_MAP[feature.icon]) || Sparkles;
            const colorClass =
              feature.color_class ||
              (idx % 2 === 0
                ? "bg-[var(--color-primary-50)] text-[var(--color-primary)]"
                : "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]");

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
                  p-3.5
                  sm:p-6
                  text-center
                  shadow-xs
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
                    right-3
                    top-3
                    sm:right-4
                    sm:top-4
                    text-2xl
                    sm:text-4xl
                    font-black
                    text-[var(--color-primary)]/[0.05]
                  "
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                {/* Icon / Image */}
                <div
                  className={`
                    relative
                    mx-auto
                    flex
                    h-12
                    w-12
                    sm:h-16
                    sm:w-16
                    items-center
                    justify-center
                    rounded-xl
                    sm:rounded-2xl
                    ${colorClass}
                    transition-transform
                    duration-300
                    group-hover:scale-110
                    group-hover:rotate-3
                  `}
                >
                  {"image" in feature && feature.image ? (
                    <img
                      src={toAssetUrl(feature.image)}
                      alt={feature.title}
                      className="h-6 w-6 sm:h-8 sm:w-8 object-contain rounded-lg"
                    />
                  ) : (
                    <IconComponent className="h-5 w-5 sm:h-7 sm:w-7" />
                  )}
                </div>

                {/* Title */}
                <h3
                  className="
                    mt-3
                    sm:mt-5
                    text-sm
                    sm:text-lg
                    font-extrabold
                    text-[var(--color-text-primary)]
                  "
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    mt-1.5
                    sm:mt-2
                    text-[11px]
                    sm:text-sm
                    leading-relaxed
                    sm:leading-6
                    text-[var(--color-text-muted)]
                    line-clamp-3
                    sm:line-clamp-none
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
            href={section.cta_href || "/menu"}
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
            style={{ color: "white" }}
          >
            {section.cta_text || "Taste The Difference"}
            <ArrowRight size={17} className="text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}