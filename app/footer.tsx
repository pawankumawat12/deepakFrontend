"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  ArrowRight,
  Heart,
} from "lucide-react";

const quickLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Menu",
    href: "/menu",
  },
  {
    label: "Offers",
    href: "/offers",
  },
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const helpLinks = [
  {
    label: "My Orders",
    href: "/orders",
  },
  {
    label: "Cart",
    href: "/cart",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms",
  },
  {
    label: "Refund Policy",
    href: "/refund-policy",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-footer)] text-white">

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">

          {/* =================================================
              BRAND
          ================================================= */}

          <div>

            {/* Logo */}

            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-primary)]
                  text-lg
                  font-black
                  text-white
                  shadow-lg
                "
              >
                S
              </div>

              <div>
                <span className="block text-xl font-black tracking-tight">
                  SFC Cafe
                </span>

                <span className="block text-[9px] font-medium uppercase tracking-[0.2em] text-white/50">
                  Fresh • Fast • Delicious
                </span>
              </div>
            </Link>

            {/* Description */}

            <p
              className="
                mt-5
                max-w-sm
                text-sm
                leading-6
                text-white/60
              "
            >
              Freshly prepared food, delicious flavors and
              quick service. Your favorite food is just a few
              clicks away.
            </p>

            {/* Social */}

            <div className="mt-6 flex items-center gap-2">

              <a
                href="#"
                aria-label="Facebook"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/5
                  text-white/70
                  transition
                  hover:bg-[var(--color-primary)]
                  hover:text-white
                "
              >
                <span className="text-sm font-bold">f</span>
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/5
                  text-white/70
                  transition
                  hover:bg-[var(--color-primary)]
                  hover:text-white
                "
              >
            <span className="text-sm font-bold">ig</span>
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/5
                  text-white/70
                  transition
                  hover:bg-[var(--color-primary)]
                  hover:text-white
                "
              >
<span className="text-sm font-bold">𝕏</span>              </a>

            </div>
          </div>

          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <div>

            <h3
              className="
                text-sm
                font-black
                uppercase
                tracking-wider
                text-white
              "
            >
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">

              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      text-sm
                      text-white/55
                      transition
                      hover:gap-2.5
                      hover:text-[var(--color-primary-light)]
                    "
                  >
                    <ArrowRight size={12} />

                    {link.label}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* =================================================
              CUSTOMER HELP
          ================================================= */}

          <div>

            <h3
              className="
                text-sm
                font-black
                uppercase
                tracking-wider
                text-white
              "
            >
              Customer Help
            </h3>

            <ul className="mt-5 space-y-3">

              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      text-sm
                      text-white/55
                      transition
                      hover:gap-2.5
                      hover:text-[var(--color-primary-light)]
                    "
                  >
                    <ArrowRight size={12} />

                    {link.label}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* =================================================
              CONTACT
          ================================================= */}

          <div>

            <h3
              className="
                text-sm
                font-black
                uppercase
                tracking-wider
                text-white
              "
            >
              Visit Us
            </h3>

            <div className="mt-5 space-y-4">

              {/* Address */}

              <div className="flex gap-3">

                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[var(--color-primary-light)]"
                />

                <p className="text-sm leading-6 text-white/55">
                  123 Main Street,
                  <br />
                  Jaipur, Rajasthan 302017
                </p>

              </div>

              {/* Phone */}

              <a
                href="tel:+919876543210"
                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-white/55
                  transition
                  hover:text-white
                "
              >
                <Phone
                  size={17}
                  className="text-[var(--color-primary-light)]"
                />

                +91 98765 43210
              </a>

              {/* Email */}

              <a
                href="mailto:hello@sfccafe.com"
                className="
                  flex
                  items-center
                  gap-3
                  break-all
                  text-sm
                  text-white/55
                  transition
                  hover:text-white
                "
              >
                <Mail
                  size={17}
                  className="shrink-0 text-[var(--color-primary-light)]"
                />

                hello@sfccafe.com
              </a>

              {/* Timing */}

              <div className="flex gap-3">

                <Clock3
                  size={17}
                  className="mt-0.5 shrink-0 text-[var(--color-primary-light)]"
                />

                <div className="text-sm text-white/55">
                  <p>Mon - Fri: 10 AM - 11 PM</p>
                  <p>Sat - Sun: 9 AM - 11:30 PM</p>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE ORDER CTA
        ===================================================== */}

        <div
          className="
            mt-10
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-4
            sm:hidden
          "
        >
          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="text-sm font-black">
                Hungry already?
              </p>

              <p className="mt-1 text-[11px] text-white/50">
                Order your favorite food now.
              </p>
            </div>

            <Link
              href="/menu"
              className="
                shrink-0
                rounded-xl
                bg-[var(--color-primary)]
                px-4
                py-2.5
                text-xs
                font-bold
                text-white
              "
            >
              Order Now
            </Link>

          </div>
        </div>

        {/* =====================================================
            DIVIDER
        ===================================================== */}

        <div className="my-8 h-px bg-white/10" />

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            text-center
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:text-left
          "
        >

          <p className="text-xs text-white/40">
            © {currentYear} SFC Cafe. All rights reserved.
          </p>

          <p
            className="
              flex
              items-center
              justify-center
              gap-1.5
              text-xs
              text-white/40
            "
          >
            Made with

            <Heart
              size={12}
              fill="currentColor"
              className="text-[var(--color-secondary)]"
            />

            for food lovers
          </p>

        </div>
      </div>
    </footer>
  );
}