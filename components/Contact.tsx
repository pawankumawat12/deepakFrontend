"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
  MessageCircle,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  }

  return (
    <main className="min-h-screen bg-[var(--bg-body)]">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Location */}

          <div
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
              <MapPin size={21} />
            </div>

            <h3 className="mt-5 text-sm font-black text-[var(--color-text-primary)]">
              Visit Us
            </h3>

            <p className="mt-2 text-xs leading-6 text-[var(--color-text-secondary)]">
              123 Main Street,
              <br />
              Jaipur, Rajasthan
            </p>

          </div>

          {/* Phone */}

          <div
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
              <Phone size={21} />
            </div>

            <h3 className="mt-5 text-sm font-black text-[var(--color-text-primary)]">
              Call Us
            </h3>

            <a
              href="tel:+919999999999"
              className="mt-2 block text-xs leading-6 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            >
              +91 99999 99999
            </a>

          </div>

          {/* Email */}

          <div
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
              <Mail size={21} />
            </div>

            <h3 className="mt-5 text-sm font-black text-[var(--color-text-primary)]">
              Email Us
            </h3>

            <a
              href="mailto:hello@sfccafe.com"
              className="mt-2 block break-all text-xs leading-6 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            >
              hello@sfccafe.com
            </a>

          </div>

          {/* Hours */}

          <div
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
              <Clock3 size={21} />
            </div>

            <h3 className="mt-5 text-sm font-black text-[var(--color-text-primary)]">
              Opening Hours
            </h3>

            <p className="mt-2 text-xs leading-6 text-[var(--color-text-secondary)]">
              Mon - Sun
              <br />
              10:00 AM - 11:00 PM
            </p>

          </div>

        </div>

      </section>

      {/* =========================================================
          CONTACT FORM + LOCATION
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 md:pb-20">

        <div className="grid overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm lg:grid-cols-2">

          {/* LEFT - FORM */}

          <div className="p-6 sm:p-8 md:p-10">

            <div className="mb-7">

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                Send a Message
              </span>

              <h2 className="mt-2 text-2xl font-black text-[var(--color-text-primary)] sm:text-3xl">
                How can we help?
              </h2>

              <p className="mt-2 text-xs leading-6 text-[var(--color-text-secondary)]">
                Drop us a message and we'll get back to you as soon
                as possible.
              </p>

            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-1.5 block text-xs font-bold text-[var(--color-text-primary)]"
                >
                  Your Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[var(--color-border)]
                    bg-[var(--bg-body)]
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    placeholder:text-[var(--color-text-muted)]
                    focus:border-[var(--color-primary)]
                    focus:ring-2
                    focus:ring-[var(--color-primary)]/10
                  "
                />

              </div>

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-bold text-[var(--color-text-primary)]"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[var(--color-border)]
                    bg-[var(--bg-body)]
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    placeholder:text-[var(--color-text-muted)]
                    focus:border-[var(--color-primary)]
                    focus:ring-2
                    focus:ring-[var(--color-primary)]/10
                  "
                />

              </div>

              {/* Phone */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-xs font-bold text-[var(--color-text-primary)]"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 99999 99999"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[var(--color-border)]
                    bg-[var(--bg-body)]
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    placeholder:text-[var(--color-text-muted)]
                    focus:border-[var(--color-primary)]
                    focus:ring-2
                    focus:ring-[var(--color-primary)]/10
                  "
                />

              </div>

              {/* Message */}

              <div>

                <label
                  htmlFor="message"
                  className="mb-1.5 block text-xs font-bold text-[var(--color-text-primary)]"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell us what's on your mind..."
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-[var(--color-border)]
                    bg-[var(--bg-body)]
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    placeholder:text-[var(--color-text-muted)]
                    focus:border-[var(--color-primary)]
                    focus:ring-2
                    focus:ring-[var(--color-primary)]/10
                  "
                />

              </div>

              {/* Submit */}

              <button
                type="submit"
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--color-primary)]
                  px-5
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-md
                  transition
                  hover:bg-[var(--color-primary-dark)]
                  hover:-translate-y-0.5
                  active:scale-[0.99]
                "
              >

                {submitted ? (
                  <>
                    Message Sent ✓
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={16} />
                  </>
                )}

              </button>

            </form>

          </div>
          <div className="relative min-h-[520px]">
            <div
              className="
                absolute
                inset-0
                opacity-20
                [background-image:linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)]
                [background-size:50px_50px]
              "
            />

            {/* Location content */}

            <div className="relative flex h-full flex-col justify-between p-7 sm:p-10">

              <div>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-light)]">
                  Find Us
                </span>

                <h2 className="mt-3 text-3xl font-black ">
                  Come say
                  <br />
                  <span className="text-[var(--color-primary-light)]">
                    hello 👋
                  </span>
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-6 ">
                  We're always happy to welcome you. Drop by for
                  some delicious food and good vibes.
                </p>

              </div>

              {/* Map pin */}

              <div className="flex flex-1 items-center justify-center">

                <div className="relative">

                  <div
                    className="
                      absolute
                      -inset-8
                      animate-pulse
                      rounded-full
                      bg-[var(--color-primary)]/10
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-full
                      bg-[var(--color-primary)]
                      text-white
                      shadow-[0_15px_40px_rgba(0,0,0,0.3)]
                    "
                  >
                    <MapPin size={34} />
                  </div>

                </div>

              </div>

              {/* Address card */}

              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                  backdrop-blur-md
                "
              >

                <div className="flex gap-4">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[var(--color-primary)]
                      text-white
                    "
                  >
                    <MapPin size={18} />
                  </div>

                  <div>

                    <p className="text-xs font-bold text-white">
                      SFC Cafe
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/50">
                      123 Main Street,
                      <br />
                      Jaipur, Rajasthan, India
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          SOCIAL / QUICK CONTACT
      ========================================================= */}

      <section className="px-5 pb-16 sm:px-8">

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Follow & Connect
          </p>

          <h2 className="mt-2 text-2xl font-black text-[var(--color-text-primary)]">
            Stay connected with SFC
          </h2>

          <div className="mt-6 flex justify-center gap-3">

            <a
              href="#"
              aria-label="Instagram"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
                transition
                hover:bg-[var(--color-primary)]
                hover:text-white
              "
            >
                <i className="ri-instagram-line text-lg" />
            </a>

            <a
              href="#"
              aria-label="WhatsApp"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
                transition
                hover:bg-[var(--color-primary)]
                hover:text-white
              "
            >
              <MessageCircle size={19} />
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}