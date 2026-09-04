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
  Pizza,
  Coffee,
  Cake,
  Sandwich,
  Sparkles,
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


export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  const currentSlide = slides[index];

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


      <section className="relative min-h-[400px] md:min-h-[600px] lg:min-h-[650px] overflow-hidden bg-stone-900 flex items-center">

        {/* Full Background Slider Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            key={currentSlide.img}
            src={currentSlide.img}
            alt={currentSlide.highlight}
            className="h-full w-full object-cover object-center transition-all duration-1000 scale-105"
          />

          {/* Contrast & Depth Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/35 sm:to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/60" />
        </div>

        {/* Main hero container */}
        <div
          className="
            relative
            z-20
            mx-auto
            flex
            w-full
            max-w-7xl
            flex-col
            justify-between
            gap-8
            px-5
            py-20
            md:px-8
            lg:flex-row
            lg:items-center
            lg:px-10
          "
        >
          <div className="relative z-20 w-full max-w-xl pt-4 lg:w-[58%] lg:pt-0">
            <div
              className="
                mb-5
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/20
                bg-white/15
                px-4
                py-2
                text-xs
                font-bold
                tracking-[0.15em]
                text-white
                shadow-lg
                backdrop-blur-md
              "
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
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
                  mb-1.5
                  font-serif
                  text-2xl
                  italic
                  font-semibold
                  text-[var(--color-secondary)]
                  sm:text-3xl
                  md:text-4xl
                "
              >
                {currentSlide.title}
              </p>

              <h1
                className="
                  max-w-2xl
                  text-4xl
                  font-black
                  uppercase
                  leading-[0.98]
                  tracking-tight
                  text-white
                  drop-shadow-lg
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
                text-white/85
                drop-shadow
                sm:text-lg
              "
            >
              {currentSlide.subtitle}
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href={currentSlide.href}
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-xl
                  bg-[var(--color-primary)]
                  px-7
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_10px_25px_rgba(79,125,22,0.4)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[var(--color-primary-dark)]
                "
                style={{color:"white"}}
              >
                {currentSlide.cta}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  style={{color:"white"}}
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
                  border-white/40
                  bg-white/15
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white
                  hover:text-[var(--color-primary)]
                "
                style={{color: "white"}}
              >
                {currentSlide.secondaryCta}
              </Link>
            </div>

            <div
              className="
                mt-10
                grid
                grid-cols-3
                gap-3
                border-t
                border-white/20
                pt-7
                sm:max-w-lg
                sm:gap-5
              "
            >
              {/* Fresh */}
              <div className="flex items-center gap-2.5">
                <span
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/15
                    text-white
                    shadow-sm
                    backdrop-blur-md
                  "
                >
                  <Leaf size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold text-white">Fresh</p>
                  <p className="hidden text-[10px] text-white/70 sm:block">Ingredients</p>
                </div>
              </div>

              {/* Fast */}
              <div className="flex items-center gap-2.5">
                <span
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/15
                    text-white
                    shadow-sm
                    backdrop-blur-md
                  "
                >
                  <Truck size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold text-white">Fast</p>
                  <p className="hidden text-[10px] text-white/70 sm:block">Delivery</p>
                </div>
              </div>

              {/* Loved */}
              <div className="flex items-center gap-2.5">
                <span
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/15
                    text-[var(--color-secondary)]
                    shadow-sm
                    backdrop-blur-md
                  "
                >
                  <Heart size={18} fill="currentColor" />
                </span>
                <div>
                  <p className="text-xs font-bold text-white">Loved</p>
                  <p className="hidden text-[10px] text-white/70 sm:block">By Everyone</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:flex flex-col items-end gap-4 z-20 mr-2">
            {/* Rating badge */}
            <div
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-white/20
                bg-black/35
                px-5
                py-4
                shadow-2xl
                backdrop-blur-md
                transition-transform
                duration-300
                hover:scale-105
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
                  bg-[var(--color-secondary)]/20
                  text-[var(--color-secondary)]
                "
              >
                <Star size={20} fill="currentColor" />
              </div>
              <div>
                <p className="text-sm font-black text-white">
                  4.9 / 5.0
                </p>
                <p className="text-[10px] text-white/70">
                  Customer Rating
                </p>
              </div>
            </div>

            {/* Fresh natural badge */}
            <div
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-white/20
                bg-black/35
                p-4
                shadow-2xl
                backdrop-blur-md
                transition-transform
                duration-300
                hover:scale-105
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-primary)]
                  text-white
                  shadow-md
                "
              >
                <Leaf size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-white">
                  100% Fresh
                </p>
                <p className="text-[10px] text-white/70">
                  Handcrafted With Care
                </p>
              </div>
            </div>

            {/* Trending badge */}
            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/20
                bg-[var(--color-secondary)]/90
                px-4
                py-2
                text-xs
                font-black
                uppercase
                tracking-wider
                text-white
                shadow-xl
                backdrop-blur-md
              "
            >
              <Flame size={15} fill="currentColor" />
              Popular Picks
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
            h-11
            w-11
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/25
            bg-black/40
            text-white
            shadow-lg
            backdrop-blur-md
            transition-all
            duration-200
            hover:scale-110
            hover:bg-white
            hover:text-black
            md:flex
            lg:left-6
          "
        >
          <ChevronLeft size={22} />
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
            h-11
            w-11
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/25
            bg-black/40
            text-white
            shadow-lg
            backdrop-blur-md
            transition-all
            duration-200
            hover:scale-110
            hover:bg-white
            hover:text-black
            md:flex
            lg:right-6
          "
        >
          <ChevronRight size={22} />
        </button>

        {/* =====================================================
            SLIDE DOTS
        ===================================================== */}
        <div
          className="
            absolute
            bottom-6
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
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
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