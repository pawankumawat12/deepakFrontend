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
  Minus,
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
import {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
} from "../redux/services/cartApi";

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

  const { data: cartResponse } = useGetCartQuery(undefined, {
    skip: !user,
  });

  const [removeWishlistItem] = useRemoveWishlistItemMutation();
  const [addCartItem] = useAddCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const [activeCategory, setActiveCategory] = useState("All");
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const cartItemsMap = useMemo(
    () =>
      new Map(
        (cartResponse?.data?.items || []).map((it) => [
          Number(it.id),
          it.quantity,
        ])
      ),
    [cartResponse]
  );

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

  const handleChangeQty = async (
    productId: number,
    nextQty: number,
    maxStock: number,
    isMadeToOrder?: boolean
  ) => {
    if (!user) {
      toast.error("Please sign in to modify cart");
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    if (!isMadeToOrder && nextQty > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`);
      return;
    }
    try {
      await updateCartItem({ productId, quantity: nextQty }).unwrap();
      if (nextQty === 0) {
        toast.success("Removed from cart");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update quantity");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-body)]">
      <section className="relative overflow-hidden bg-[var(--color-primary-dark)]">
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

              <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
                Favorite Items
              </h1>

              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                The food you love the most, saved in one place for quick reordering.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-white
                  backdrop-blur-md
                "
              >
                <ShoppingBag size={15} />
                <span>{favorites.length} Saved Items</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {!user ? (
          <div
            className="
              mx-auto
              max-w-md
              rounded-3xl
              border
              border-[var(--color-border)]
              bg-white
              p-8
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
              "
            >
              <LogIn size={26} />
            </div>

            <h2 className="mt-4 text-lg font-black text-[var(--color-text-primary)]">
              Sign in to view favorites
            </h2>

            <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
              Log in to see the dishes you have saved and reorder them anytime.
            </p>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("sfc_open_login"))}
              className="
                mt-6
                inline-flex
                w-full
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
                shadow-md
                transition
                hover:bg-[var(--color-primary-dark)]
              "
            >
              Sign In
            </button>
          </div>
        ) : isLoading || isFetching ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoaderCircle
              size={34}
              className="animate-spin text-[var(--color-primary)]"
            />
            <p className="mt-4 text-xs font-semibold text-[var(--color-text-muted)]">
              Loading your favorites...
            </p>
          </div>
        ) : error ? (
          <div
            className="
              mx-auto
              max-w-md
              rounded-3xl
              border
              border-red-100
              bg-red-50/70
              p-8
              text-center
            "
          >
            <p className="text-sm font-bold text-red-700">
              Could not load your favorites
            </p>
            <p className="mt-1 text-xs text-red-500">
              Please check your connection and try again.
            </p>
          </div>
        ) : favorites.length === 0 ? (
          <div
            className="
              mx-auto
              max-w-lg
              rounded-3xl
              border
              border-dashed
              border-[var(--color-border)]
              bg-white
              p-10
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-red-50
                text-red-500
              "
            >
              <Heart size={28} />
            </div>

            <h2 className="mt-4 text-lg font-black text-[var(--color-text-primary)]">
              No favorites saved yet
            </h2>

            <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
              Explore our menu and tap the heart icon on any dish to save it here for fast ordering.
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
              <ShoppingCart size={15} />
              Browse Menu
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
              const isItemRemoving = removingId === product.id;
              const inCartQty = cartItemsMap.get(Number(product.id)) || 0;
              const inCart = inCartQty > 0;
              const isMadeToOrder = Boolean(
                (product as any).isMadeToOrder ||
                String((product as any).availability_type || "").toUpperCase() === "MADE_TO_ORDER"
              );

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

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-lg font-black text-[var(--color-text-primary)]">
                        {formatRupee(product.price)}
                      </span>

                      <div className="flex items-center gap-1 rounded-full bg-[var(--color-star)]/10 px-2 py-0.5 text-xs font-bold text-[var(--color-text-primary)]">
                        <Star size={11} fill="currentColor" className="text-[var(--color-star)]" />
                        <span>
                          {Number(product.total_reviews || 0) > 0 && Number(product.rating || 0) > 0
                            ? Number(product.rating).toFixed(1)
                            : "New"}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-normal">
                          ({Number(product.total_reviews || 0)})
                        </span>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 flex gap-2">
                      {inCart ? (
                        <div
                          className="
                            flex
                            flex-1
                            h-11
                            items-center
                            justify-between
                            gap-1.5
                            rounded-xl
                            bg-[var(--color-primary-50)]
                            p-1
                            ring-1
                            ring-[var(--color-primary)]/20
                          "
                        >
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              handleChangeQty(
                                Number(product.id),
                                inCartQty - 1,
                                Number(product.stock || 999),
                                isMadeToOrder
                              )
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-white
                              text-[var(--color-primary)]
                              shadow-xs
                              transition
                              hover:bg-[var(--color-primary)]
                              hover:text-white
                              active:scale-90
                            "
                          >
                            <Minus size={14} strokeWidth={3} />
                          </button>

                          <span
                            className="
                              text-xs
                              font-black
                              text-[var(--color-primary)]
                            "
                          >
                            {inCartQty} in cart
                          </span>

                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={
                              !isMadeToOrder &&
                              product.stock !== undefined &&
                              inCartQty >= Number(product.stock)
                            }
                            onClick={() =>
                              handleChangeQty(
                                Number(product.id),
                                inCartQty + 1,
                                Number(product.stock || 999),
                                isMadeToOrder
                              )
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-[var(--color-primary)]
                              text-white
                              shadow-xs
                              transition
                              hover:bg-[var(--color-primary-dark)]
                              disabled:cursor-not-allowed
                              disabled:opacity-40
                              active:scale-90
                            "
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className={`
                            flex
                            flex-1
                            h-11
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
                      )}

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