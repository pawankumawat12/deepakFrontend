"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  BadgeCheck,
} from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "Jaipur",
    avatar: "RS",
    rating: 5,
    review:
      "Absolutely loved the burger! Everything tasted fresh and the fries were perfectly crispy. Will definitely order again.",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Priya Mehta",
    location: "Jaipur",
    avatar: "PM",
    rating: 5,
    review:
      "The food was amazing and delivery was really quick. The packaging was also neat and everything arrived hot.",
    date: "5 days ago",
  },
  {
    id: 3,
    name: "Amit Verma",
    location: "Jaipur",
    avatar: "AV",
    rating: 4,
    review:
      "Great taste and good portion size. The pizza was delicious and the overall experience was really good.",
    date: "1 week ago",
  },
  {
    id: 4,
    name: "Neha Gupta",
    location: "Jaipur",
    avatar: "NG",
    rating: 5,
    review:
      "One of my favorite places for quick food. Fresh ingredients, tasty food and friendly service.",
    date: "1 week ago",
  },
];

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  /*
   * --------------------------------------------------
   * AUTO SLIDER
   * --------------------------------------------------
   */

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((current) =>
        current === reviews.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(id);
  }, []);

  /*
   * --------------------------------------------------
   * CONTROLS
   * --------------------------------------------------
   */

  const previousReview = () => {
    setActiveIndex((current) =>
      current === 0 ? reviews.length - 1 : current - 1
    );
  };

  const nextReview = () => {
    setActiveIndex((current) =>
      current === reviews.length - 1 ? 0 : current + 1
    );
  };

  /*
   * --------------------------------------------------
   * STAR COMPONENT
   * --------------------------------------------------
   */

  const Stars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={15}
            fill={
              index < rating
                ? "currentColor"
                : "transparent"
            }
            className={
              index < rating
                ? "text-[var(--color-secondary)]"
                : "text-[var(--color-border)]"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden bg-[var(--bg-body)] px-4 py-14 md:px-8 md:py-10">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[-120px]
          top-20
          h-72
          w-72
          rounded-full
          bg-[var(--color-primary)]
          opacity-[0.04]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-120px]
          bottom-10
          h-80
          w-80
          rounded-full
          bg-[var(--color-secondary)]
          opacity-[0.05]
          blur-3xl
        "
      />

      <div className="relative mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto max-w-2xl text-center">

          {/* Label */}

          <div className="mb-3 flex items-center justify-center gap-2">

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-[var(--color-secondary)]
              "
            />

            <span
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-[var(--color-secondary)]
              "
            >
              Customer Love
            </span>

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-[var(--color-secondary)]
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
            What Our Customers Say
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
            Good food makes people happy. Here is what our
            customers have to say about their experience.
          </p>
        </div>

        {/* =====================================================
            RATING SUMMARY
        ===================================================== */}

        <div
          className="
            mx-auto
            mt-8
            flex
            w-fit
            flex-col
            items-center
            justify-center
            gap-3
            rounded-2xl
            border
            border-[var(--color-border)]
            bg-white
            px-7
            py-4
            shadow-sm
            sm:flex-row
            sm:gap-5
          "
        >

          {/* Rating number */}

          <div className="text-center sm:text-left">
            <p
              className="
                text-3xl
                font-black
                leading-none
                text-[var(--color-text-primary)]
              "
            >
              4.9
            </p>

            <p
              className="
                mt-1
                text-[10px]
                font-medium
                text-[var(--color-text-muted)]
              "
            >
              out of 5
            </p>
          </div>

          {/* Stars */}

          <div>
            <Stars rating={5} />

            <p
              className="
                mt-1.5
                text-xs
                text-[var(--color-text-muted)]
              "
            >
              Based on 500+ reviews
            </p>
          </div>

        </div>

        {/* =====================================================
            REVIEWS
        ===================================================== */}

        <div className="relative mt-10">

          {/* Desktop Previous */}

          <button
            type="button"
            aria-label="Previous review"
            onClick={previousReview}
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
            <ChevronLeft size={19} />
          </button>

          {/* =================================================
              DESKTOP REVIEWS
          ================================================= */}

          <div className="hidden gap-5 md:grid md:grid-cols-3">

            {reviews.slice(0, 3).map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                Stars={Stars}
              />
            ))}
          </div>

          {/* =================================================
              MOBILE REVIEW
          ================================================= */}

          <div className="md:hidden">

            <div
              className="
                overflow-hidden
                rounded-2xl
              "
            >
              <div
                className="flex transition-transform duration-500"
                style={{
                  transform: `translateX(-${activeIndex * 100}%)`,
                }}
              >
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="w-full shrink-0 px-1"
                  >
                    <ReviewCard
                      review={review}
                      Stars={Stars}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile dots */}

            <div className="mt-5 flex justify-center gap-2">
              {reviews.map((review, index) => (
                <button
                  key={review.id}
                  type="button"
                  aria-label={`Go to review ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`
                    h-2
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      activeIndex === index
                        ? "w-7 bg-[var(--color-primary)]"
                        : "w-2 bg-[var(--color-primary)]/25"
                    }
                  `}
                />
              ))}
            </div>
          </div>

          {/* Desktop Next */}

          <button
            type="button"
            aria-label="Next review"
            onClick={nextReview}
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
            <ChevronRight size={19} />
          </button>
        </div>

        {/* =====================================================
            BOTTOM TRUST MESSAGE
        ===================================================== */}

        <div className="mt-10 flex justify-center">

          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              bg-[var(--color-primary-50)]
              px-5
              py-2.5
              text-xs
              font-semibold
              text-[var(--color-primary)]
            "
          >
            <BadgeCheck size={16} />

            Loved by food lovers
          </div>

        </div>
      </div>
    </section>
  );
}

/* ============================================================
   REVIEW CARD
============================================================ */

function ReviewCard({
  review,
  Stars,
}: {
  review: {
    id: number;
    name: string;
    location: string;
    avatar: string;
    rating: number;
    review: string;
    date: string;
  };
  Stars: React.ComponentType<{ rating: number }>;
}) {
  return (
    <article
      className="
        group
        relative
        flex
        min-h-[280px]
        flex-col
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[var(--color-primary)]/30
        hover:shadow-[0_18px_40px_rgba(79,125,22,0.10)]
      "
    >

      {/* Quote */}

      <div
        className="
          absolute
          right-5
          top-5
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-[var(--color-primary-50)]
          text-[var(--color-primary)]
        "
      >
        <Quote size={17} fill="currentColor" />
      </div>

      {/* Stars */}

      <Stars rating={review.rating} />

      {/* Review */}

      <p
        className="
          mt-5
          flex-1
          text-sm
          leading-7
          text-[var(--color-text-secondary)]
        "
      >
        "{review.review}"
      </p>

      {/* Divider */}

      <div className="my-5 h-px bg-[var(--color-border)]" />

      {/* Customer */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          {/* Avatar */}

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[var(--color-primary)]
              text-xs
              font-black
              text-white
            "
          >
            {review.avatar}
          </div>

          <div>
            <div className="flex items-center gap-1.5">

              <h4
                className="
                  text-sm
                  font-bold
                  text-[var(--color-text-primary)]
                "
              >
                {review.name}
              </h4>

              <BadgeCheck
                size={14}
                className="text-[var(--color-primary)]"
              />
            </div>

            <p
              className="
                mt-0.5
                text-[10px]
                text-[var(--color-text-muted)]
              "
            >
              {review.location}
            </p>
          </div>
        </div>

        {/* Date */}

        <span
          className="
            text-[10px]
            text-[var(--color-text-muted)]
          "
        >
          {review.date}
        </span>

      </div>
    </article>
  );
}