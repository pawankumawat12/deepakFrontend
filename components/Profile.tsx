"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Pencil,
  ShoppingBag,
  Heart,
  Bell,
  LogOut,
  ChevronRight,
  Camera,
  ShieldCheck,
} from "lucide-react";

export default function Profile() {
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("Pawan Kumar");
  const [email, setEmail] = useState("pawan@example.com");
  const [phone, setPhone] = useState("+91 99999 99999");

  function handleSave() {
    setEditing(false);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-body)] mt-[60px]">

      <section className="bg-[var(--color-chocolate-dark)]">

        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* User */}

            <div className="flex items-center gap-4">

              <div className="relative">

                <div
                  className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-[1.5rem]
                    bg-[var(--color-primary)]
                    text-white
                    shadow-xl
                    sm:h-24
                    sm:w-24
                  "
                >
                  <User size={38} strokeWidth={1.8} />
                </div>

                <button
                  type="button"
                  className="
                    absolute
                    -bottom-2
                    -right-2
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-[var(--color-chocolate-dark)]
                    bg-white
                    text-[var(--color-primary)]
                    shadow-md
                  "
                >
                  <Camera size={14} />
                </button>

              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-light)]">
                  My Account
                </p>

                <h1 className="mt-1 text-2xl font-black  sm:text-3xl">
                  {name}
                </h1>

                <p className="mt-1 text-xs">
                  Welcome back to SFC Cafe 👋
                </p>

              </div>

            </div>

            {/* Order Button */}

            <Link
              href="/menu"
              className="
                inline-flex
                items-center
                justify-center
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
                hover:-translate-y-0.5
                hover:bg-[var(--color-primary-dark)]
              "
            >
              Order Something
              <ShoppingBag size={15} />
            </Link>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 md:py-12">

        <div className="grid gap-6 lg:grid-cols-3">

          {/* =====================================================
              LEFT - PROFILE INFORMATION
          ===================================================== */}

          <div className="lg:col-span-2">

            <div
              className="
                overflow-hidden
                rounded-[2rem]
                border
                border-[var(--color-border)]
                bg-white
                shadow-sm
              "
            >

              {/* Header */}

              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5 sm:px-8">

                <div>

                  <h2 className="text-lg font-black text-[var(--color-text-primary)]">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                    Manage your account details
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => setEditing((value) => !value)}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-[var(--color-primary)]
                    transition
                    hover:bg-[var(--color-primary)]
                    hover:text-white
                  "
                >
                  <Pencil size={14} />

                  {editing ? "Cancel" : "Edit"}
                </button>

              </div>

              {/* Form */}

              <div className="space-y-5 p-6 sm:p-8">

                {/* Name */}

                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-bold text-[var(--color-text-primary)]"
                  >
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={17}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-[var(--color-text-muted)]
                      "
                    />

                    <input
                      id="name"
                      value={name}
                      disabled={!editing}
                      onChange={(e) => setName(e.target.value)}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[var(--color-border)]
                        bg-[var(--bg-body)]
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        font-medium
                        text-[var(--color-text-primary)]
                        outline-none
                        transition
                        disabled:cursor-not-allowed
                        disabled:opacity-70
                        focus:border-[var(--color-primary)]
                        focus:ring-2
                        focus:ring-[var(--color-primary)]/10
                      "
                    />

                  </div>

                </div>

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-bold text-[var(--color-text-primary)]"
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={17}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-[var(--color-text-muted)]
                      "
                    />

                    <input
                      id="email"
                      value={email}
                      disabled={!editing}
                      onChange={(e) => setEmail(e.target.value)}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[var(--color-border)]
                        bg-[var(--bg-body)]
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        text-[var(--color-text-primary)]
                        outline-none
                        transition
                        disabled:cursor-not-allowed
                        disabled:opacity-70
                        focus:border-[var(--color-primary)]
                        focus:ring-2
                        focus:ring-[var(--color-primary)]/10
                      "
                    />

                  </div>

                </div>

                {/* Phone */}

                <div>

                  <label
                    htmlFor="phone"
                    className="mb-2 block text-xs font-bold text-[var(--color-text-primary)]"
                  >
                    Phone Number
                  </label>

                  <div className="relative">

                    <Phone
                      size={17}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-[var(--color-text-muted)]
                      "
                    />

                    <input
                      id="phone"
                      value={phone}
                      disabled={!editing}
                      onChange={(e) => setPhone(e.target.value)}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[var(--color-border)]
                        bg-[var(--bg-body)]
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        text-[var(--color-text-primary)]
                        outline-none
                        transition
                        disabled:cursor-not-allowed
                        disabled:opacity-70
                        focus:border-[var(--color-primary)]
                        focus:ring-2
                        focus:ring-[var(--color-primary)]/10
                      "
                    />

                  </div>

                </div>

                {/* Save */}

                {editing && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="
                      rounded-xl
                      bg-[var(--color-primary)]
                      px-6
                      py-3
                      text-xs
                      font-bold
                      text-white
                      shadow-md
                      transition
                      hover:bg-[var(--color-primary-dark)]
                      active:scale-95
                    "
                  >
                    Save Changes
                  </button>
                )}

              </div>

            </div>

          </div>

          {/* =====================================================
              RIGHT - QUICK ACTIONS
          ===================================================== */}

          <div className="space-y-4">

            <h2 className="px-1 text-sm font-black text-[var(--color-text-primary)]">
              Quick Access
            </h2>

            {/* Orders */}

            <Link
              href="/orders"
              className="
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-white
                p-4
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-primary-50)]
                  text-[var(--color-primary)]
                "
              >
                <ShoppingBag size={19} />
              </div>

              <div className="flex-1">

                <p className="text-xs font-black text-[var(--color-text-primary)]">
                  My Orders
                </p>

                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  View your order history
                </p>

              </div>

              <ChevronRight
                size={17}
                className="text-[var(--color-text-muted)] transition group-hover:translate-x-1"
              />

            </Link>

            {/* Favorites */}

            <Link
              href="/favorites"
              className="
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-white
                p-4
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-primary-50)]
                  text-[var(--color-primary)]
                "
              >
                <Heart size={19} />
              </div>

              <div className="flex-1">

                <p className="text-xs font-black text-[var(--color-text-primary)]">
                  Favorites
                </p>

                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  Your favorite food items
                </p>

              </div>

              <ChevronRight
                size={17}
                className="text-[var(--color-text-muted)] transition group-hover:translate-x-1"
              />

            </Link>

            {/* Notifications */}

            <Link
              href="/notifications"
              className="
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-white
                p-4
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-primary-50)]
                  text-[var(--color-primary)]
                "
              >
                <Bell size={19} />
              </div>

              <div className="flex-1">

                <p className="text-xs font-black text-[var(--color-text-primary)]">
                  Notifications
                </p>

                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  Offers and order updates
                </p>

              </div>

              <ChevronRight
                size={17}
                className="text-[var(--color-text-muted)] transition group-hover:translate-x-1"
              />

            </Link>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">

        <div
          className="
            rounded-[2rem]
            border
            border-[var(--color-border)]
            bg-white
            p-6
            shadow-sm
            sm:p-8
          "
        >

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--color-primary-50)]
                  text-[var(--color-primary)]
                "
              >
                <MapPin size={21} />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Delivery Address
                </p>

                <h3 className="mt-1 text-sm font-black text-[var(--color-text-primary)]">
                  Home
                </h3>

                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  Jaipur, Rajasthan, India
                </p>

              </div>

            </div>

            <button
              type="button"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[var(--color-border)]
                px-4
                py-2.5
                text-xs
                font-bold
                text-[var(--color-primary)]
                transition
                hover:bg-[var(--color-primary-50)]
              "
            >
              <Pencil size={14} />
              Manage Address
            </button>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-8">

        <div
          className="
            flex
            flex-col
            gap-4
            rounded-[2rem]
            border
            border-red-100
            bg-red-50/50
            p-6
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-red-100
                text-red-500
              "
            >
              <LogOut size={18} />
            </div>

            <div>

              <p className="text-xs font-black text-[var(--color-text-primary)]">
                Sign out of your account
              </p>

              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                You can sign back in anytime.
              </p>

            </div>

          </div>

          <Link
            href="/logout"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-red-500
              px-5
              py-2.5
              text-xs
              font-bold
              text-white
              transition
              hover:bg-red-600
              active:scale-95
            "
          >
            Logout
          </Link>

        </div>

      </section>

    </div>
  );
}