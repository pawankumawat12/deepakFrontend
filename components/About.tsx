"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Heart,
  MapPin,
  Sparkles,
  Utensils,
  Flame,
} from "lucide-react";

const highlights = [
  {
    icon: Utensils,
    title: "Fresh & Tasty",
    text: "Freshly prepared food packed with delicious flavor.",
  },
  {
    icon: Flame,
    title: "Made for Cravings",
    text: "From quick bites to satisfying meals, we've got you.",
  },
  {
    icon: Clock3,
    title: "Quick Service",
    text: "Good food without making you wait too long.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-body)]">

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden ">

        {/* Background decoration */}

        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--color-primary)]/15" />

        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[var(--color-cheese)]/10" />

        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">

          <div className="grid items-center gap-10 md:grid-cols-2">

            {/* Text */}

            <div>

              <div className="mb-4 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-light)]">
                  About SFC Cafe
                </span>

              </div>

              <h1 className="max-w-lg text-4xl font-black leading-tight tracking-tight  sm:text-5xl">

                Good food.
                <br />

                <span className="text-[var(--color-primary-light)]">
                  Good vibes.
                </span>

              </h1>

              <p className="mt-5 max-w-md text-sm leading-7">
                We make delicious food for everyday cravings,
                quick catch-ups and good times with the people
                you enjoy.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <Link
                  href="/menu"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-[var(--color-primary)]
                    px-5
                    py-3
                    text-xs
                    font-bold
                    text-white
                    shadow-lg
                    transition
                    hover:bg-[var(--color-primary-dark)]
                    hover:-translate-y-0.5
                    active:scale-95
                  "
                >
                  Explore Menu
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href="/contact"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    border
                    border-white/15
                    bg-white/5
                    px-5
                    py-3
                    text-xs
                    font-bold
                    text-white
                    transition
                    hover:bg-white/10
                    active:scale-95
                  "
                >
                  <MapPin size={14} />
                  Find Us
                </Link>

              </div>

            </div>

            {/* Hero Image */}

            <div className="relative">

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl">

                <img
                  src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=85"
                  alt="Food at SFC Cafe"
                  className="
                    h-[280px]
                    w-full
                    rounded-[1.5rem]
                    object-cover
                    sm:h-[350px]
                  "
                />

              </div>

              {/* Floating badge */}

              <div
                className="
                  absolute
                  -bottom-4
                  left-5
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-white
                  px-4
                  py-3
                  shadow-xl
                "
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <Utensils size={18} />
                </div>

                <div>

                  <p className="text-xs font-black text-[var(--color-text-primary)]">
                    Made for cravings
                  </p>

                  <p className="text-[9px] text-[var(--color-text-muted)]">
                    Fresh • Tasty • Delicious
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= STORY ================= */}

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">

        <div className="grid items-center gap-10 md:grid-cols-2">

          {/* Image */}

          <div className="relative order-2 md:order-1">

            <div className="overflow-hidden rounded-[2rem]">

              <img
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=85"
                alt="SFC Cafe interior"
                className="
                  h-[300px]
                  w-full
                  object-cover
                  transition
                  duration-500
                  hover:scale-105
                  sm:h-[380px]
                "
              />

            </div>

            {/* Small floating badge */}

            <div
              className="
                absolute
                -bottom-4
                right-5
                rounded-2xl
                bg-[var(--color-primary)]
                px-5
                py-3
                text-white
                shadow-lg
              "
            >

              <div className="flex items-center justify-center mb-1">
                <Heart size={20} className="fill-current text-white" />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-wider">
                Made with love
              </p>

            </div>

          </div>

          {/* Content */}

          <div className="order-1 md:order-2">

            <div className="flex items-center gap-2">

              <Sparkles
                size={15}
                className="text-[var(--color-primary)]"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                Our Story
              </span>

            </div>

            <h2 className="mt-3 text-3xl font-black leading-tight text-[var(--color-text-primary)] sm:text-4xl">

              A cafe made for
              <br />

              <span className="text-[var(--color-primary)]">
                good moments.
              </span>

            </h2>

            <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--color-text-secondary)]">

              <p>
                At SFC Cafe, we believe good food should be
                simple, fresh and full of flavor.
              </p>

              <p>
                Whether you're grabbing a quick bite, meeting
                friends or simply treating yourself, we want
                every visit to feel special.
              </p>

            </div>

            <div className="mt-6 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                <Heart size={17} fill="currentColor" />
              </div>

              <div>

                <p className="text-xs font-bold text-[var(--color-text-primary)]">
                  Simple food. Big happiness.
                </p>

                <p className="text-[10px] text-[var(--color-text-muted)]">
                  That's what SFC Cafe is about.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= HIGHLIGHTS ================= */}

      <section className="bg-[var(--color-beige)]/45">

        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-16">

          <div className="mb-8 text-center">

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Why SFC
            </span>

            <h2 className="mt-2 text-2xl font-black text-[var(--color-text-primary)] sm:text-3xl">
              Why you'll love it here
            </h2>

          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {highlights.map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    group
                    rounded-3xl
                    border
                    border-[var(--color-border)]
                    bg-white
                    p-6
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[var(--color-primary-50)]
                      text-[var(--color-primary)]
                      transition
                      group-hover:bg-[var(--color-primary)]
                      group-hover:text-white
                    "
                  >
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 text-sm font-black text-[var(--color-text-primary)]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[var(--color-text-secondary)]">
                    {item.text}
                  </p>

                </div>
              );

            })}

          </div>

        </div>

      </section>

      {/* ================= FOOD MOMENT ================= */}

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">

        <div className="relative overflow-hidden rounded-[2rem] bg-[var(--color-chocolate)]">

          <div className="grid md:grid-cols-2">

            {/* Image */}

            <div className="relative min-h-[280px] overflow-hidden">

              <img
                src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1000&q=85"
                alt="Delicious burger"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  transition
                  duration-700
                  hover:scale-105
                "
              />

              <div className="absolute inset-0 bg-black/10" />

            </div>

            {/* Content */}

            <div className="flex items-center p-7 sm:p-10">

              <div>

                <div className="flex items-center gap-2">

                  <span className="text-[var(--color-cheese)] flex items-center">
                    <Sparkles size={18} />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-cheese)]">
                    The SFC Experience
                  </span>

                </div>

                <h2 className="mt-4 text-3xl font-black leading-tight ">
                  Come hungry.
                  <br />
                   <span className="text-[var(--color-primary-light)]">
                  Leave happy.
                </span>
                </h2>

                <p className="mt-4 text-sm leading-6 ">
                  Great food, good company and a place where
                  you can simply relax and enjoy your moment.
                </p>

                <Link
                  href="/menu"
                  className="
                    mt-6
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-[var(--color-primary)]
                    px-5
                    py-3
                    text-xs
                    font-bold
                    text-white
                    transition
                    hover:bg-[var(--color-primary-dark)]
                    active:scale-95
                  "
                >
                  See What's Cooking
                  <ArrowRight size={15} />
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= SIMPLE CTA ================= */}

      <section className="px-5 pb-14 sm:px-8 md:pb-20">

        <div
          className="
            mx-auto
            max-w-6xl
            rounded-[2rem]
            bg-[var(--color-primary)]
            px-6
            py-10
            text-center
            shadow-xl
            sm:px-10
          "
        >

          <div className="mx-auto max-w-xl">

            <div className="flex justify-center items-center gap-2 text-white/90">
              <Utensils size={28} />
            </div>

            <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
              Hungry yet?
            </h2>

            <p className="mt-2 text-sm text-white/70">
              Your next favorite meal might be just one click away.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">

              <Link
                href="/menu"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-white
                  px-6
                  py-3
                  text-xs
                  font-black
                  text-[var(--color-primary-dark)]
                  shadow-md
                  transition
                  hover:-translate-y-0.5
                  active:scale-95
                "
              >
                Order Now
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/contact"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-white/25
                  bg-white/10
                  px-6
                  py-3
                  text-xs
                  font-black
                  text-white
                  transition
                  hover:bg-white/20
                  active:scale-95
                "
              >
                <MapPin size={14} />
                Visit Cafe
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}