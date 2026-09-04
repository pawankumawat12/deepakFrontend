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
  Minus,
  Check,
  Gift,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { useGetStoreProductsQuery } from "../redux/services/catalogApi";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "../redux/services/wishlistApi";
import {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
} from "../redux/services/cartApi";
import { useGetOffersQuery } from "../redux/services/offerApi";
import { getProductPrimaryOffer, formatOfferBadge } from "../utils/offerUtils";
import SkeletonLoader from "./SkeletonLoader";

export default function PopularProducts() {
  const router = useRouter();
  const user = useSelector(
    (state: { auth: { user: any | null } }) => state.auth.user
  );
  const { data: productResponse, isLoading } = useGetStoreProductsQuery({ limit: 6 });
  const products = productResponse?.data || [];
  const [addedProduct, setAddedProduct] = React.useState<string | null>(
    null
  );

  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !user,
  });
  const { data: cartResponse } = useGetCartQuery(undefined, {
    skip: !user,
  });
  const { data: offersData = [] } = useGetOffersQuery();
  const [toggleWishlist] = useToggleWishlistMutation();
  const [addCartItem] = useAddCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const cartItemsMap = React.useMemo(
    () =>
      new Map(
        (cartResponse?.data?.items || []).map((it) => [
          Number(it.id),
          it.quantity,
        ])
      ),
    [cartResponse]
  );

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
        toast.success("Added to favorites");
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
    const isMadeToOrder = product.isMadeToOrder ||
      String(product.availability_type || "").toUpperCase() === "MADE_TO_ORDER";
    if (!isMadeToOrder && Number(product.stock) <= 0) {
      toast.error("Product is out of stock");
      return;
    }
    try {
      await addCartItem({ productId: Number(product.id), quantity: 1 }).unwrap();
      setAddedProduct(product.id);
      toast.success("Added to cart");
      setTimeout(() => {
        setAddedProduct(null);
      }, 1200);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add product to cart");
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


  const getRatingInfo = (product: any) => {
    const totalReviews = Number(product.total_reviews || product.reviews_count || 0);
    const avgRating = Number(product.rating || product.average_rating || 0);
    return {
      totalReviews,
      avgRating,
      hasReviews: totalReviews > 0 && avgRating > 0,
      displayRating: totalReviews > 0 && avgRating > 0 ? avgRating.toFixed(1) : "New",
    };
  };

  return (
    <section className="bg-[var(--bg-body)] px-4 py-6 md:px-8 md:py-10">
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
            style={{color:"white"}}
          >
            View All

            <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <SkeletonLoader
            variant="product"
            count={6}
            gridClassName="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          />
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
            {popularProducts.map((product: any, index: number) => {
            const discount = getDiscount(product);
            const ratingInfo = getRatingInfo(product);

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
            const isMadeToOrder = product.isMadeToOrder ||
              String(product.availability_type || "").toUpperCase() === "MADE_TO_ORDER";
            const outOfStock = !isMadeToOrder && Number(product.stock) <= 0;
            const inCartQty = cartItemsMap.get(Number(product.id)) || 0;

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

                  {/* Applicable Offer Badge */}
                  {(() => {
                    const offer = getProductPrimaryOffer(product, offersData);
                    if (!offer) return null;
                    const badgeText = formatOfferBadge(offer);
                    const isProductSpecific =
                      offer.is_product_specific ||
                      (Array.isArray(offer.target_product_ids) &&
                        offer.target_product_ids
                          .map(Number)
                          .includes(Number(product.id)));

                    return (
                      <div
                        className={`absolute left-3 bottom-3 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-white shadow-md backdrop-blur-xs ${
                          isProductSpecific ? "bg-amber-500" : "bg-emerald-600"
                        }`}
                      >
                        <Gift size={11} />
                        {badgeText}
                      </div>
                    );
                  })()}


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

                  {/* Dynamic Rating Pill */}
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
                      size={12}
                      fill="currentColor"
                      className="text-[var(--color-star)] shrink-0"
                    />

                    <span className="font-black text-[var(--color-text-primary)]">
                      {ratingInfo.displayRating}
                    </span>

                    <span className="text-[10px] font-medium text-[var(--color-text-muted)]">
                      ({ratingInfo.totalReviews})
                    </span>
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


                    {inCartQty > 0 ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="
                          flex
                          h-10
                          items-center
                          gap-1
                          rounded-xl
                          bg-[var(--color-primary-50)]
                          p-1
                          ring-1
                          ring-[var(--color-primary)]/15
                        "
                      >
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChangeQty(
                              Number(product.id),
                              inCartQty - 1,
                              Number(product.stock || 999),
                              isMadeToOrder
                            );
                          }}
                          className="
                            flex
                            h-8
                            w-8
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
                            min-w-[26px]
                            text-center
                            text-xs
                            font-black
                            text-[var(--color-primary)]
                          "
                        >
                          {inCartQty}
                        </span>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          title={
                            !isMadeToOrder && inCartQty >= Number(product.stock)
                              ? `Only ${product.stock} items available in stock`
                              : "Increase quantity"
                          }
                          disabled={!isMadeToOrder && inCartQty >= Number(product.stock)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChangeQty(
                              Number(product.id),
                              inCartQty + 1,
                              Number(product.stock || 999),
                              isMadeToOrder
                            );
                          }}
                          className="
                            flex
                            h-8
                            w-8
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
                            Add to Cart
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        )}

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
