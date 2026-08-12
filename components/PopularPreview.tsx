"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import data from "./data/products";

const { categories } = data;

export default function PopularPreview() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [autoplay, setAutoplay] = useState(true);

  const router = useRouter();

  /* -----------------------------------------
     AUTO SCROLL
  ----------------------------------------- */

  useEffect(() => {
    if (!autoplay) return;

    const id = setInterval(() => {
      const el = scrollerRef.current;

      if (!el) return;

      const maxScroll =
        el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        el.scrollBy({
          left: el.clientWidth * 0.6,
          behavior: "smooth",
        });
      }
    }, 3500);

    return () => clearInterval(id);
  }, [autoplay]);

  /* -----------------------------------------
     CATEGORY CLICK
  ----------------------------------------- */

  function goToCategory(id: string) {
    router.push(
      `/menu?category=${encodeURIComponent(id)}`
    );
  }

  /* -----------------------------------------
     MANUAL SCROLL
  ----------------------------------------- */

  function scrollByAmount(direction: number) {
    const el = scrollerRef.current;

    if (!el) return;

    el.scrollBy({
      left: direction * el.clientWidth * 0.65,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative bg-[var(--bg-body)] px-4 py-10 md:px-8 md:py-14">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="mb-7 flex items-end justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--color-primary)]
                "
              >
                Explore Our Menu
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
              Shop by Category
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                text-[var(--color-text-secondary)]
                md:text-base
              "
            >
              Pick your favorite food category and discover
              something delicious.
            </p>
          </div>

          {/* View All */}

          <Link
            href="/menu"
            className="
              hidden
              items-center
              gap-2
              rounded-xl
              bg-[var(--color-primary)]
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              transition
              hover:bg-[var(--color-primary-dark)]
              sm:inline-flex
            "
          >
            View Full Menu

            <ArrowRight size={16} />
          </Link>
        </div>

        {/* =================================================
            CATEGORY SCROLLER
        ================================================= */}

        <div className="relative">

          {/* Left Arrow */}

          <button
            type="button"
            aria-label="Previous categories"
            onClick={() => scrollByAmount(-1)}
            className="
              absolute
              left-0
              top-1/2
              z-20
              hidden
              h-10
              w-10
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-[var(--color-border)]
              bg-white
              text-[var(--color-text-primary)]
              shadow-lg
              transition
              hover:scale-105
              hover:text-[var(--color-primary)]
              md:flex
            "
          >
            <ChevronLeft size={20} />
          </button>

          {/* =================================================
              SCROLLER
          ================================================= */}

          <div
            ref={scrollerRef}
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
            className="
              flex
              gap-4
              overflow-x-auto
              scroll-smooth
              snap-x
              snap-mandatory
              px-1
              pb-4
              touch-pan-x
              scrollbar-x
            "
          >

            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  goToCategory(category.id)
                }
                className="
                  group
                  relative
                  min-w-[180px]
                  snap-start
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  text-left
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[var(--color-primary)]
                  hover:shadow-[0_15px_35px_rgba(79,125,22,0.15)]
                  sm:min-w-[210px]
                  md:min-w-[225px]
                "
              >

                {/* Image */}

                <div className="relative h-36 overflow-hidden md:h-40">

                  <img
                    src={category.img}
                    alt={category.name}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                  />

                  {/* Image overlay */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/50
                      via-transparent
                      to-transparent
                    "
                  />

                  {/* Category badge */}

                  <span
                    className="
                      absolute
                      bottom-3
                      left-3
                      rounded-full
                      bg-white/95
                      px-3
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[var(--color-primary)]
                      shadow-sm
                    "
                  >
                    Explore
                  </span>
                </div>

                {/* Content */}

                <div className="flex items-center justify-between px-4 py-3.5">

                  <div>
                    <h3
                      className="
                        text-sm
                        font-bold
                        text-[var(--color-text-primary)]
                        md:text-base
                      "
                    >
                      {category.name}
                    </h3>

                    <p
                      className="
                        mt-0.5
                        text-[11px]
                        text-[var(--color-text-muted)]
                      "
                    >
                      View items
                    </p>
                  </div>

                  {/* Arrow */}

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-[var(--color-primary-50)]
                      text-[var(--color-primary)]
                      transition
                      duration-300
                      group-hover:bg-[var(--color-primary)]
                      group-hover:text-white
                    "
                  >
                    <ArrowRight size={15} />
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Right Arrow */}

          <button
            type="button"
            aria-label="Next categories"
            onClick={() => scrollByAmount(1)}
            className="
              absolute
              right-0
              top-1/2
              z-20
              hidden
              h-10
              w-10
              translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-[var(--color-border)]
              bg-white
              text-[var(--color-text-primary)]
              shadow-lg
              transition
              hover:scale-105
              hover:text-[var(--color-primary)]
              md:flex
            "
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* =================================================
            MOBILE VIEW ALL
        ================================================= */}

        <div className="mt-5 flex justify-center sm:hidden">

          <Link
            href="/menu"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[var(--color-primary)]
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              shadow-md
              transition
              hover:bg-[var(--color-primary-dark)]
            "
          >
            View Full Menu

            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}