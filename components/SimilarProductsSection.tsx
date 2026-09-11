"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import {
  Sparkles,
  ChevronRight,
  Star,
  Heart,
  Plus,
  Check,
  Utensils,
  Gift,
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetStoreProductsQuery } from "../redux/services/catalogApi";
import { useGetOffersQuery } from "../redux/services/offerApi";
import { getProductPrimaryOffer, formatOfferBadge } from "../utils/offerUtils";
import {
  useGetCartQuery,
  useAddCartItemMutation,
} from "../redux/services/cartApi";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "../redux/services/wishlistApi";
import {
  getGuestCart,
  addGuestCartItem,
  subscribeGuestCart,
  GuestCartItem,
} from "../lib/guestCart";
import { toAssetUrl } from "../utils/backendUrl";

interface SimilarProductsSectionProps {
  currentProductId: number | string;
  categoryId?: number | string;
  categoryName?: string;
  currentProductName?: string;
}

export default function SimilarProductsSection({
  currentProductId,
  categoryId,
  categoryName,
  currentProductName,
}: SimilarProductsSectionProps) {
  const user = useSelector(
    (state: { auth: { user: any | null } }) => state.auth.user
  );

  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !user,
  });
  const [toggleWishlist] = useToggleWishlistMutation();

  const { data: cartResponse } = useGetCartQuery(undefined, {
    skip: !user,
  });
  const [addCartItem] = useAddCartItemMutation();

  const [guestCartItems, setGuestCartItems] = useState<GuestCartItem[]>([]);

  useEffect(() => {
    setGuestCartItems(getGuestCart());
    const unsubscribe = subscribeGuestCart((items) => {
      setGuestCartItems(items);
    });
    return unsubscribe;
  }, []);

  const { data: storeProductsResponse, isLoading } = useGetStoreProductsQuery({
    isActive: true,
  });
  const { data: offersData = [] } = useGetOffersQuery();

  const similarProducts = React.useMemo(() => {
    const all = storeProductsResponse?.data || [];
    const currentId = Number(currentProductId);
    const catIdStr = String(categoryId || "");

    let sameCategory = all.filter(
      (p: any) =>
        Number(p.id) !== currentId &&
        (String(p.category_id || "") === catIdStr ||
          String(p.category || "") === catIdStr)
    );

    if (sameCategory.length < 8) {
      const others = all.filter(
        (p: any) =>
          Number(p.id) !== currentId &&
          !sameCategory.some((s: any) => Number(s.id) === Number(p.id))
      );
      sameCategory = [...sameCategory, ...others];
    }

    return sameCategory.slice(0, 8);
  }, [storeProductsResponse, currentProductId, categoryId]);

  const isProductWishlisted = (id: number) => {
    return Boolean(
      (wishlistData?.data || []).some(
        (w: any) => Number(w.id || w.product_id) === id
      )
    );
  };

  const getInCartQty = (id: number) => {
    if (user) {
      const item = (cartResponse?.data?.items || []).find(
        (c: any) => Number(c.id || c.product_id) === id
      );
      return item ? item.quantity : 0;
    }
    const item = guestCartItems.find((c) => Number(c.productId) === id);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = async (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pid = Number(product.id);
    const isMTO = Boolean(
      product.isMadeToOrder ||
        String(product.availability_type || "").toUpperCase() === "MADE_TO_ORDER"
    );
    const stock = Number(product.stock || 0);

    if (!isMTO && stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    if (!user) {
      const res = addGuestCartItem(pid, 1, stock, isMTO);
      if (res.success) {
        toast.success(`Added ${product.name} to cart`);
      } else {
        toast.error(res.message || "Could not add to cart");
      }
      return;
    }

    try {
      await addCartItem({ productId: pid, quantity: 1 }).unwrap();
      toast.success(`Added ${product.name} to cart`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleToggleWishlist = async (pid: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    try {
      const res = await toggleWishlist({ productId: pid }).unwrap();
      if (res.inWishlist) {
        toast.success("Added to favorites");
      } else {
        toast.success("Removed from favorites");
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  if (!isLoading && similarProducts.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 sm:p-7 md:p-8 shadow-sm">
        {/* Section Header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--color-border)] pb-5">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                <Sparkles size={14} />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[var(--color-primary)]">
                Recommended For You
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--color-text-primary)]">
              Similar Products
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {currentProductName
                ? `Customers who viewed`
                : "Handcrafted selections you might like."}
            </p>
          </div>

          <Link
            href={`/menu${categoryId ? `?category=${categoryId}` : ""}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] hover:underline self-start sm:self-auto"
          >
            <span>View All in {categoryName || "Menu"}</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-[var(--color-border)] p-3"
              >
                <div className="h-40 rounded-xl bg-stone-200" />
                <div className="mt-3 h-4 w-3/4 rounded bg-stone-200" />
                <div className="mt-2 h-3 w-1/2 rounded bg-stone-100" />
                <div className="mt-4 flex justify-between">
                  <div className="h-5 w-16 rounded bg-stone-200" />
                  <div className="h-8 w-20 rounded-xl bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {similarProducts.map((rel: any) => {
              const relRating = Number(rel.rating || 0);
              const relReviews = Number(rel.total_reviews || 0);
              const isMTO = Boolean(
                rel.isMadeToOrder ||
                  String(rel.availability_type || "").toUpperCase() ===
                    "MADE_TO_ORDER"
              );
              const isOut = !isMTO && Number(rel.stock) <= 0;
              const inCartCount = getInCartQty(Number(rel.id));
              const isFav = isProductWishlisted(Number(rel.id));
              const displayImg = toAssetUrl(
                (Array.isArray(rel.images) && rel.images[0]) ||
                rel.img ||
                rel.image
              );

              const offer = getProductPrimaryOffer(rel, offersData);
              const badgeText = offer ? formatOfferBadge(offer) : "";
              const isProductSpecific = Boolean(
                offer?.is_product_specific ||
                (Array.isArray(offer?.target_product_ids) &&
                  offer.target_product_ids.map(Number).includes(Number(rel.id)))
              );

              const originalPrice = Number(rel.price || 0);
              let discountedPrice: number | null = null;
              if (offer && offer.type === "PERCENTAGE" && Number(offer.discount_value) > 0) {
                discountedPrice = Math.max(0, originalPrice - (originalPrice * Number(offer.discount_value)) / 100);
              } else if (offer && offer.type === "FLAT" && Number(offer.discount_value) > 0) {
                discountedPrice = Math.max(0, originalPrice - Number(offer.discount_value));
              }

              return (
                <article
                  key={rel.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/40 hover:shadow-lg"
                >
                  {/* Image Area */}
                  <div className="relative aspect-square w-full overflow-hidden bg-stone-50">
                    <Link
                      href={`/product/${rel.id}`}
                      className="block h-full w-full"
                    >
                      {displayImg ? (
                        <Image
                          src={displayImg}
                          alt={rel.name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-stone-300">
                          <Utensils size={32} />
                        </div>
                      )}
                    </Link>

                    {/* Stock/MTO Badge */}
                    {isOut && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-black uppercase text-white backdrop-blur-[2px]">
                        Out of Stock
                      </div>
                    )}

                    {/* Applicable Offer Badge on Image */}
                    {offer && (
                      <div
                        className={`absolute left-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white shadow-md backdrop-blur-xs ${
                          isProductSpecific
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-emerald-600 to-teal-600"
                        }`}
                      >
                        <Gift size={10} />
                        <span>{badgeText}</span>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(Number(rel.id), e)}
                      aria-label="Save to favorites"
                      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition hover:scale-110 active:scale-95"
                    >
                      <Heart
                        size={15}
                        className={
                          isFav
                            ? "fill-red-500 text-red-500"
                            : "text-stone-500 hover:text-red-500"
                        }
                      />
                    </button>

                    {/* Category Tag */}
                    {(rel.categoryName || rel.category_name) && (
                      <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs">
                        {rel.categoryName || rel.category_name}
                      </div>
                    )}
                  </div>

                  {/* Product Details Content */}
                  <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
                    <div>
                      <Link
                        href={`/product/${rel.id}`}
                        className="block group-hover:text-[var(--color-primary)] transition-colors"
                      >
                        <h3 className="line-clamp-1 text-xs sm:text-sm font-black text-[var(--color-text-primary)]">
                          {rel.name}
                        </h3>
                      </Link>

                      {/* Flipkart Green Star Rating Badge */}
                      <div className="mt-1.5 flex items-center gap-2">
                        {relRating > 0 ? (
                          <div
                            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs ${
                              relRating >= 3.8
                                ? "bg-emerald-600"
                                : relRating >= 2.5
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                          >
                            <span>{relRating.toFixed(1)}</span>
                            <Star size={10} fill="white" className="text-white" />
                          </div>
                        ) : (
                          <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-stone-500">
                            New
                          </span>
                        )}
                        {relReviews > 0 && (
                          <span className="text-[10px] font-medium text-stone-400">
                            ({relReviews})
                          </span>
                        )}
                      </div>

                      {/* Offer promo highlight line */}
                      {offer && (
                        <div className="mt-1.5 flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                          <Gift size={11} className="shrink-0 text-emerald-600" />
                          <span className="truncate">{offer.title || badgeText}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom: Price & Add Button */}
                    <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)]/60 pt-2.5">
                      <div>
                        <span className="text-[10px] font-bold text-[var(--color-text-muted)]">
                          Price
                        </span>
                        {discountedPrice !== null ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm sm:text-base font-black text-[var(--color-primary)]">
                              ₹{Math.round(discountedPrice).toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs text-stone-400 line-through">
                              ₹{originalPrice.toLocaleString("en-IN")}
                            </span>
                          </div>
                        ) : (
                          <div className="text-sm sm:text-base font-black text-[var(--color-text-primary)]">
                            ₹{originalPrice.toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(rel, e)}
                        disabled={isOut}
                        className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-black shadow-xs transition-all active:scale-95 ${
                          isOut
                            ? "cursor-not-allowed bg-stone-200 text-stone-400"
                            : inCartCount > 0
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                        }`}
                      >
                        {inCartCount > 0 ? (
                          <>
                            <Check size={12} />
                            <span>({inCartCount})</span>
                          </>
                        ) : (
                          <>
                            <Plus size={13} />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

