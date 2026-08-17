"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Heart,
  Truck,
  Utensils,
  Star,
  Flame,
} from "lucide-react";

const slides = [
  {
    tag: "FRESH & DELICIOUS",
    title: "Good Food,",
    highlight: "Good Mood.",
    subtitle:
      "Freshly prepared fast food made with quality ingredients, bold flavors and lots of love.",
    cta: "Order Now",
    secondaryCta: "View Menu",
    href: "/menu",
    secondaryHref: "/menu",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=85",
  },
  {
    tag: "HANDCRAFTED WITH LOVE",
    title: "Taste That",
    highlight: "Makes You Smile.",
    subtitle:
      "From juicy burgers to crispy fries, every bite is made fresh and served with flavor.",
    cta: "Explore Menu",
    secondaryCta: "Our Story",
    href: "/menu",
    secondaryHref: "/about",
    img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1400&q=85",
  },
  {
    tag: "FRESH • FAST • FLAVORFUL",
    title: "Your Favorite",
    highlight: "Food Is Here.",
    subtitle:
      "Craving something delicious? Pick your favorite meal and enjoy a fresh fast-food experience.",
    cta: "Order Food",
    secondaryCta: "Contact Us",
    href: "/menu",
    secondaryHref: "/contact",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=85",
  },
];

