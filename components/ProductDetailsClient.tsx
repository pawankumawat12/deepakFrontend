"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  Utensils,
  Leaf,
  Zap,
  Edit2,
  Trash2,
  MessageSquare,
  Sparkles,
  AlertCircle,
  X,
  Loader2,
  User,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "../redux/services/wishlistApi";
import {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
} from "../redux/services/cartApi";
import {
  useGetProductReviewsQuery,
  useCreateProductReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  ReviewItem,
} from "../redux/services/reviewApi";
import { useGetOffersQuery } from "../redux/services/offerApi";
import { Gift } from "lucide-react";

export default function ProductDetailsClient({ product }: { product: any }) {
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
  const [updateCartItem] = useUpdateCartItemMutation();

  const inCartItem = (cartResponse?.data?.items || []).find(
    (c) => Number(c.id) === Number(product.id)
  );
  const inCartQty = inCartItem?.quantity || null;

  const isWishlisted = Boolean(
    (wishlistData?.data || []).some(
      (w) => Number(w.id || w.product_id) === Number(product.id)
    )
  );

  const { data: availableOffers = [] } = useGetOffersQuery();
  const bogoOffer = (availableOffers || []).find(
    (o) =>
      o.is_active &&
      o.type === "BOGO" &&
      (o.target_product_ids || []).map(Number).includes(Number(product.id))
  );

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    try {
      const res = await toggleWishlist({
        productId: Number(product.id),
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

  const imgRef = useRef<HTMLImageElement | null>(null);

  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState<number>(1);

  const [reviewPage, setReviewPage] = useState(1);
  const [allReviews, setAllReviews] = useState<ReviewItem[]>([]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data: reviewsResponse,
    isLoading: isReviewsLoading,
    isFetching: isReviewsFetching,
  } = useGetProductReviewsQuery({
    productId: product.id,
    page: reviewPage,
    limit: 6,
  });

  const [createProductReview, { isLoading: isCreatingReview }] =
    useCreateProductReviewMutation();
  const [updateReview, { isLoading: isUpdatingReview }] =
    useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeletingReview }] =
    useDeleteReviewMutation();

  // Accumulate reviews as new pages load
  useEffect(() => {
    if (reviewsResponse?.data?.reviews) {
      const incoming = reviewsResponse.data.reviews;
      if (reviewPage === 1) {
        setAllReviews(incoming);
      } else {
        setAllReviews((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const uniqueNew = incoming.filter((r) => !existingIds.has(r.id));
          return [...prev, ...uniqueNew];
        });
      }
    }
  }, [reviewsResponse, reviewPage]);

  const reviewSummary = reviewsResponse?.data?.summary || {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };
  const totalReviews = Number(reviewSummary.totalReviews || 0);
  const averageRating = Number(reviewSummary.averageRating || 0);
  const ratingDistribution = reviewSummary.ratingDistribution || {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };
  const pagination = reviewsResponse?.data?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  };
  const hasMore = Boolean(
    pagination.hasMore || reviewPage < pagination.totalPages
  );

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isReviewsFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isReviewsFetching) {
          setReviewPage((prev) => prev + 1);
        }
      },
      { rootMargin: "150px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isReviewsFetching]);

  // Form State
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

  // User's own review
  const userOwnReview = user
    ? allReviews.find((r) => Number(r.user_id) === Number(user.id))
    : null;

  const handleOpenWriteReview = () => {
    if (!user) {
      toast.error("Please sign in to write a review");
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    if (userOwnReview) {
      setEditingReviewId(userOwnReview.id);
      setRating(userOwnReview.rating);
      setTitle(userOwnReview.title || "");
      setComment(userOwnReview.comment);
    } else {
      setEditingReviewId(null);
      setRating(5);
      setTitle("");
      setComment("");
    }
    setIsWritingReview(true);
    setTimeout(() => {
      const el = document.getElementById("review-form");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleEditReview = (rev: ReviewItem) => {
    setEditingReviewId(rev.id);
    setRating(rev.rating);
    setTitle(rev.title || "");
    setComment(rev.comment);
    setIsWritingReview(true);
    setTimeout(() => {
      const el = document.getElementById("review-form");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleCancelReviewForm = () => {
    setIsWritingReview(false);
    setEditingReviewId(null);
    setTitle("");
    setComment("");
    setRating(5);
    setHoveredRating(0);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to submit a review");
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    if (!comment.trim()) {
      toast.error("Please enter your review comment");
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }

    try {
      if (editingReviewId) {
        await updateReview({
          id: editingReviewId,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        }).unwrap();
        toast.success("Review updated successfully!");
      } else {
        await createProductReview({
          productId: Number(product.id),
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        }).unwrap();
        toast.success("Review submitted! Thank you for your feedback");
      }
      setReviewPage(1);
      handleCancelReviewForm();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  const handleDeleteReview = async (id: number) => {
    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted successfully");
      setDeletingReviewId(null);
      setReviewPage(1);
      if (editingReviewId === id) {
        handleCancelReviewForm();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete review");
    }
  };

  const ratingLabelMap: { [key: number]: string } = {
    5: "⭐⭐⭐⭐⭐ Excellent! Loved it",
    4: "⭐⭐⭐⭐ Very Good, enjoyed it",
    3: "⭐⭐⭐ Good, satisfied",
    2: "⭐⭐ Fair, could be better",
    1: "⭐ Poor, not as expected",
  };

  const getFlipkartRatingStyle = (r: number) => {
    if (r >= 4) return "bg-[#388e3c] text-white"; // Flipkart green
    if (r >= 3) return "bg-[#f5a623] text-white"; // Amber
    return "bg-[#e53935] text-white"; // Red
  };

  const getRatingSentiment = (avg: number) => {
    if (avg >= 4.5) return "Exceptional";
    if (avg >= 4.0) return "Very Good";
    if (avg >= 3.0) return "Good";
    if (avg >= 2.0) return "Fair";
    return "Poor";
  };

  function formatReviewDate(dateStr: string) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    requestAnimationFrame(() => el.classList.add("revealed"));
  }, []);

  const isMadeToOrder = Boolean(
    product?.isMadeToOrder ||
    String(product?.availability_type || "").toUpperCase() === "MADE_TO_ORDER"
  );
  const isOutOfStock = !isMadeToOrder && Number(product?.stock) <= 0;

  function formatRupee(v: number) {
    return Number(v).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }

  async function handleAdd() {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }
    try {
      await addCartItem({
        productId: Number(product.id),
        quantity: qty,
      }).unwrap();
      setAdded(true);
      toast.success("Added to cart");
      setTimeout(() => setAdded(false), 900);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add to cart");
    }
  }

  async function changeQty(newQty: number) {
    if (!user) {
      toast.error("Please sign in to modify cart");
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    if (!isMadeToOrder && newQty > Number(product.stock)) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }
    try {
      await updateCartItem({
        productId: Number(product.id),
        quantity: newQty,
      }).unwrap();
      if (newQty === 0) {
        toast.success("Removed from cart");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update quantity");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg-body)] pb-20">
      <div className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-xs md:px-8">
          <Link
            href="/menu"
            className="
              flex
              items-center
              gap-1.5
              font-semibold
              text-[var(--color-text-muted)]
              transition-colors
              hover:text-[var(--color-primary)]
            "
          >
            <ArrowLeft size={14} />
            Menu
          </Link>

          <ChevronRight size={13} className="text-[var(--color-text-muted)]" />

          <span className="truncate font-bold capitalize text-[var(--color-text-secondary)]">
            {product.categoryName || product.category}
          </span>

          <ChevronRight size={13} className="text-[var(--color-text-muted)]" />

          <span className="hidden truncate font-semibold text-[var(--color-text-primary)] sm:block">
            {product.name}
          </span>
        </div>
      </div>
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div
          className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-[1.05fr_0.95fr]
            lg:gap-10
          "
        >
          <div>
            <div
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-[var(--color-border)]
                bg-white
                shadow-sm
              "
            >
              <img
                ref={imgRef}
                src={product.img}
                alt={product.name}
                className="
                  detail-img
                  h-[320px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                  sm:h-[430px]
                  lg:h-[520px]
                "
              />

              {/* Image overlay */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  bottom-0
                  h-32
                  bg-gradient-to-t
                  from-black/40
                  to-transparent
                "
              />

              {/* Popular badge */}

              <div
                className="
                  absolute
                  left-4
                  top-4
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-[var(--color-secondary)]
                  px-3
                  py-1.5
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wide
                  text-white
                  shadow-lg
                "
              >
                <Flame size={13} />
                Popular Choice
              </div>

              {/* Wishlist Toggle Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label="Add to favorites"
                className="
                  absolute
                  right-4
                  top-4
                  z-20
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white/95
                  shadow-lg
                  backdrop-blur-md
                  transition
                  hover:scale-105
                  active:scale-95
                "
              >
                <Heart
                  size={20}
                  className={
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-stone-600 hover:text-red-500"
                  }
                />
              </button>

              {/* Category */}
              <div
                className="
                  absolute
                  left-4
                  bottom-4
                  rounded-full
                  bg-black/50
                  px-3
                  py-1
                  text-[10px]
                  font-bold
                  capitalize
                  text-white
                  shadow
                  backdrop-blur-md
                "
              >
                {product.categoryName || product.category}
              </div>
            </div>

            {/* Image info cards */}

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div
                className="
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-3
                  text-center
                  shadow-sm
                "
              >
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <Leaf size={16} />
                </div>

                <p className="mt-2 text-[9px] font-black text-[var(--color-text-secondary)] sm:text-[10px]">
                  Fresh
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-3
                  text-center
                  shadow-sm
                "
              >
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <Zap size={16} />
                </div>

                <p className="mt-2 text-[9px] font-black text-[var(--color-text-secondary)] sm:text-[10px]">
                  Quick
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-3
                  text-center
                  shadow-sm
                "
              >
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <Heart size={16} />
                </div>

                <p className="mt-2 text-[9px] font-black text-[var(--color-text-secondary)] sm:text-[10px]">
                  Loved
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            {/* Small label */}

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-secondary)]" />

              <span
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-[var(--color-secondary)]
                "
              >
                Freshly Prepared
              </span>
            </div>

            {/* Product title */}

            <h1
              className="
                mt-3
                text-3xl
                font-black
                leading-tight
                tracking-tight
                text-[var(--color-text-primary)]
                sm:text-4xl
                lg:text-5xl
              "
            >
              {product.name}
            </h1>

            {/* Dynamic Rating & Review Count (Flipkart Style) */}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("reviews-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="
                  group
                  flex
                  items-center
                  gap-2.5
                  transition
                  active:scale-95
                  text-left
                "
              >
                <div
                  className={`
                    flex
                    items-center
                    gap-1
                    rounded-md
                    px-2.5
                    py-1
                    text-xs
                    font-black
                    shadow-xs
                    ${totalReviews > 0
                      ? getFlipkartRatingStyle(averageRating)
                      : "bg-stone-500 text-white"
                    }
                  `}
                >
                  <span>
                    {totalReviews > 0 ? averageRating.toFixed(1) : "New"}
                  </span>
                  <Star
                    size={11}
                    fill="white"
                    className="text-white shrink-0"
                  />
                </div>

                <span className="text-xs font-bold text-[var(--color-primary)] group-hover:underline">
                  {totalReviews > 0
                    ? `${totalReviews.toLocaleString(
                      "en-IN"
                    )} Ratings & Reviews`
                    : "0 Ratings & Reviews"}
                </span>
              </button>

              <span className="text-xs text-[var(--color-text-muted)]">
                {totalReviews > 0
                  ? `· ${getRatingSentiment(
                    averageRating
                  )} choice by cafe guests`
                  : "· Be the first to review this dish"}
              </span>
            </div>

            {/* Price */}

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-white
                p-4
                shadow-sm
              "
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Price
              </p>

              <div className="mt-1 flex items-end gap-2">
                <span
                  className="
                    text-3xl
                    font-black
                    text-[var(--color-primary)]
                  "
                >
                  ₹{formatRupee(product.price)}
                </span>

                <span className="pb-1 text-xs text-[var(--color-text-muted)]">
                  / item
                </span>
              </div>
            </div>

            {/* BOGO Deal Banner */}
            {bogoOffer && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-3.5 text-amber-900 shadow-xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                  <Gift size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase tracking-wide text-amber-800">
                    Buy {bogoOffer.buy_qty || 1} Get {bogoOffer.get_qty || 1} Free Offer!
                  </p>
                  <p className="mt-0.5 text-[11px] text-amber-700">
                    Add at least {(bogoOffer.buy_qty || 1) + (bogoOffer.get_qty || 1)} items to your cart and apply promo code{" "}
                    <strong className="rounded bg-amber-200/80 px-1.5 py-0.5 font-black text-amber-950">
                      {bogoOffer.code}
                    </strong>{" "}
                    at checkout to get {bogoOffer.get_qty || 1} free.
                  </p>
                </div>
              </div>
            )}

            {/* Description */}

            <div className="mt-6">
              <h2 className="text-sm font-black text-[var(--color-text-primary)]">
                About this item
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  leading-7
                  text-[var(--color-text-secondary)]
                "
              >
                {product.description ||
                  "Delicious and freshly prepared at SFC Cafe with quality ingredients for a great taste in every bite."}
              </p>
            </div>

            {/* Product highlights */}

            <div className="mt-6 grid grid-cols-2 gap-2">
              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <Utensils size={17} />
                </div>

                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-primary)]">
                    Freshly Made
                  </p>

                  <p className="mt-0.5 text-[9px] text-[var(--color-text-muted)]">
                    Prepared on order
                  </p>
                </div>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <Clock3 size={17} />
                </div>

                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-primary)]">
                    Quick Service
                  </p>

                  <p className="mt-0.5 text-[9px] text-[var(--color-text-muted)]">
                    Fresh & ready fast
                  </p>
                </div>
              </div>
            </div>
            <div
              className="
                mt-7
                rounded-3xl
                border
                border-[var(--color-border)]
                bg-white
                p-4
                shadow-sm
                sm:p-5
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-[var(--color-text-primary)]">
                    Quantity
                  </p>

                  <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                    Choose how many you want
                  </p>
                </div>

                {/* Quantity */}

                {inCartQty ? (
                  <div className="flex flex-col items-end gap-1">
                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        rounded-full
                        bg-[var(--color-primary-50)]
                        p-1
                        ring-1
                        ring-[var(--color-primary)]/10
                      "
                    >
                      <button
                        type="button"
                        onClick={() => changeQty(Math.max(0, inCartQty - 1))}
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-[var(--color-primary)]
                          shadow-sm
                          transition
                          active:scale-90
                        "
                      >
                        <Minus size={15} strokeWidth={3} />
                      </button>

                      <span
                        className="
                          min-w-[34px]
                          text-center
                          text-sm
                          font-black
                          text-[var(--color-primary)]
                        "
                      >
                        {inCartQty}
                      </span>

                      <button
                        type="button"
                        title={
                          product.availability_type !== "MADE_TO_ORDER" &&
                            inCartQty >= Number(product.stock)
                            ? `Only ${product.stock} items available in stock`
                            : "Increase quantity"
                        }
                        disabled={
                          product.availability_type !== "MADE_TO_ORDER" &&
                          inCartQty >= Number(product.stock)
                        }
                        onClick={() => changeQty(inCartQty + 1)}
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-[var(--color-primary)]
                          text-white
                          shadow-sm
                          transition
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                          active:scale-90
                        "
                      >
                        <Plus size={15} strokeWidth={3} />
                      </button>
                    </div>

                    {product.availability_type === "MADE_TO_ORDER" ? (
                      <span className="text-[10px] font-bold text-orange-600">
                        Freshly Made to Order
                      </span>
                    ) : inCartQty >= Number(product.stock) ? (
                      <span className="text-[10px] font-bold text-amber-600">
                        Max stock ({product.stock}) reached
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        rounded-full
                        bg-[var(--color-primary-50)]
                        p-1
                      "
                    >
                      <button
                        type="button"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-[var(--color-primary)]
                          shadow-sm
                          transition
                          active:scale-90
                        "
                      >
                        <Minus size={15} strokeWidth={3} />
                      </button>

                      <span
                        className="
                          min-w-[34px]
                          text-center
                          text-sm
                          font-black
                          text-[var(--color-primary)]
                        "
                      >
                        {qty}
                      </span>

                      <button
                        type="button"
                        title={
                          product.availability_type !== "MADE_TO_ORDER" &&
                            qty >= Number(product.stock)
                            ? `Only ${product.stock} items available in stock`
                            : "Increase quantity"
                        }
                        disabled={
                          product.availability_type !== "MADE_TO_ORDER" &&
                          qty >= Number(product.stock)
                        }
                        onClick={() => setQty(qty + 1)}
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-[var(--color-primary)]
                          text-white
                          shadow-sm
                          transition
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                          active:scale-90
                        "
                      >
                        <Plus size={15} strokeWidth={3} />
                      </button>
                    </div>

                    {product.availability_type === "MADE_TO_ORDER" ? (
                      <span className="text-[10px] font-bold text-orange-600">
                        Cooked on demand
                      </span>
                    ) : Number(product.stock) <= 5 &&
                      Number(product.stock) > 0 ? (
                      <span className="text-[10px] font-bold text-amber-600">
                        Only {product.stock} left in stock
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAdd}
                className={`
                    mt-4
                    flex
                    h-14
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    px-5
                    text-sm
                    font-black
                    text-white
                    shadow-lg
                    transition-all
                    duration-200
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    ${added
                    ? "bg-[var(--color-success)]"
                    : isOutOfStock
                      ? "bg-stone-400"
                      : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
                  }
                  `}
              >
                {added ? (
                  <>
                    <Check size={19} strokeWidth={3} />
                    Added to Cart
                  </>
                ) : isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <ShoppingBag size={19} strokeWidth={2.5} />
                    Add {qty > 1 ? `${qty} ` : ""}to Cart
                  </>
                )}
              </button>
            </div>

            {/* Delivery info */}

            <div
              className="
                mt-3
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-[var(--color-primary-50)]
                p-4
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  text-[var(--color-primary)]
                  shadow-sm
                "
              >
                <Truck size={18} />
              </div>

              <div>
                <p className="text-xs font-black text-[var(--color-text-primary)]">
                  Freshness you can taste
                </p>

                <p className="mt-0.5 text-[10px] leading-4 text-[var(--color-text-secondary)]">
                  Your order is prepared fresh and packed carefully.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* About */}

            <div className="
                rounded-3xl
                border
                border-[var(--color-border)]
                bg-white
                p-4
                shadow-sm
                sm:p-5
              ">
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <Utensils size={17} />
                </div>

                <h2 className="text-sm font-black text-[var(--color-text-primary)]">
                  Made With Care
                </h2>
              </div>

              <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
                Every item is prepared with attention to taste, freshness and
                quality so you can enjoy your food just the way it should be.
              </p>
            </div>

            {/* Quality */}

            <div className="
                rounded-3xl
                border
                border-[var(--color-border)]
                bg-white
                p-4
                shadow-sm
                sm:p-5
              ">
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <Star size={17} fill="currentColor" />
                </div>

                <h2 className="text-sm font-black text-[var(--color-text-primary)]">
                  Customer Favorite
                </h2>
              </div>

              <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
                Loved by customers for its delicious taste, fresh preparation
                and satisfying experience.
              </p>
            </div>

            {/* Fresh */}

            <div className="
                rounded-3xl
                border
                border-[var(--color-border)]
                bg-white
                p-4
                shadow-sm
                sm:p-5
              ">
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <Flame size={17} />
                </div>

                <h2 className="text-sm font-black text-[var(--color-text-primary)]">
                  Fresh & Delicious
                </h2>
              </div>

              <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
                Prepared fresh to deliver the best possible flavor and quality
                with every order.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="reviews-section"
        className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12"
      >
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm md:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border)] pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <Star size={16} fill="currentColor" />
                </span>
                <h2 className="text-xl font-black text-[var(--color-text-primary)] md:text-2xl">
                  Ratings & Reviews
                </h2>
              </div>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                Real customer feedback from guests who ordered {product.name}
              </p>
            </div>

            {!isWritingReview && (
              <button
                type="button"
                onClick={handleOpenWriteReview}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-xs font-black text-white shadow-md transition hover:bg-[var(--color-primary-dark)] active:scale-95 shrink-0"
              >
                <Edit2 size={15} />
                <span>
                  {userOwnReview ? "Edit Your Review" : "Rate Product"}
                </span>
              </button>
            )}
          </div>

          {/* Flipkart-Style Rating Summary Breakdown */}
          <div className="mt-6 grid grid-cols-1 gap-6 rounded-2xl bg-[var(--bg-body)] p-5 md:grid-cols-[260px_1fr] md:p-6">
            {/* Left: Big Score & Sentiment */}
            <div className="flex flex-col items-center justify-center border-b border-[var(--color-border)] pb-5 md:border-b-0 md:border-r md:pb-0 md:pr-6 text-center">
              <div className="flex items-center gap-2">
                <div
                  className={`
                    flex items-center gap-1.5 rounded-xl px-4 py-2 text-2xl font-black shadow-sm
                    ${totalReviews > 0
                      ? getFlipkartRatingStyle(averageRating)
                      : "bg-stone-500 text-white"
                    }
                  `}
                >
                  <span>
                    {totalReviews > 0 ? averageRating.toFixed(1) : "0.0"}
                  </span>
                  <Star size={20} fill="white" className="text-white" />
                </div>
              </div>

              <div className="mt-3 text-sm font-black text-[var(--color-text-primary)]">
                {totalReviews > 0
                  ? `${getRatingSentiment(averageRating)} Taste`
                  : "No Ratings Yet"}
              </div>

              <p className="mt-1 text-xs font-bold text-[var(--color-text-secondary)]">
                {totalReviews > 0
                  ? `${totalReviews.toLocaleString(
                    "en-IN"
                  )} Ratings & ${totalReviews.toLocaleString(
                    "en-IN"
                  )} Reviews`
                  : "Be the first to review"}
              </p>

              <div className="mt-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold text-emerald-700 shadow-xs border border-emerald-100">
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                <span>100% Verified Customer Feedback</span>
              </div>
            </div>

            {/* Right: Color-Coded 5 to 1 Star Progress Bars */}
            <div className="flex flex-col justify-center gap-2.5">
              {[
                { star: 5, color: "bg-[#388e3c]" },
                { star: 4, color: "bg-[#4caf50]" },
                { star: 3, color: "bg-[#fbc02d]" },
                { star: 2, color: "bg-[#ff9800]" },
                { star: 1, color: "bg-[#f44336]" },
              ].map(({ star, color }) => {
                const count =
                  ratingDistribution[star as keyof typeof ratingDistribution] ||
                  0;
                const percentage =
                  totalReviews > 0
                    ? Math.round((count / totalReviews) * 100)
                    : 0;

                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="flex w-9 items-center justify-end gap-1 font-bold text-[var(--color-text-primary)]">
                      {star}{" "}
                      <Star
                        size={11}
                        className="fill-stone-400 text-stone-400"
                      />
                    </span>

                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className={`h-full rounded-full ${color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-16 text-right text-[11px] font-semibold text-[var(--color-text-muted)]">
                      {count} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Write / Edit Review Form */}
          {isWritingReview && (
            <div
              id="review-form"
              className="mt-6 rounded-2xl border-2 border-[var(--color-primary)]/30 bg-white p-5 shadow-md md:p-7 transition-all"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <div>
                  <h3 className="text-base font-black text-[var(--color-text-primary)]">
                    {editingReviewId
                      ? "Edit Your Review"
                      : "Write a Customer Review"}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Share your experience and thoughts on {product.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCancelReviewForm}
                  className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="mt-5 space-y-4">
                {/* Star Rating Picker */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                    Select Your Rating *
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFilled = (hoveredRating || rating) >= starVal;
                        return (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setRating(starVal)}
                            onMouseEnter={() => setHoveredRating(starVal)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="p-1 transition-transform hover:scale-125 focus:outline-none"
                            aria-label={`Rate ${starVal} stars`}
                          >
                            <Star
                              size={28}
                              className={
                                isFilled
                                  ? "fill-[var(--color-star)] text-[var(--color-star)] drop-shadow-sm"
                                  : "text-stone-300 fill-stone-100"
                              }
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-[var(--color-text-primary)] ml-2">
                      {ratingLabelMap[hoveredRating || rating]}
                    </span>
                  </div>
                </div>

                {/* Review Headline / Title (Optional) */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                    Review Title / Headline (Optional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Delicious, crispy, and cooked to perfection!"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white p-3 text-sm text-[var(--color-text-primary)] placeholder:text-stone-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                  />
                </div>

                {/* Comment Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-secondary)]">
                      Your Feedback & Experience *
                    </label>
                    <span className="text-[11px] text-[var(--color-text-muted)]">
                      {comment.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe what you enjoyed about this dish (taste, freshness, aroma, portion size, packaging)..."
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white p-3.5 text-sm text-[var(--color-text-primary)] placeholder:text-stone-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                    required
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelReviewForm}
                    className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-xs font-bold text-[var(--color-text-secondary)] hover:bg-stone-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isCreatingReview || isUpdatingReview || !comment.trim()
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-xs font-black text-white shadow transition hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {isCreatingReview || isUpdatingReview ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={15} />
                        {editingReviewId ? "Save Changes" : "Submit Review"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Flipkart-Style Customer Reviews List */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-text-secondary)]">
                Customer Reviews ({allReviews.length}
                {totalReviews > allReviews.length ? ` of ${totalReviews}` : ""})
              </h3>
            </div>

            {isReviewsLoading && allReviews.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-[var(--color-text-muted)] gap-2">
                <Loader2
                  size={18}
                  className="animate-spin text-[var(--color-primary)]"
                />
                Loading customer reviews...
              </div>
            ) : allReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--bg-body)]/50 py-10 px-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <MessageSquare size={22} />
                </div>
                <h4 className="mt-3 text-sm font-black text-[var(--color-text-primary)]">
                  No Reviews Yet
                </h4>
                <p className="mt-1 max-w-sm text-xs text-[var(--color-text-muted)]">
                  Be the first to share your thoughts on {product.name}! Your
                  feedback helps other guests make great choices.
                </p>
                {!isWritingReview && (
                  <button
                    type="button"
                    onClick={handleOpenWriteReview}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-[var(--color-primary-dark)] transition"
                  >
                    <Edit2 size={13} />
                    Write the First Review
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allReviews.map((rev) => {
                  const isOwnReview =
                    user && Number(rev.user_id) === Number(user.id);
                  const isConfirmingDelete = deletingReviewId === rev.id;

                  return (
                    <div
                      key={rev.id}
                      className={`
                        relative rounded-2xl border bg-white p-5 transition-shadow hover:shadow-sm
                        ${isOwnReview
                          ? "border-[var(--color-primary)]/30 ring-1 ring-[var(--color-primary)]/10"
                          : "border-[var(--color-border)]"
                        }
                      `}
                    >
                      {/* Top Header: Rating Pill + Headline + Author Actions */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* Flipkart-Style Rating Badge */}
                          <div
                            className={`
                              inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-black
                              ${getFlipkartRatingStyle(rev.rating)}
                            `}
                          >
                            <span>{rev.rating}</span>
                            <Star
                              size={10}
                              fill="white"
                              className="text-white"
                            />
                          </div>

                          {/* Headline / Title */}
                          <h4 className="text-sm font-black text-[var(--color-text-primary)]">
                            {rev.title ||
                              (rev.rating >= 4
                                ? "Delicious & Fresh"
                                : "Customer Review")}
                          </h4>

                          {isOwnReview && (
                            <span className="rounded-full bg-[var(--color-primary-50)] px-2 py-0.5 text-[10px] font-black text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                              Your Review
                            </span>
                          )}
                        </div>

                        {/* Edit & Delete for logged-in author */}
                        {isOwnReview && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEditReview(rev)}
                              title="Edit your review"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-[var(--color-primary)] transition"
                            >
                              <Edit2 size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeletingReviewId(rev.id)}
                              title="Delete your review"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-red-50 hover:text-red-600 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Delete Confirmation Inline Prompt */}
                      {isConfirmingDelete && (
                        <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl bg-red-50 p-3 text-xs border border-red-200">
                          <div className="flex items-center gap-2 text-red-700 font-semibold">
                            <AlertCircle size={15} />
                            <span>
                              Are you sure you want to delete your review?
                            </span>
                          </div>
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => setDeletingReviewId(null)}
                              className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-stone-600 border border-stone-200 hover:bg-stone-50 transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={isDeletingReview}
                              onClick={() => handleDeleteReview(rev.id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition disabled:opacity-50"
                            >
                              {isDeletingReview ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Trash2 size={12} />
                              )}
                              Delete
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Review Comment Body */}
                      <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-secondary)] whitespace-pre-line">
                        {rev.comment}
                      </p>

                      {/* Bottom Footer: Author Info & Certified Buyer Badge */}
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)]/60 pt-3 text-[11px] text-[var(--color-text-muted)]">
                        <span className="font-bold text-[var(--color-text-primary)]">
                          {rev.user_name || "Verified Customer"}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2
                            size={12}
                            className="text-emerald-600"
                          />
                          <span>Certified Buyer</span>
                        </span>

                        <span>·</span>

                        <span>{formatReviewDate(rev.created_at)}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Infinite Scroll Sentinel & Loader */}
                <div ref={sentinelRef} className="py-4 text-center">
                  {isReviewsFetching && (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--color-primary)]">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Loading more customer reviews...</span>
                    </div>
                  )}
                  {!hasMore && allReviews.length > 0 && (
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-text-muted)]">
                      <Check size={13} className="text-emerald-500" />
                      <span>You have viewed all {totalReviews} reviews</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-[var(--color-primary-dark)]
            px-5
            py-8
            shadow-xl
            md:px-10
            md:py-10
          "
        >
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                Still hungry?
              </p>

              <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
                Explore more delicious food
              </h2>

              <p className="mt-2 text-xs text-white/60">
                Discover more favorites from our menu.
              </p>
            </div>

            <Link
              href="/menu"
              className="
                inline-flex
                h-12
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-white
                px-5
                text-xs
                font-black
                text-[var(--color-primary-dark)]
                shadow-lg
                transition
                hover:-translate-y-0.5
                active:scale-95
              "
            >
              Explore Menu
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
