"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Home, Menu, Info, Phone, User, LayoutDashboard, LogOut } from "lucide-react";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mobileTabs = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Menu", icon: Menu, href: "/menu" },
    { label: "About", icon: Info, href: "/about" },
    { label: "Contact", icon: Phone, href: "/contact" },
  ];

  return (
    <>
      <header className="md:hidden border-b border-[var(--color-border)] bg-[var(--bg-surface)]/95 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="relative overflow-hidden px-4 py-4">
          <div className="absolute left-4 top-2 h-2 w-2 rounded-full bg-[var(--color-primary)] opacity-80 animate-twinkle" />
          <div className="absolute right-6 top-8 h-3 w-3 rounded-full bg-[var(--color-gold)] opacity-80 animate-float" />
          <div className="relative flex items-center justify-between gap-3">
            <Link className="flex items-center gap-3" href="/">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[1.5rem] bg-[var(--color-primary)]/15 text-[var(--color-primary-dark)] text-2xl shadow-glow">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary-dark)]">
                  <Home size={22} />
                </span>
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--color-primary-dark)]">SFC Cafe</p>
                <p className="text-[0.72rem] text-[var(--color-text-muted)]">Modern cafe experience</p>
              </div>
            </Link>
            <Link href="/menu" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary)]/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary-dark)] transition duration-300 hover:bg-[var(--color-secondary)]/20 hover:text-[var(--color-secondary-dark)]">
              Order
            </Link>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--bg-surface)]/98 px-3 py-3 shadow-[0_-18px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
        <div className="relative">
          <ul className="mx-auto flex max-w-5xl items-center justify-between gap-1 overflow-x-auto px-1">
            {mobileTabs.map((item) => (
              <li key={item.label} className="min-w-[4.5rem]">
                <Link
                  href={item.href}
                  className="flex flex-col items-center justify-center rounded-3xl px-3 py-2 text-[0.68rem] font-semibold text-[var(--color-text-secondary)] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary-dark)]"
                >
                  <span className="text-xl">
                    <item.icon size={20} />
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="min-w-[4.5rem]">
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                className="flex flex-col items-center justify-center rounded-3xl px-3 py-2 text-[0.68rem] font-semibold text-[var(--color-text-secondary)] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary-dark)]"
              >
                <span className="text-xl">
                  <User size={20} />
                </span>
                Profile
              </button>
            </li>
          </ul>

          {dropdownOpen && (
            <div className="absolute bottom-20 left-1/2 z-50 w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--bg-surface)]/98 p-3 shadow-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl animate-fade-up">
              <Link
                href="/dashboard"
                className="block rounded-3xl px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition duration-300 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary-dark)]"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="mt-2 block rounded-3xl px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition duration-300 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary-dark)]"
              >
                Profile
              </Link>
              <Link
                href="/logout"
                className="mt-2 block rounded-3xl px-4 py-3 text-sm font-semibold text-[var(--color-error)] transition duration-300 hover:bg-[var(--color-error)]/10"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="hidden md:block border-b border-[var(--color-border)] bg-[var(--bg-surface)]/95 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4">
          <Link className="flex items-center gap-3" href="/">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-[var(--color-primary)]/15 text-[var(--color-primary-dark)] text-2xl shadow-glow">
              <Home size={24} />
            </span>
            <div>
              <p className="text-base font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)]">SFC Cafe</p>
              <p className="text-sm text-[var(--color-text-muted)]">Bakery app</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2" aria-label="Desktop navigation">
            {[
              { label: "Home", href: "/" },
              { label: "Menu", href: "/menu" },
              { label: "About Us", href: "/about" },
              { label: "Contact Us", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-cream)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-white)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-expanded={dropdownOpen}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-secondary-dark)] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-secondary)]/20"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-secondary)]/15 text-lg shadow-sm">
                <User size={18} />
              </span>
              Profile
              <span className="text-xs text-[var(--color-text-muted)]">▾</span>
            </button>

            {dropdownOpen && (
              <div className="dropdown-panel absolute right-0 mt-3 w-56 rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--bg-surface)]/98 p-3 shadow-xl shadow-[0_30px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
                <Link
                  href="/dashboard"
                  className="block rounded-3xl px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition duration-300 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary-dark)]"
                >
                  <div className="flex items-center gap-2">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </div>
                </Link>
                <Link
                  href="/profile"
                  className="mt-2 block rounded-3xl px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition duration-300 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary-dark)]"
                >
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    Profile
                  </div>
                </Link>
                <Link
                  href="/logout"
                  className="mt-2 block rounded-3xl px-4 py-3 text-sm font-semibold text-[var(--color-error)] transition duration-300 hover:bg-[var(--color-error)]/10"
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={16} />
                    Logout
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