const categories = [
  {
    label: "Burgers",
    icon: "🍔",
    href: "/menu?category=burgers",
  },
  {
    label: "Pizzas",
    icon: "🍕",
    href: "/menu?category=pizza",
  },
  {
    label: "Wraps",
    icon: "🌯",
    href: "/menu?category=wraps",
  },
  {
    label: "Fries",
    icon: "🍟",
    href: "/menu?category=fries",
  },
  {
    label: "Drinks",
    icon: "🥤",
    href: "/menu?category=drinks",
  },
  {
    label: "Desserts",
    icon: "🍰",
    href: "/menu?category=desserts",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  /* --------------------------------------------------
     AUTO SLIDER
  -------------------------------------------------- */

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  const currentSlide = slides[index];

  /* --------------------------------------------------
     SLIDER CONTROLS
  -------------------------------------------------- */

  const previousSlide = () => {
    setIndex(
      (current) =>
        (current - 1 + slides.length) % slides.length
    );
  };

  const nextSlide = () => {
    setIndex(
      (current) =>
        (current + 1) % slides.length
    );
  };

  return (
    <main className="w-full overflow-hidden bg-[var(--bg-body)]">


      <section className="relative min-h-[720px] overflow-hidden bg-[var(--color-cream)]">

        {/* Decorative background circles */}

        <div
          className="
            absolute
            -left-40
            top-20
            h-80
            w-80
            rounded-full
            bg-[var(--color-primary)]
            opacity-[0.06]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -right-40
            bottom-0
            h-96
            w-96
            rounded-full
            bg-[var(--color-secondary)]
            opacity-[0.08]
            blur-3xl
          "
        />

        {/* Main hero container */}

        <div
          className="
            relative
            mx-auto
            flex
            min-h-[720px]
            max-w-7xl
            items-center
            px-5
            py-20
            md:px-8
            lg:px-10
          "
        >

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div
            className="
              relative
              z-20
              w-full
              max-w-xl
              pt-6
              lg:w-[52%]
              lg:pt-0
            "
          >

            {/* Small Tag */}

            <div
              className="
                mb-5
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[var(--color-primary)]/20
                bg-white/70
                px-4
                py-2
                text-xs
                font-bold
                tracking-[0.15em]
                text-[var(--color-primary)]
                shadow-sm
                backdrop-blur
              "
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
                <Leaf size={12} />
              </span>

              {currentSlide.tag}
            </div>

            {/* Heading */}

            <div
              key={`heading-${index}`}
              className="animate-fade-up"
            >
              <p
                className="
                  mb-1
                  font-serif
                  text-3xl
                  italic
                  font-semibold
                  text-[var(--color-primary)]
                  md:text-4xl
                "
              >
                {currentSlide.title}
              </p>

              <h1
                className="
                  max-w-2xl
                  text-5xl
                  font-black
                  uppercase
                  leading-[0.95]
                  tracking-tight
                  text-[var(--color-brown)]
                  sm:text-6xl
                  lg:text-7xl
                "
              >
                {currentSlide.highlight}
              </h1>
            </div>

            {/* Description */}

            <p
              key={`subtitle-${index}`}
              className="
                animate-fade-up
                mt-6
                max-w-lg
                text-base
                leading-7
                text-[var(--color-text-secondary)]
                md:text-lg
              "
            >
              {currentSlide.subtitle}
            </p>

            {/* Buttons */}

            <div className="mt-8 flex flex-wrap items-center gap-3">

              <Link
                href={currentSlide.href}
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-xl
                  bg-[var(--color-primary)]
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_10px_25px_rgba(79,125,22,0.25)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[var(--color-primary-dark)]
                "
              >
                {currentSlide.cta}

                <ArrowRight
                  size={18}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

              <Link
                href={currentSlide.secondaryHref}
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[var(--color-primary)]
                  bg-white/70
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  text-[var(--color-primary)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[var(--color-primary)]
                  hover:text-white
                "
              >
                {currentSlide.secondaryCta}
              </Link>
            </div>

            {/* =================================================
                BENEFITS
            ================================================= */}

            <div
              className="
                mt-10
                grid
                grid-cols-3
                gap-3
                border-t
                border-[var(--color-border)]
                pt-7
                sm:max-w-lg
                sm:gap-5
              "
            >

              {/* Fresh */}

              <div className="flex items-center gap-2">
                <span
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-[var(--color-primary)]
                    shadow-sm
                  "
                >
                  <Leaf size={19} />
                </span>

                <div>
                  <p className="text-xs font-bold text-[var(--color-text-primary)]">
                    Fresh
                  </p>

                  <p className="hidden text-[10px] text-[var(--color-text-muted)] sm:block">
                    Ingredients
                  </p>
                </div>
              </div>

              {/* Fast */}

              <div className="flex items-center gap-2">
                <span
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-[var(--color-primary)]
                    shadow-sm
                  "
                >
                  <Truck size={19} />
                </span>

                <div>
                  <p className="text-xs font-bold text-[var(--color-text-primary)]">
                    Fast
                  </p>

                  <p className="hidden text-[10px] text-[var(--color-text-muted)] sm:block">
                    Delivery
                  </p>
                </div>
              </div>

              {/* Loved */}

              <div className="flex items-center gap-2">
                <span
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-[var(--color-secondary)]
                    shadow-sm
                  "
                >
                  <Heart size={19} />
                </span>

                <div>
                  <p className="text-xs font-bold text-[var(--color-text-primary)]">
                    Loved
                  </p>

                  <p className="hidden text-[10px] text-[var(--color-text-muted)] sm:block">
                    By Everyone
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT FOOD IMAGE
          ================================================= */}

          <div
            className="
              absolute
              right-[-80px]
              top-1/2
              hidden
              h-[650px]
              w-[650px]
              -translate-y-1/2
              lg:block
            "
          >

            {/* Green circle */}

            <div
              className="
                absolute
                inset-8
                rounded-full
                bg-[var(--color-primary)]
                opacity-10
              "
            />

            <div
              className="
                absolute
                inset-16
                rounded-full
                border
                border-[var(--color-primary)]/20
              "
            />

            {/* Food Image */}

            <div
              key={`image-${index}`}
              className="
                animate-fade-up
                absolute
                inset-20
                overflow-hidden
                rounded-full
                border-[12px]
                border-white
                shadow-[0_30px_80px_rgba(45,27,15,0.20)]
              "
            >
              <img
                src={currentSlide.img}
                alt={currentSlide.highlight}
                className="h-full w-full object-cover"
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-tr
                  from-black/10
                  via-transparent
                  to-white/10
                "
              />
            </div>

            {/* =================================================
                NATURAL BADGE
            ================================================= */}

            <div
              className="
                absolute
                left-8
                top-24
                flex
                h-28
                w-28
                rotate-[-10deg]
                flex-col
                items-center
                justify-center
                rounded-full
                border-2
                border-[var(--color-primary)]
                bg-[var(--color-cream)]
                text-center
                shadow-lg
              "
            >
              <Leaf
                size={22}
                className="mb-1 text-[var(--color-primary)]"
              />

              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-primary)]">
                Fresh
              </span>

              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-primary)]">
                Ingredients
              </span>
            </div>

            {/* Rating badge */}

            <div
              className="
                absolute
                bottom-24
                right-2
                flex
                items-center
                gap-2
                rounded-2xl
                border
                border-white
                bg-white/95
                px-4
                py-3
                shadow-xl
                backdrop-blur
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[var(--color-secondary)]/15
                  text-[var(--color-secondary)]
                "
              >
                <Star size={18} fill="currentColor" />
              </div>

              <div>
                <p className="text-sm font-black text-[var(--color-text-primary)]">
                  4.9 / 5
                </p>

                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Customer Rating
                </p>
              </div>
            </div>

            {/* Small floating flame */}

            <div
              className="
                absolute
                right-16
                top-20
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-white
                text-[var(--color-secondary)]
                shadow-lg
              "
            >
              <Flame size={21} />
            </div>
          </div>
        </div>

        {/* =====================================================
            SLIDER CONTROLS
        ===================================================== */}

        <button
          type="button"
          aria-label="Previous slide"
          onClick={previousSlide}
          className="
            absolute
            left-3
            top-1/2
            z-30
            hidden
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-[var(--color-border)]
            bg-white/80
            text-[var(--color-text-primary)]
            shadow-md
            backdrop-blur
            transition
            hover:scale-105
            hover:bg-white
            md:flex
            lg:left-6
          "
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          aria-label="Next slide"
          onClick={nextSlide}
          className="
            absolute
            right-3
            top-1/2
            z-30
            hidden
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-[var(--color-border)]
            bg-white/80
            text-[var(--color-text-primary)]
            shadow-md
            backdrop-blur
            transition
            hover:scale-105
            hover:bg-white
            md:flex
            lg:right-6
          "
        >
          <ChevronRight size={20} />
        </button>

        {/* =====================================================
            SLIDE DOTS
        ===================================================== */}

        <div
          className="
            absolute
            bottom-8
            left-1/2
            z-30
            flex
            -translate-x-1/2
            items-center
            gap-2
          "
        >
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`
                h-2
                rounded-full
                transition-all
                duration-300
                ${i === index
                  ? "w-8 bg-[var(--color-primary)]"
                  : "w-2 bg-[var(--color-primary)]/25"
                }
              `}
            />
          ))}
        </div>
      </section>


      <section className="relative z-20 px-4 md:px-8">

        <div
          className="
            mx-auto
            -mt-1
            max-w-6xl
            overflow-hidden
            rounded-2xl
            bg-[var(--color-primary)]
            shadow-[0_15px_40px_rgba(79,125,22,0.22)]
          "
        >

        </div>
      </section>


      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">

        <div className="grid gap-4 sm:grid-cols-3">

          <div
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-[var(--color-border)]
              bg-white
              p-5
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
              "
            >
              <Leaf size={22} />
            </div>

            <div>
              <h3 className="font-bold text-[var(--color-text-primary)]">
                Fresh Ingredients
              </h3>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Quality ingredients in every meal
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-[var(--color-border)]
              bg-white
              p-5
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[var(--color-secondary)]/10
                text-[var(--color-secondary)]
              "
            >
              <Truck size={22} />
            </div>

            <div>
              <h3 className="font-bold text-[var(--color-text-primary)]">
                Fast Delivery
              </h3>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Hot food delivered to your door
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-[var(--color-border)]
              bg-white
              p-5
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
              "
            >
              <Utensils size={22} />
            </div>

            <div>
              <h3 className="font-bold text-[var(--color-text-primary)]">
                Made With Love
              </h3>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Delicious food, every single time
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}