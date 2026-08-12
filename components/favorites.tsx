"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Trash2,
  Plus,
  Check,
  ShoppingBag,
} from "lucide-react";

type FavoriteProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  img: string;
  badge?: string;
};

const initialFavorites: FavoriteProduct[] = [
  {
    id: 1,
    name: "Classic Cheese Burger",
    category: "Burgers",
    price: 149,
    oldPrice: 179,
    rating: 4.8,
    reviews: 124,
    badge: "Popular",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    name: "Loaded French Fries",
    category: "Sides",
    price: 129,
    rating: 4.7,
    reviews: 89,
    img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    name: "Farmhouse Pizza",
    category: "Pizza",
    price: 299,
    oldPrice: 349,
    rating: 4.9,
    reviews: 176,
    badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    name: "Cold Coffee",
    category: "Beverages",
    price: 119,
    rating: 4.6,
    reviews: 63,
    img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 5,
    name: "Paneer Wrap",
    category: "Wraps",
    price: 139,
    rating: 4.7,
    reviews: 71,
    badge: "Fresh",
    img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 6,
    name: "Chocolate Shake",
    category: "Beverages",
    price: 149,
    oldPrice: 169,
    rating: 4.8,
    reviews: 94,
    img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80",
  },
];

const categories = [
  "All",
  "Burgers",
  "Pizza",
  "Sides",
  "Wraps",
  "Beverages",
];

