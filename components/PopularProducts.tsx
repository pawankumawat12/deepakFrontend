"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  ShoppingCart,
  Star,
  Plus,
  Check,
} from "lucide-react";

import cartStore from "./cart/store";
import { useGetStoreProductsQuery } from "../redux/services/catalogApi";

export default function PopularProducts() {
  const { data: productResponse } = useGetStoreProductsQuery({ limit: 6 });
  const products = productResponse?.data || [];
  const [addedProduct, setAddedProduct] = React.useState<string | null>(
    null
  );

  /*
   * --------------------------------------------------
   * SHOW ONLY POPULAR PRODUCTS
   * --------------------------------------------------
   *
   * If your product data has `isPopular`,
   * `isBestSeller`, or `featured`, you can use that.
   *
   * For now we take the first 6 products.
   */

  const popularProducts = products.slice(0, 6);

  /*
   * --------------------------------------------------
   * ADD TO CART
   * --------------------------------------------------
   */

  const handleAddToCart = (product: any) => {
    try {
      /*
       * Adjust this call only if your cartStore
       * uses a different method name/signature.
       */

      cartStore.addToCart(product.id);

      setAddedProduct(product.id);

      window.dispatchEvent(new Event("sfc_cart_updated"));

      setTimeout(() => {
        setAddedProduct(null);
      }, 1200);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  /*
   * --------------------------------------------------
   * PRICE FORMAT
   * --------------------------------------------------
   */

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  /*
   * --------------------------------------------------
   * DISCOUNT
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * RATING
   * --------------------------------------------------
   */

  const getRating = (product: any) => {
    return product.rating ?? 4.8;
  };

  return (
    <section className="bg-[var(--bg-body)] px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex items-end justify-between">

          <div>
            {/* Small heading */}

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

            {/* Main heading */}

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

            {/* Description */}

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

          {/* View All */}

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

        {/* =================================================
            PRODUCTS
        ================================================= */}

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

            /*
             * Product image fallback
             */

            const image =
              product.img ||
              product.image ||
              product.imageUrl ||
              "";

            /*
             * Product name fallback
             */

            const name =
              product.name ||
              product.title ||
              "Delicious Food";

            /*
             * Price fallback
             */

            const price = Number(product.price ?? 0);

            const isAdded = addedProduct === product.id;

            return (
              <article
                key={product.id ?? index}
                className="
                  group
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
                "
              >

                {/* =================================================
                    IMAGE
                ================================================= */}

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

                  {/* Dark image gradient */}

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

                  {/* =================================================
                      BEST SELLER BADGE
                  ================================================= */}

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

                  {/* =================================================
                      DISCOUNT
                  ================================================= */}

                  {discount && (
                    <span
                      className="
                        absolute
                        right-3
                        top-3
                        rounded-full
                        bg-[var(--color-secondary)]
                        px-3
                        py-1.5
                        text-[10px]
                        font-black
                        text-white
                        shadow-md
                      "
                    >
                      {discount}% OFF
                    </span>
                  )}

                  {/* =================================================
                      RATING
                  ================================================= */}

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

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="p-4">

                  {/* Product name */}

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

                  {/* Description */}

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

                  {/* =================================================
                      BOTTOM
                  ================================================= */}

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >

                    {/* Price */}

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

                    {/* Add button */}

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(product)
                      }
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
                            : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] hover:-translate-y-0.5"
                        }
                      `}
                    >
                      {isAdded ? (
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

        {/* =================================================
            MOBILE VIEW ALL
        ================================================= */}

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
