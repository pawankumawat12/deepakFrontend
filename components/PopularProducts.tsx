"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Flame,
  Heart,
  ShoppingCart,
  Star,
  Plus,
  Check,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { useGetStoreProductsQuery } from "../redux/services/catalogApi";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "../redux/services/wishlistApi";
import { useAddCartItemMutation } from "../redux/services/cartApi";

export default function PopularProducts() {
  const router = useRouter();
  const user = useSelector(
    (state: { auth: { user: any | null } }) => state.auth.user
  );
  const { data: productResponse } = useGetStoreProductsQuery({ limit: 6 });
  const products = productResponse?.data || [];
  const [addedProduct, setAddedProduct] = React.useState<string | null>(
    null
  );

  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !user,
  });
  const [toggleWishlist] = useToggleWishlistMutation();
  const [addCartItem] = useAddCartItemMutation();

  const wishlistedIds = React.useMemo(
    () =>
      new Set(
        (wishlistData?.data || []).map((w) => Number(w.id || w.product_id))
      ),
    [wishlistData]
  );

  const handleToggleWishlist = async (
    productId: number | string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to save favorites");
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    try {
      const res = await toggleWishlist({
        productId: Number(productId),
      }).unwrap();
      if (res.inWishlist) {
        toast.success("Added to favorites ❤️");
      } else {
        toast.success("Removed from favorites");
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  const popularProducts = products.slice(0, 6);

  const handleAddToCart = async (product: any) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    if (Number(product.stock) <= 0) {
      toast.error("Product is out of stock");
      return;
    }
    try {
      await addCartItem({ productId: Number(product.id), quantity: 1 }).unwrap();
      setAddedProduct(product.id);
      toast.success("Added to cart 🛒");
      setTimeout(() => {
        setAddedProduct(null);
      }, 1200);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add product to cart");
    }
  };


  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const getDiscount = (product: any) => {
    if (!product.originalPrice || !product.price) {
      return null;
    }

    if (product.originalPrice <= product.price) {
      return null;
    }

    return Math.round(
      ((product.originalPrice - product.price) /
        product.originalPrice) *
        100
    );
  };


  const getRating = (product: any) => {
    return product.rating ?? 4.8;
  };

  return (
    <section className="bg-[var(--bg-body)] px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-end justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-[var(--color-secondary)]/10
                  text-[var(--color-secondary)]
                "
              >
                <Flame size={14} fill="currentColor" />
              </span>

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--color-primary)]
                "
              >
                Customer Favorites
              </span>
            </div>

            <h2
              className="
                text-3xl
                font-black
                tracking-tight
                text-[var(--color-text-primary)]
                md:text-4xl
              "
            >
              Popular Picks
            </h2>
            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-[var(--color-text-secondary)]
                md:text-base
              "
            >
              Our most-loved dishes, freshly prepared and
              ready to make your day delicious.
            </p>
          </div>

          <Link
            href="/menu"
            className="
              hidden
              items-center
              gap-2
              rounded-xl
              bg-[var(--color-primary)]
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              shadow-sm
              transition
              hover:bg-[var(--color-primary-dark)]
              sm:inline-flex
            "
          >
            View All

            <ArrowRight size={16} />
          </Link>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {popularProducts.map((product: any, index: number) => {
            const discount = getDiscount(product);
            const rating = getRating(product);

            const image =
              product.img ||
              product.image ||
              product.imageUrl ||
              "";

            const name =
              product.name ||
              product.title ||
              "Delicious Food";

            const price = Number(product.price ?? 0);
            const outOfStock = Number(product.stock) <= 0;

            const isAdded = addedProduct === product.id;

            return (
              <article
                key={product.id ?? index}
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/product/${product.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/product/${product.id}`);
                  }
                }}
                className={`
                  group
                  cursor-pointer
                  ${outOfStock ? "opacity-55 grayscale" : ""}
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[var(--color-primary)]
                  hover:shadow-[0_18px_40px_rgba(79,125,22,0.13)]
                `}
              >
                <div className="relative h-56 overflow-hidden">

                  <img
                    src={image}
                    alt={name}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-x-0
                      bottom-0
                      h-24
                      bg-gradient-to-t
                      from-black/40
                      to-transparent
                    "
                  />

              
                  <div
                    className="
                      absolute
                      left-3
                      top-3
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-[var(--color-primary)]
                      px-3
                      py-1.5
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-white
                      shadow-md
                    "
                  >
                    <Flame
                      size={12}
                      fill="currentColor"
                    />

                    Best Seller
                  </div>

                  {outOfStock && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45">
                      <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[var(--color-text-primary)]">
                        Out of stock
                      </span>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(product.id, e)}
                    aria-label="Save to favorites"
                    className="
                      absolute
                      right-3
                      top-3
                      z-20
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-white/95
                      shadow-md
                      backdrop-blur-md
                      transition
                      hover:scale-110
                      active:scale-95
                    "
                  >
                    <Heart
                      size={16}
                      className={
                        wishlistedIds.has(Number(product.id))
                          ? "fill-red-500 text-red-500"
                          : "text-stone-600 hover:text-red-400"
                      }
                    />
                  </button>

                  {discount && (
                    <span
                      className="
                        absolute
                        left-3
                        bottom-10
                        rounded-full
                        bg-[var(--color-secondary)]
                        px-2.5
                        py-1
                        text-[9px]
                        font-black
                        text-white
                        shadow-md
                      "
                    >
                      {discount}% OFF
                    </span>
                  )}

                  <div
                    className="
                      absolute
                      bottom-3
                      left-3
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-white/95
                      px-2.5
                      py-1
                      text-xs
                      font-bold
                      text-[var(--color-text-primary)]
                      shadow-sm
                      backdrop-blur
                    "
                  >
                    <Star
                      size={13}
                      fill="currentColor"
                      className="text-[var(--color-secondary)]"
                    />

                    {rating}
                  </div>
                </div>

                <div className="p-4">

                  <h3
                    className="
                      line-clamp-1
                      text-lg
                      font-extrabold
                      text-[var(--color-text-primary)]
                    "
                  >
                    {name}
                  </h3>

                  <p
                    className="
                      mt-1
                      line-clamp-2
                      min-h-[40px]
                      text-xs
                      leading-5
                      text-[var(--color-text-muted)]
                    "
                  >
                    {product.description ||
                      "Freshly prepared with quality ingredients and delicious flavors."}
                  </p>

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >

                    <div className="flex items-center gap-2">

                      <span
                        className="
                          text-xl
                          font-black
                          text-[var(--color-primary)]
                        "
                      >
                        {formatPrice(price)}
                      </span>

                      {product.originalPrice &&
                        product.originalPrice > price && (
                          <span
                            className="
                              text-xs
                              font-medium
                              text-[var(--color-text-muted)]
                              line-through
                            "
                          >
                            {formatPrice(
                              Number(product.originalPrice)
                            )}
                          </span>
                        )}
                    </div>


                    <button
                      type="button"
                      disabled={outOfStock}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (outOfStock) return;
                        handleAddToCart(product);
                      }}
                      className={`
                        flex
                        h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        px-4
                        text-xs
                        font-bold
                        text-white
                        shadow-sm
                        transition-all
                        duration-200
                        ${
                          isAdded
                            ? "bg-[var(--color-success)]"
                            : outOfStock
                              ? "cursor-not-allowed bg-[var(--color-text-muted)]"
                              : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] hover:-translate-y-0.5"
                        }
                      `}
                    >
                      {outOfStock ? (
                        "Out of stock"
                      ) : isAdded ? (
                        <>
                          <Check size={15} />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-7 flex justify-center sm:hidden">
          <Link
            href="/menu"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[var(--color-primary)]
              px-6
              py-3
              text-sm
              font-bold
              text-white
              shadow-md
              transition
              hover:bg-[var(--color-primary-dark)]
            "
          >
            View Full Menu
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