function formatRupee(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] =
    useState<FavoriteProduct[]>(initialFavorites);

  const [activeCategory, setActiveCategory] = useState("All");

  const [addedItems, setAddedItems] = useState<number[]>([]);

  const filteredFavorites = useMemo(() => {
    if (activeCategory === "All") {
      return favorites;
    }

    return favorites.filter(
      (item) => item.category === activeCategory
    );
  }, [favorites, activeCategory]);

  function removeFavorite(id: number) {
    setFavorites((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function addToCart(id: number) {
    setAddedItems((current) =>
      current.includes(id) ? current : [...current, id]
    );

    setTimeout(() => {
      setAddedItems((current) =>
        current.filter((itemId) => itemId !== id)
      );
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-[var(--bg-body)]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="bg-[var(--color-chocolate-dark)]">

        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-8 md:py-12">

          <Link
            href="/profile"
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              text-xs
              font-semibold
              text-white/60
              transition
              hover:text-white
            "
          >
            <ArrowLeft size={15} />
            Back to Profile
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary)]
                    text-white
                  "
                >
                  <Heart
                    size={18}
                    fill="currentColor"
                  />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-primary-light)]">
                  Your Collection
                </p>

              </div>

              <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                Favorites
              </h1>

              <p className="mt-2 max-w-lg text-xs leading-5 ">
                Keep your favourite food close. Order them whenever
                you crave something delicious.
              </p>

            </div>

            <Link
              href="/menu"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
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
              <ShoppingBag size={16} />
              Explore Menu
            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-5 pt-7 sm:px-8">

        <div
          className="
            flex
            flex-col
            gap-4
            rounded-2xl
            border
            border-[var(--color-border)]
            bg-white
            p-4
            shadow-sm
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
              "
            >
              <Heart
                size={20}
                fill="currentColor"
              />
            </div>

            <div>

              <p className="text-xs font-black text-[var(--color-text-primary)]">
                {favorites.length} Favourite Items
              </p>

              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                Your saved food items
              </p>

            </div>

          </div>

          <div className="text-left sm:text-right">

            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Favourite Collection
            </p>

            <p className="mt-1 text-sm font-black text-[var(--color-primary)]">
              Made for your cravings ❤️
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          CATEGORY FILTER
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-5 pt-7 sm:px-8">

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">

          {categories.map((category) => {

            const active = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`
                  shrink-0
                  rounded-full
                  border
                  px-4
                  py-2
                  text-[11px]
                  font-bold
                  transition
                  ${
                    active
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm"
                      : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }
                `}
              >
                {category}
              </button>
            );

          })}

        </div>

      </section>

      {/* =====================================================
          FAVORITE PRODUCTS
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-5 py-6 pb-16 sm:px-8">

        {filteredFavorites.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div
            className="
              rounded-[2rem]
              border
              border-[var(--color-border)]
              bg-white
              px-6
              py-16
              text-center
              shadow-sm
            "
          >

            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-[1.5rem]
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
              "
            >
              <Heart
                size={34}
                strokeWidth={1.7}
              />
            </div>

            <h2 className="mt-6 text-xl font-black text-[var(--color-text-primary)]">
              No favourites yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--color-text-muted)]">
              Start exploring our menu and tap the heart on items
              you love.
            </p>

            <Link
              href="/menu"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[var(--color-primary)]
                px-5
                py-3
                text-xs
                font-bold
                text-white
                shadow-md
                transition
                hover:bg-[var(--color-primary-dark)]
              "
            >
              <ShoppingBag size={15} />
              Explore Menu
            </Link>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            {filteredFavorites.map((product) => {

              const added = addedItems.includes(product.id);

              return (
                <article
                  key={product.id}
                  className="
                    group
                    overflow-hidden
                    rounded-[1.75rem]
                    border
                    border-[var(--color-border)]
                    bg-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="relative h-56 overflow-hidden">

                    <img
                      src={product.img}
                      alt={product.name}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                    />

                    {/* Image overlay */}

                    <div
                      className="
                        absolute
                        inset-x-0
                        bottom-0
                        h-24
                        bg-gradient-to-t
                        from-black/50
                        to-transparent
                      "
                    />

                    {/* Badge */}

                    {product.badge && (
                      <span
                        className="
                          absolute
                          left-4
                          top-4
                          rounded-full
                          bg-[var(--color-secondary)]
                          px-3
                          py-1.5
                          text-[9px]
                          font-black
                          uppercase
                          tracking-wide
                          text-white
                          shadow-md
                        "
                      >
                        {product.badge}
                      </span>
                    )}

                    {/* Remove favorite */}

                    <button
                      type="button"
                      onClick={() => removeFavorite(product.id)}
                      aria-label={`Remove ${product.name} from favorites`}
                      className="
                        absolute
                        right-4
                        top-4
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-white/95
                        text-red-500
                        shadow-lg
                        backdrop-blur
                        transition
                        hover:scale-105
                        hover:bg-red-50
                      "
                    >
                      <Heart
                        size={18}
                        fill="currentColor"
                      />
                    </button>

                    {/* Rating */}

                    <div
                      className="
                        absolute
                        bottom-4
                        left-4
                        flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-black/50
                        px-2.5
                        py-1.5
                        text-white
                        backdrop-blur
                      "
                    >
                      <Star
                        size={12}
                        fill="currentColor"
                        className="text-yellow-400"
                      />

                      <span className="text-[10px] font-bold">
                        {product.rating}
                      </span>

                      <span className="text-[9px] text-white/60">
                        ({product.reviews})
                      </span>
                    </div>

                  </div>

                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="p-5">

                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                      {product.category}
                    </p>

                    <h2 className="mt-1.5 line-clamp-1 text-base font-black text-[var(--color-text-primary)]">
                      {product.name}
                    </h2>

                    <div className="mt-3 flex items-center gap-2">

                      <span className="text-lg font-black text-[var(--color-text-primary)]">
                        {formatRupee(product.price)}
                      </span>

                      {product.oldPrice && (
                        <span className="text-xs font-medium text-[var(--color-text-muted)] line-through">
                          {formatRupee(product.oldPrice)}
                        </span>
                      )}

                    </div>

                    {/* Actions */}

                    <div className="mt-5 flex gap-2">

                      <button
                        type="button"
                        onClick={() => addToCart(product.id)}
                        className={`
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          px-4
                          py-3
                          text-[10px]
                          font-black
                          text-white
                          shadow-sm
                          transition
                          active:scale-95
                          ${
                            added
                              ? "bg-[var(--color-secondary)]"
                              : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
                          }
                        `}
                      >
                        {added ? (
                          <>
                            <Check size={15} />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus size={15} />
                            Add to Cart
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFavorite(product.id)}
                        aria-label={`Delete ${product.name}`}
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-[var(--color-border)]
                          text-[var(--color-text-muted)]
                          transition
                          hover:border-red-200
                          hover:bg-red-50
                          hover:text-red-500
                        "
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                </article>
              );

            })}

          </div>

        )}

      </section>

    </main>
  );
}