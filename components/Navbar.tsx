"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  Home,
  Menu as MenuIcon,
  Phone,
  User,
  LayoutDashboard,
  LogOut,
  Leaf,
  Heart,
  Bookmark,
  Sun,
  Moon,
  Palette,
  X,
  ChevronDown,
  Bell,
} from "lucide-react";

import cartStore from "./cart/store";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { logout } from "../redux/features/authSlice";
import { useLogoutMutation } from "../redux/services/authApi";
import { useGetWishlistQuery } from "../redux/services/wishlistApi";
import { useTheme, COLOR_THEMES, ColorTheme } from "../context/ThemeContext";
import LogoutModal from "@/models/LogoutModel";
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const assetOrigin = new URL(apiUrl).origin;

const toAssetUrl = (path?: string | null) => {
  if (!path || /^https?:\/\//i.test(path)) return path || "";
  return `${assetOrigin}${path.startsWith("/") ? path : `/${path}`}`;
};

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, colorTheme, toggleTheme, setColorTheme } = useTheme();
  const user = useSelector(
    (state: { auth: { user: { name?: string; image?: string | null } | null } }) => state.auth.user
  );

  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !user,
  });
  const wishlistCount = wishlistData?.data?.length || 0;

  const [logoutRequest] = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [logoutModal, setLogoutModal] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logoutRequest().unwrap();
    } catch { }
    dispatch(logout());
    setDropdownOpen(false);
    setMobileProfileOpen(false);
    router.replace("/");
    setLogoutModal(false);
  };

  useEffect(() => {
    const updateCart = () => {
      const cart = cartStore.getCart();

      const count = cart.reduce((acc, item) => acc + item.qty, 0);

      setCartCount(count);
    };

    updateCart();

    window.addEventListener("sfc_cart_updated", updateCart);

    return () => {
      window.removeEventListener("sfc_cart_updated", updateCart);
    };
  }, []);

  useEffect(() => {
    const openLoginModal = () => setAuthOpen(true);

    window.addEventListener("sfc_open_login", openLoginModal);
    return () => window.removeEventListener("sfc_open_login", openLoginModal);
  }, []);

  /* ---------------- CLOSE PROFILE & PALETTE OUTSIDE ---------------- */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        paletteRef.current &&
        !paletteRef.current.contains(event.target as Node)
      ) {
        setPaletteOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  /* ---------------- NAVIGATION ---------------- */

  const desktopLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Menu",
      href: "/menu",
    },
    {
      label: "About Us",
      href: "/about",
    },
    {
      label: "Contact Us",
      href: "/contact",
    },
  ];

  const mobileTabs = [
    {
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      label: "Menu",
      icon: MenuIcon,
      href: "/menu",
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      href: "/cart",
    },
    {
      label: "Offers",
      icon: Heart,
      href: "/offers",
    },
  ];

  return (
    <>
      {/* =========================================================
          DESKTOP NAVBAR
      ========================================================= */}

      <header className="hidden md:block fixed top-0 inset-x-0 z-50">
        <div className="border-b border-[var(--color-border)] bg-[var(--bg-surface)]/95 backdrop-blur-xl shadow-[0_4px_25px_rgba(45,27,15,0.08)]">
          <div className="mx-auto flex h-[82px] max-w-7xl items-center justify-between gap-8 px-6 lg:px-8">
            {/* ---------------- LOGO ---------------- */}

            <Link href="/" className="group flex shrink-0 items-center gap-3">
              <div
                className="
                  flex h-15 w-15 items-center justify-center
                  rounded-2xl
                  group-hover:scale-105
                "
              >
                <img src="/images/sfcLogo.png" />
              </div>

            </Link>

            {/* ---------------- DESKTOP LINKS ---------------- */}

            <nav
              className="flex items-center gap-1"
              aria-label="Desktop navigation"
            >
              {desktopLinks.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative
                      px-4 py-3
                      text-sm
                      font-semibold
                      transition-all
                      duration-200
                      ${active
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
                      }
                    `}
                  >
                    {item.label}

                    {active && (
                      <span className="absolute bottom-0 left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-full bg-[var(--color-primary)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ---------------- RIGHT ACTIONS ---------------- */}

            <div className="flex items-center gap-2">
              <Link
                href="/notifications"
                aria-label="Cart"
                className="
                  relative
                  flex h-10 w-10 items-center justify-center
                  rounded-full
                  text-[var(--color-text-primary)]
                  transition
                  hover:bg-[var(--color-primary-50)]
                  hover:text-[var(--color-primary)]
                "
              >
                <Bell size={20} />

                <span
                  className="
                      absolute
                      -right-0.5
                      -top-0.5
                      flex
                      h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-[var(--color-primary)]
                      px-1
                      text-[10px]
                      font-bold
                      text-white
                    "
                >
                  0
                </span>
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/favorites"
                aria-label="Wishlist"
                title="Your Wishlist"
                className="
                  relative
                  flex h-10 w-10 items-center justify-center
                  rounded-full
                  text-[var(--color-text-primary)]
                  transition
                  hover:bg-[var(--color-primary-50)]
                  hover:text-[var(--color-primary)]
                "
              >
                <Bookmark
                  size={20}
                  className={wishlistCount > 0 ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : ""}
                />

                {wishlistCount > 0 && (
                  <span
                    className="
                      absolute
                      -right-0.5
                      -top-0.5
                      flex
                      h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-[var(--color-primary)]
                      px-1
                      text-[10px]
                      font-bold
                      text-white
                      shadow-sm
                    "
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label="Cart"
                className="
                  relative
                  flex h-10 w-10 items-center justify-center
                  rounded-full
                  text-[var(--color-text-primary)]
                  transition
                  hover:bg-[var(--color-primary-50)]
                  hover:text-[var(--color-primary)]
                "
              >
                <ShoppingCart size={20} />

                {cartCount > 0 && (
                  <span
                    className="
                      absolute
                      -right-0.5
                      -top-0.5
                      flex
                      h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-[var(--color-primary)]
                      px-1
                      text-[10px]
                      font-bold
                      text-white
                    "
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Theme Toggle (Dark / Light Mode) */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
                title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
                className="
                  relative
                  flex h-10 w-10 items-center justify-center
                  rounded-full
                  text-[var(--color-text-primary)]
                  transition-all
                  duration-300
                  hover:bg-[var(--color-primary-50)]
                  hover:text-[var(--color-primary)]
                  active:scale-90
                "
              >
                {theme === "light" ? (
                  <Moon size={19} className="transition-transform duration-300 hover:-rotate-12" />
                ) : (
                  <Sun size={19} className="text-amber-400 transition-transform duration-300 hover:rotate-45" />
                )}
              </button>

              {/* Cafe Color Theme Palette Picker */}
              <div ref={paletteRef} className="relative">
                <button
                  type="button"
                  onClick={() => setPaletteOpen((prev) => !prev)}
                  aria-label="Choose cafe color theme"
                  title="Choose cafe color theme"
                  className="
                    relative
                    flex h-10 w-10 items-center justify-center
                    rounded-full
                    text-[var(--color-text-primary)]
                    transition-all
                    duration-300
                    hover:bg-[var(--color-primary-50)]
                    hover:text-[var(--color-primary)]
                    active:scale-90
                  "
                >
                  <Palette size={19} />
                  <span
                    className="absolute bottom-2 right-2 h-2 w-2 rounded-full ring-1 ring-[var(--bg-surface)]"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  />
                </button>

                {paletteOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-[calc(100%+10px)]
                      w-60
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[var(--color-border)]
                      bg-[var(--bg-surface)]
                      p-3
                      shadow-[0_20px_50px_rgba(0,0,0,0.25)]
                      z-50
                    "
                  >
                    <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                      Cafe Color Theme
                    </p>

                    <div className="mt-2.5 flex flex-col gap-1">
                      {COLOR_THEMES.map((c) => {
                        const isSelected = colorTheme === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setColorTheme(c.id);
                              setPaletteOpen(false);
                            }}
                            className={`
                              flex items-center gap-3 rounded-xl p-2 text-left transition
                              ${
                                isSelected
                                  ? "bg-[var(--color-primary-50)] font-bold text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]"
                                  : "text-[var(--color-text-primary)] hover:bg-[var(--color-primary-50)]"
                              }
                            `}
                          >
                            <span
                              className="h-4 w-4 shrink-0 rounded-full border border-black/10 shadow-xs"
                              style={{ backgroundColor: c.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs leading-tight font-bold">{c.name}</p>
                              <p className="text-[10px] text-[var(--color-text-muted)] truncate">{c.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}

              {user && (
                <div ref={profileRef} className="relative ml-1">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((open) => !open)}
                    aria-expanded={dropdownOpen}
                    className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-cream)]
                    px-3
                    py-1.5
                    text-sm
                    font-semibold
                    text-[var(--color-text-primary)]
                    transition
                    hover:border-[var(--color-primary)]
                    hover:bg-[var(--color-primary-50)]
                  "
                  >
                    <span
                      className="
                      flex h-8 w-8 overflow-hidden items-center justify-center
                      rounded-full
                      bg-[var(--color-primary)]
                      text-white
                    "
                    >
                      {user?.image ? (
                        <img
                          src={toAssetUrl(user.image)}
                          alt={user?.name || "User profile"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User size={17} />
                      )}
                    </span>

                    <span>{user?.name?.split(" ")[0] ?? "Profile"}</span>

                    <ChevronDown
                      size={15}
                      className={`
                      transition-transform
                      ${dropdownOpen ? "rotate-180" : ""}
                    `}
                    />
                  </button>

                  {/* Profile Dropdown */}

                  {dropdownOpen && (
                    <div
                      className="
                      absolute
                      right-0
                      top-[calc(100%+12px)]
                      w-56
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[var(--color-border)]
                      bg-white
                      p-2
                      shadow-[0_20px_50px_rgba(45,27,15,0.15)]
                    "
                    >
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="
                        flex items-center gap-3
                        rounded-xl
                        px-4 py-3
                        text-sm font-semibold
                        text-[var(--color-text-primary)]
                        transition
                        hover:bg-[var(--color-primary-50)]
                        hover:text-[var(--color-primary)]
                      "
                      >
                        <User size={17} />
                        Profile
                      </Link>

                      <Link
                        href="/favorites"
                        onClick={() => setDropdownOpen(false)}
                        className="
                        flex items-center justify-between
                        rounded-xl
                        px-4 py-3
                        text-sm font-semibold
                        text-[var(--color-text-primary)]
                        transition
                        hover:bg-[var(--color-primary-50)]
                        hover:text-[var(--color-primary)]
                      "
                      >
                        <div className="flex items-center gap-3">
                          <Bookmark
                            size={17}
                            className={
                              wishlistCount > 0
                                ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                                : ""
                            }
                          />
                          Wishlist
                        </div>
                        {wishlistCount > 0 && (
                          <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold text-white">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>

                      {/* Theme switcher in dropdown */}
                      <button
                        type="button"
                        onClick={() => toggleTheme()}
                        className="
                          flex w-full items-center justify-between
                          rounded-xl
                          px-4 py-2.5
                          text-sm font-semibold
                          text-[var(--color-text-primary)]
                          transition
                          hover:bg-[var(--color-primary-50)]
                          hover:text-[var(--color-primary)]
                        "
                      >
                        <div className="flex items-center gap-3">
                          {theme === "light" ? (
                            <Moon size={17} />
                          ) : (
                            <Sun size={17} className="text-amber-400" />
                          )}
                          <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase text-[var(--color-text-muted)]">
                          {theme}
                        </span>
                      </button>

                      {/* Color Palette Selector in dropdown */}
                      <div className="px-4 py-2">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                          Color Theme
                        </p>
                        <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                          {COLOR_THEMES.map((c) => {
                            const isSelected = colorTheme === c.id;
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => setColorTheme(c.id)}
                                title={c.name}
                                className={`
                                  flex flex-col items-center gap-1 rounded-lg p-1.5 transition-all
                                  ${
                                    isSelected
                                      ? "bg-[var(--color-primary-50)] ring-1 ring-[var(--color-primary)] font-bold text-[var(--color-primary)]"
                                      : "hover:bg-[var(--color-primary-50)] text-[var(--color-text-secondary)]"
                                  }
                                `}
                              >
                                <span
                                  className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-xs"
                                  style={{ backgroundColor: c.color }}
                                />
                                <span className="text-[8px] font-bold capitalize">
                                  {c.id}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="my-1 h-px bg-[var(--color-border)]" />

                      <button
                        type="button"
                        onClick={() => setLogoutModal(true)}
                        className="
                        flex items-center gap-3
                        rounded-xl
                        px-4 py-3
                        text-sm font-semibold
                        text-[var(--color-error)]
                        transition
                        hover:bg-red-50
                      "
                      >
                        <LogOut size={17} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Order Now */}

              {!user && (
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="mr-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--bg-surface)] px-5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  <User size={18} />
                  Sign in
                </button>
              )}

              <Link
                href="/menu"
                className="
                  ml-2
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-primary)]
                  px-6
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(79,125,22,0.22)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[var(--color-primary-dark)]
                  hover:shadow-[0_10px_25px_rgba(79,125,22,0.30)]
                "
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </header>

          {/* MOBILE / PWA TOP BAR */}

      <header
        className="md:hidden fixed top-0 inset-x-0 z-50"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div
          className="
            border-b
            border-[var(--color-border)]
            bg-[var(--bg-surface)]/95
            backdrop-blur-xl
            shadow-[0_4px_20px_rgba(45,27,15,0.08)]
          "
        >
          <div className="flex h-[68px] items-center justify-between px-4 sm:px-5">
            {/* Logo */}

            <Link href="/" className="flex items-center gap-2.5">
              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                "
              >
                <img src="/images/sfcLogo.png" />
              </div>
            </Link>


            <div className="flex items-center gap-2">
              {!user && (
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  Sign in
                </button>
              )}

              <Link
                href="/cart"
                className="
                  relative
                  flex h-11 w-11
                  items-center justify-center
                  rounded-full
                  bg-[var(--color-primary-50)]
                  text-[var(--color-primary)]
                "
              >
                <ShoppingCart size={21} />

                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex h-5 min-w-5
                    items-center justify-center
                    rounded-full
                    bg-[var(--color-primary)]
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <nav
        className="
          md:hidden
          fixed
          bottom-0
          inset-x-0
          z-50
          border-t
          border-[var(--color-border)]
          bg-white/95
          px-2
          pt-2
          backdrop-blur-xl
          shadow-[0_-8px_30px_rgba(45,27,15,0.12)]
        "
        style={{
          paddingBottom: "calc(8px + env(safe-area-inset-bottom))",
        }}
        aria-label="Mobile navigation"
      >
        <div className="mx-auto flex max-w-md items-center justify-around">
          {mobileTabs.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative
                  flex
                  min-w-[62px]
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-2xl
                  px-2
                  py-2
                  text-[10px]
                  font-semibold
                  transition-all
                  duration-200
                  ${active
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-muted)]"
                  }
                `}
              >
                {/* Active pill */}

                {active && (
                  <span
                    className="
                      absolute
                      -top-2
                      h-1
                      w-7
                      rounded-full
                      bg-[var(--color-primary)]
                    "
                  />
                )}

                <span
                  className={`
                    relative
                    flex h-8 w-10
                    items-center
                    justify-center
                    rounded-xl
                    transition
                    ${active ? "bg-[var(--color-primary-50)]" : ""}
                  `}
                >
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />

                  {/* Cart Badge */}

                  {item.label === "Cart" && cartCount > 0 && (
                    <span
                      className="
                          absolute
                          -right-1
                          -top-1
                          flex h-4 min-w-4
                          items-center justify-center
                          rounded-full
                          bg-[var(--color-primary)]
                          px-1
                          text-[8px]
                          font-bold
                          text-white
                        "
                    >
                      {cartCount}
                    </span>
                  )}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Profile */}

          {user ? (
            <div className="relative min-w-[62px]">
              <button
                type="button"
                onClick={() => setMobileProfileOpen((open) => !open)}
                className={`
                flex
                w-full
                flex-col
                items-center
                justify-center
                gap-1
                rounded-2xl
                px-2
                py-2
                text-[10px]
                font-semibold
                transition
                ${mobileProfileOpen
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-muted)]"
                  }
              `}
              >
                <span
                  className={`
                  flex h-8 w-10
                  items-center
                  justify-center
                  rounded-xl
                  ${mobileProfileOpen ? "bg-[var(--color-primary-50)]" : ""}
                `}
                >
                  <User size={20} strokeWidth={mobileProfileOpen ? 2.5 : 2} />
                </span>

                <span>Profile</span>
              </button>

              {/* Mobile Profile Menu */}

              {mobileProfileOpen && (
                <div
                  className="
                  absolute
                  bottom-[68px]
                  right-0
                  w-52
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-2
                  shadow-[0_15px_45px_rgba(45,27,15,0.18)]
                "
                >
                  <Link
                    href="/profile"
                    onClick={() => setMobileProfileOpen(false)}
                    className="
                    flex items-center gap-3
                    rounded-xl
                    px-3 py-3
                    text-sm font-semibold
                    text-[var(--color-text-primary)]
                    hover:bg-[var(--color-primary-50)]
                    hover:text-[var(--color-primary)]
                  "
                  >
                    <User size={17} />
                    Profile
                  </Link>

                  <Link
                    href="/favorites"
                    onClick={() => setMobileProfileOpen(false)}
                    className="
                    flex items-center justify-between
                    rounded-xl
                    px-3 py-3
                    text-sm font-semibold
                    text-[var(--color-text-primary)]
                    hover:bg-[var(--color-primary-50)]
                    hover:text-[var(--color-primary)]
                  "
                  >
                    <div className="flex items-center gap-3">
                      <Bookmark
                        size={17}
                        className={
                          wishlistCount > 0
                            ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                            : ""
                        }
                      />
                      Wishlist
                    </div>
                    {wishlistCount > 0 && (
                      <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Theme Switcher in mobile drawer */}
                  <button
                    type="button"
                    onClick={() => toggleTheme()}
                    className="
                      flex w-full items-center justify-between
                      rounded-xl
                      px-3 py-2.5
                      text-sm font-semibold
                      text-[var(--color-text-primary)]
                      hover:bg-[var(--color-primary-50)]
                      hover:text-[var(--color-primary)]
                    "
                  >
                    <div className="flex items-center gap-3">
                      {theme === "light" ? (
                        <Moon size={17} />
                      ) : (
                        <Sun size={17} className="text-amber-400" />
                      )}
                      <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[var(--color-text-muted)]">
                      {theme}
                    </span>
                  </button>

                  {/* Color Palette in mobile drawer */}
                  <div className="px-3 py-2">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Color Theme
                    </p>
                    <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                      {COLOR_THEMES.map((c) => {
                        const isSelected = colorTheme === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setColorTheme(c.id)}
                            title={c.name}
                            className={`
                              flex flex-col items-center gap-1 rounded-lg p-1.5 transition-all
                              ${
                                isSelected
                                  ? "bg-[var(--color-primary-50)] ring-1 ring-[var(--color-primary)] font-bold text-[var(--color-primary)]"
                                  : "hover:bg-[var(--color-primary-50)] text-[var(--color-text-secondary)]"
                              }
                            `}
                          >
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-xs"
                              style={{ backgroundColor: c.color }}
                            />
                            <span className="text-[8px] font-bold capitalize">
                              {c.id}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="my-1 h-px bg-[var(--color-border)]" />

                  <button
                    type="button"
                    onClick={() => setLogoutModal(true)}
                    className="
                    flex items-center gap-3
                    rounded-xl
                    px-3 py-3
                    text-sm font-semibold
                    text-[var(--color-error)]
                    hover:bg-red-50
                  "
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="flex min-w-[62px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold text-[var(--color-text-muted)]"
            >
              <User size={20} />
              <span>Sign in</span>
            </button>
          )}
        </div>
      </nav>

      <LoginModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onOpenRegister={() => {
          setAuthOpen(false);
          setRegisterOpen(true);
        }}
      />
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />

      <LogoutModal open={logoutModal} onClose={() => setLogoutModal(false)} onConfirm={handleLogout} />
    </>
  );
};

export default Navbar;
