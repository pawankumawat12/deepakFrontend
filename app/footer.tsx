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
  Zap,
  Bell,
  Wifi,
} from "lucide-react";
import PWAInstallButton from "@/components/PWAInstallButton";
import { useGetFooterQuery, useGetLogoQuery } from "../redux/services/settingsApi";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const backendUrl = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) ||
  process.env.VITE_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
  ""
).replace(/\/+$/, "");

const toAssetUrl = (path?: string | null) => {
  if (!path || /^https?:\/\//i.test(path) || /^(?:blob:|data:)/i.test(path)) return path || "";
  return `${backendUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

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
  const { data: footerResponse } = useGetFooterQuery();
  const { data: logoResponse } = useGetLogoQuery();
  const footerSettings = footerResponse?.data;
  const logoUrl = logoResponse?.data?.logo_url ? toAssetUrl(logoResponse.data.logo_url) : null;

  return (
    <footer className="app-footer bg-[var(--bg-footer)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              {logoUrl ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5 shadow-lg">
                  <img src={logoUrl} alt="SFC Cafe" className="h-full w-full object-contain" />
                </div>
              ) : (
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
              )}

              <div>
                <span className="block text-xl font-black tracking-tight">
                  SFC Cafe
                </span>

                <span className="block text-[9px] font-medium uppercase tracking-[0.2em] text-white/50">
                  Fresh • Fast • Delicious
                </span>
              </div>
            </Link>


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

            <div className="mt-6 flex items-center gap-2">
              <a
                href={footerSettings?.facebook || "#"}
                target={footerSettings?.facebook ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-primary-light)]
                  text-white/70
                  transition
                  hover:bg-[var(--color-primary)]
                  hover:text-white"
              >
                <span className="text-sm font-bold">
                  <FaFacebook />
                </span>
              </a>
              <a
                href={footerSettings?.instagram || "#"}
                target={footerSettings?.instagram ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[var(--color-primary-light)]
                text-white/70
                transition
                hover:bg-[var(--color-primary)]
                hover:text-white"
              >
                <span className="text-sm font-bold">
                <FaInstagram />
                
                </span>
              </a>
              <a
                href={footerSettings?.twitter || "#"}
                target={footerSettings?.twitter ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-primary-light)]
                  text-white/70
                  transition
                  hover:bg-[var(--color-primary)]
                  hover:text-white"
              >
                <span className="text-sm font-bold"><FaTwitter /></span>
              </a>
            </div>
          </div>
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
                  {footerSettings?.location || (
                    <>
                      123 Main Street,
                      <br />
                      Jaipur, Rajasthan 302017
                    </>
                  )}
                </p>

              </div>

              {/* Phone */}

              <a
                href={`tel:${footerSettings?.phone_number || "+919876543210"}`}
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

                {footerSettings?.phone_number || "+91 98765 43210"}
              </a>

              {/* Email */}

              <a
                href={`mailto:${footerSettings?.email || "hello@sfccafe.com"}`}
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

                {footerSettings?.email || "hello@sfccafe.com"}
              </a>

              {/* Timing */}

              <div className="flex gap-3">

                <Clock3
                  size={17}
                  className="mt-0.5 shrink-0 text-[var(--color-primary-light)]"
                />

                <div className="text-sm text-white/55">
                  {footerSettings?.working_hours ? (
                    footerSettings.working_hours.split("\n").map((line: string, idx: number) => (
                      <p key={idx}>{line}</p>
                    ))
                  ) : (
                    <>
                      <p>Mon - Fri: 10 AM - 11 PM</p>
                      <p>Sat - Sun: 9 AM - 11:30 PM</p>
                    </>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--color-primary)]/25 via-white/5 to-transparent p-5 sm:p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[22px] bg-white p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/20">
                <img
                  src={logoUrl || "/images/sfcLogo.png"}
                  alt="SFC Cafe app icon"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary-light)]">
                  Mobile App Experience
                </p>
                <h3 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
                  Install SFC Cafe App
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                  Add SFC Cafe to your home screen for faster ordering, quick
                  reorders, and an app-like experience — no app store needed.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { icon: Zap, label: "Fast ordering" },
                    { icon: Bell, label: "Order updates" },
                    { icon: Wifi, label: "Offline support" },
                  ].map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/75"
                    >
                      <Icon size={13} className="text-[var(--color-primary-light)]" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 lg:pl-4">
              <PWAInstallButton variant="footer" />
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black">Hungry already?</p>
              <p className="mt-1 text-[11px] text-white/50">
                Order your favorite food now.
              </p>
            </div>

            <Link
              href="/menu"
              className="shrink-0 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-white"
            >
              Order Now
            </Link>
          </div>
        </div>
        <div className="my-8 h-px bg-white/10" />
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

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/40">
            <Link href="/privacy-policy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-white transition">
              Refund Policy
            </Link>
          </div>

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