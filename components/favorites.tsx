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
  LoaderCircle,
  LogIn,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  useGetWishlistQuery,
  useRemoveWishlistItemMutation,
  WishlistItem,
} from "../redux/services/wishlistApi";
import { useAddCartItemMutation } from "../redux/services/cartApi";

function formatRupee(value: number) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export default function FavoritesPage() {
  const user = useSelector(
    (state: { auth: { user: any | null } }) => state.auth.user
  );

  const {
    data: wishlistResponse,
    isLoading,
    isFetching,
    error,
  } = useGetWishlistQuery(undefined, {
    skip: !user,
  });

  const [removeWishlistItem] = useRemoveWishlistItemMutation();
  const [addCartItem] = useAddCartItemMutation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const favorites: WishlistItem[] = wishlistResponse?.data || [];

  const categories = useMemo(() => {
    const cats = new Set<string>();
    favorites.forEach((item) => {
      if (item.category) cats.add(item.category);
      else if (item.category_name) cats.add(item.category_name);
    });
    return ["All", ...Array.from(cats)];
  }, [favorites]);

  const filteredFavorites = useMemo(() => {
    if (activeCategory === "All") {
      return favorites;
    }
    return favorites.filter(
      (item) => (item.category || item.category_name) === activeCategory
    );
  }, [favorites, activeCategory]);

  const handleRemove = async (productId: number) => {
    try {
      setRemovingId(productId);
      await removeWishlistItem(productId).unwrap();
      toast.success("Item removed from favorites");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (product: WishlistItem) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    try {
      await addCartItem({ productId: Number(product.id), quantity: 1 }).unwrap();
      setAddedItems((current) =>
        current.includes(product.id) ? current : [...current, product.id]
      );
      toast.success(`${product.name} added to cart! 🛒`);

      setTimeout(() => {
        setAddedItems((current) =>
          current.filter((itemId) => itemId !== product.id)
        );
      }, 1200);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-body)] mt-[60px]">
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
                  <Heart size={18} fill="currentColor" />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-primary-light)]">
                  Your Collection
                </p>
              </div>

              <h1 className="mt-3 text-3xl font-black sm:text-4xl text-white">
                Favorites
              </h1>

              <p className="mt-2 max-w-lg text-xs leading-5 text-white/80">
                Keep your favourite food close. Order them whenever you crave
                something delicious.
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
      {user && (
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
                <Heart size={20} fill="currentColor" />
              </div>

              <div>
                <p className="text-xs font-black text-[var(--color-text-primary)]">
                  {favorites.length} Favourite {favorites.length === 1 ? "Item" : "Items"}
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
      )}

      {/* =====================================================
          CATEGORY FILTER
      ===================================================== */}
      {user && categories.length > 2 && (
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
      )}

      {/* =====================================================
          FAVORITE PRODUCTS / EMPTY / AUTH REQUIRED STATE
      ===================================================== */}
      <section className="mx-auto max-w-6xl px-5 py-6 pb-16 sm:px-8">
        {!user ? (
          /* NOT LOGGED IN */
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
              <Heart size={34} strokeWidth={1.7} />
            </div>

            <h2 className="mt-6 text-xl font-black text-[var(--color-text-primary)]">
              Sign in to view Favorites
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--color-text-muted)]">
              Please sign in to save your favorite dishes and order them anytime.
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
                px-6
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
              Browse Menu
            </Link>
          </div>
        ) : isLoading ? (
          /* LOADING SPINNER */
          <div className="flex flex-col items-center justify-center py-20">
            <LoaderCircle
              size={40}
              className="animate-spin text-[var(--color-primary)]"
            />
            <p className="mt-4 text-xs font-semibold text-[var(--color-text-muted)]">
              Loading your favorites...
            </p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          /* EMPTY STATE */
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
              <Heart size={34} strokeWidth={1.7} />
            </div>

            <h2 className="mt-6 text-xl font-black text-[var(--color-text-primary)]">
              No favourites yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--color-text-muted)]">
              Start exploring our menu and tap the heart icon on items you love.
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
          /* PRODUCT GRID */
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
              const isItemRemoving = removingId === product.id;

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
                  {/* IMAGE */}
                  <div className="relative h-56 overflow-hidden bg-stone-100">
                    <Link href={`/product/${product.id}`} className="block h-full w-full">
                      <img
                        src={product.img || "/images/placeholder.png"}
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
                    </Link>

                    {/* Overlay */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        bottom-0
                        h-24
                        bg-gradient-to-t
                        from-black/50
                        to-transparent
                      "
                    />

                    {/* Remove favorite button */}
                    <button
                      type="button"
                      disabled={isItemRemoving}
                      onClick={() => handleRemove(product.id)}
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
                        disabled:opacity-50
                      "
                    >
                      {isItemRemoving ? (
                        <LoaderCircle size={18} className="animate-spin text-red-500" />
                      ) : (
                        <Heart size={18} fill="currentColor" />
                      )}
                    </button>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                      {product.category || product.category_name || "Food"}
                    </p>

                    <Link href={`/product/${product.id}`}>
                      <h2 className="mt-1.5 line-clamp-1 text-base font-black text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition">
                        {product.name}
                      </h2>
                    </Link>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-lg font-black text-[var(--color-text-primary)]">
                        {formatRupee(product.price)}
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
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
                        disabled={isItemRemoving}
                        onClick={() => handleRemove(product.id)}
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
                          disabled:opacity-50
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