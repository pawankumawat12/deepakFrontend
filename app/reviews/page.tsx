"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Star,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  X,
  Store,
  Package,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useGetSiteReviewsQuery,
  useGetMyReviewsQuery,
  useCreateSiteReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  ReviewItem,
} from "../../redux/services/reviewApi";
import { RootState } from "../../redux/store";

const RATING_LABELS: Record<number, string> = {
  1: "Poor 😞",
  2: "Fair 😐",
  3: "Good 🙂",
  4: "Very Good 😊",
  5: "Exceptional Cafe Experience! 🌟",
};

export default function ReviewsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<"site" | "my">("site");
  const [page, setPage] = useState(1);

  // Queries
  const {
    data: siteData,
    isLoading: loadingSite,
    isError: errorSite,
  } = useGetSiteReviewsQuery({ page, limit: 10 });

  const {
    data: myData,
    isLoading: loadingMy,
    isError: errorMy,
  } = useGetMyReviewsQuery({ page, limit: 15 }, { skip: !user || activeTab !== "my" });

  // Mutations
  const [createSiteReview, { isLoading: isCreating }] =
    useCreateSiteReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");

  const siteReviews = siteData?.data?.reviews || [];
  const siteSummary = siteData?.data?.summary || {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };
  const sitePagination = siteData?.data?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
  };

  const myReviews = myData?.data?.reviews || [];
  const myPagination = myData?.data?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
  };

  const userExistingSiteReview = user
    ? siteReviews.find((r) => Number(r.user_id) === Number(user.id))
    : null;

  const handleOpenCreateSite = () => {
    if (!user) {
      toast.error("Please sign in to write a review");
      window.dispatchEvent(new CustomEvent("sfc_open_login"));
      return;
    }
    setEditingReview(null);
    setRating(5);
    setTitle("");
    setComment("");
    setFormError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (rev: ReviewItem) => {
    setEditingReview(rev);
    setRating(rev.rating);
    setTitle(rev.title || "");
    setComment(rev.comment || "");
    setFormError("");
    setModalOpen(true);
  };

  const handleDelete = async (reviewId: number | string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(reviewId).unwrap();
      toast.success("Review deleted successfully.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete review.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setFormError("Please enter your feedback comment.");
      return;
    }

    try {
      setFormError("");
      if (editingReview) {
        await updateReview({
          id: editingReview.id,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        }).unwrap();
        toast.success("Review updated successfully!");
      } else {
        await createSiteReview({
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        }).unwrap();
        toast.success("Thank you for reviewing SFC Cafe!");
      }
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-body)] pb-16">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-[var(--color-primary-dark)]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary-light)] backdrop-blur-md">
              <Sparkles size={13} />
              <span>Customer Love & Feedback</span>
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              SFC Cafe Reviews & Ratings
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
              Discover what our wonderful patrons say about our taste, ambiance,
              and swift delivery. Share your culinary journey with us!
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* TAB CONTROLS & WRITE REVIEW ACTION */}
        <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex gap-2 rounded-2xl bg-[var(--color-primary-50)] p-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("site");
                setPage(1);
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition ${
                activeTab === "site"
                  ? "bg-[var(--color-primary)] text-white shadow-md"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
              }`}
            >
              <Store size={15} />
              <span>Store Experience ({siteSummary.totalReviews})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("my");
                setPage(1);
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition ${
                activeTab === "my"
                  ? "bg-[var(--color-primary)] text-white shadow-md"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
              }`}
            >
              <MessageSquare size={15} />
              <span>My Submitted Reviews</span>
            </button>
          </div>

          {activeTab === "site" && (
            <div>
              {userExistingSiteReview ? (
                <button
                  type="button"
                  onClick={() => handleOpenEdit(userExistingSiteReview)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary-50)] px-5 py-2.5 text-xs font-black text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white active:scale-95 shadow-xs"
                >
                  <Edit2 size={14} />
                  <span>Edit Your Store Review</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenCreateSite}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-2.5 text-xs font-black text-white shadow-md shadow-[var(--color-primary)]/20 transition hover:bg-[var(--color-primary-dark)] hover:-translate-y-0.5 active:scale-95"
                >
                  <Plus size={16} />
                  <span>Rate Store Experience</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* TAB 1: SITE REVIEWS STREAM */}
        {activeTab === "site" && (
          <div className="mt-8 space-y-8">
            {/* RATING SUMMARY DASHBOARD */}
            <div className="grid grid-cols-1 gap-6 rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-sm sm:grid-cols-3 md:p-8">
              <div className="flex flex-col items-center justify-center border-b border-[var(--color-border)] pb-6 sm:border-b-0 sm:border-r sm:pb-0">
                <div className="text-5xl font-black text-[var(--color-text-primary)]">
                  {siteSummary.averageRating > 0
                    ? siteSummary.averageRating.toFixed(1)
                    : "0.0"}
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      fill={
                        star <= Math.round(siteSummary.averageRating)
                          ? "#f59e0b"
                          : "none"
                      }
                      color={
                        star <= Math.round(siteSummary.averageRating)
                          ? "#f59e0b"
                          : "#d1d5db"
                      }
                    />
                  ))}
                </div>
                <div className="mt-2 text-xs font-black text-[var(--color-text-secondary)]">
                  Overall Cafe Rating from {siteSummary.totalReviews} reviews
                </div>
              </div>

              <div className="col-span-2 flex flex-col justify-center space-y-2.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count =
                    (siteSummary.ratingDistribution as any)?.[stars] || 0;
                  const percentage =
                    siteSummary.totalReviews > 0
                      ? Math.round((count / siteSummary.totalReviews) * 100)
                      : 0;

                  return (
                    <div
                      key={stars}
                      className="flex items-center gap-3 text-xs"
                    >
                      <span className="w-14 font-black text-[var(--color-text-primary)]">
                        {stars} Stars
                      </span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-stone-200/70">
                        <div
                          className="h-full rounded-full bg-[var(--color-secondary)] transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-14 text-right font-black text-[var(--color-text-muted)]">
                        {count} ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* REVIEWS LIST */}
            {loadingSite ? (
              <div className="flex items-center justify-center py-16 text-[var(--color-text-muted)]">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-[var(--color-primary)]"
                />
                <span className="ml-3 text-xs font-black">
                  Loading customer reviews...
                </span>
              </div>
            ) : errorSite ? (
              <div className="rounded-2xl bg-red-50 p-6 text-center text-xs font-black text-red-600">
                Failed to load store reviews.
              </div>
            ) : siteReviews.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-[var(--color-border)] bg-white py-16 text-center shadow-xs">
                <Store
                  size={40}
                  className="mx-auto text-[var(--color-text-muted)] opacity-50"
                />
                <h3 className="mt-3 text-base font-black text-[var(--color-text-primary)]">
                  No store reviews yet
                </h3>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  Be the first to share your overall experience with SFC Cafe!
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreateSite}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-2.5 text-xs font-black text-white transition hover:bg-[var(--color-primary-dark)]"
                >
                  <Plus size={14} />
                  <span>Leave First Review</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {siteReviews.map((rev) => {
                  const isMine =
                    user && Number(rev.user_id) === Number(user.id);
                  const isHidden = Boolean(rev.is_hidden);

                  return (
                    <div
                      key={rev.id}
                      className={`flex flex-col justify-between rounded-[2rem] border p-6 shadow-xs transition hover:shadow-md ${
                        isMine
                          ? "border-[var(--color-primary)]/40 bg-[var(--color-primary-50)]/40"
                          : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/30"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-sm font-black text-white shadow-xs">
                              {rev.user_name
                                ? rev.user_name.charAt(0).toUpperCase()
                                : "C"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-[var(--color-text-primary)]">
                                  {rev.user_name || "Customer"}
                                </span>
                                {isMine && (
                                  <span className="rounded-full bg-[var(--color-primary)]/15 px-2.5 py-0.5 text-[9px] font-black uppercase text-[var(--color-primary)]">
                                    Your Review
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={13}
                                      fill={
                                        star <= rev.rating ? "#f59e0b" : "none"
                                      }
                                      color={
                                        star <= rev.rating
                                          ? "#f59e0b"
                                          : "#d1d5db"
                                      }
                                    />
                                  ))}
                                </div>
                                <span className="text-[11px] font-bold text-[var(--color-text-muted)]">
                                  {new Date(
                                    rev.created_at
                                  ).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {isMine && (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(rev)}
                                className="rounded-xl border border-[var(--color-border)] bg-white p-2 text-[var(--color-text-secondary)] shadow-xs transition hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)]"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(rev.id)}
                                disabled={isDeleting}
                                className="rounded-xl border border-red-200 bg-white p-2 text-red-500 shadow-xs transition hover:bg-red-50"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          )}
                        </div>

                        {isHidden && isMine && (
                          <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-black text-amber-600">
                            <AlertCircle size={13} />
                            <span>
                              Under administrative moderation.
                            </span>
                          </div>
                        )}

                        <div className="mt-4">
                          {rev.title && (
                            <h4 className="font-black text-[var(--color-text-primary)]">
                              {rev.title}
                            </h4>
                          )}
                          <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                            "{rev.comment}"
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-1 text-[11px] font-black text-[var(--color-success)]">
                        <CheckCircle2 size={13} />
                        <span>Verified SFC Patron</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY SUBMITTED REVIEWS */}
        {activeTab === "my" && (
          <div className="mt-8">
            {!user ? (
              <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-12 text-center shadow-sm">
                <MessageSquare
                  size={44}
                  className="mx-auto text-[var(--color-text-muted)] opacity-50"
                />
                <h3 className="mt-4 text-lg font-black text-[var(--color-text-primary)]">
                  Sign in to view your reviews
                </h3>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  Track the moderation status of all product reviews and store feedback
                  you have submitted.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("sfc_open_login"))
                  }
                  className="mt-5 rounded-2xl bg-[var(--color-primary)] px-6 py-2.5 text-xs font-black text-white transition hover:bg-[var(--color-primary-dark)]"
                >
                  Sign In Now
                </button>
              </div>
            ) : loadingMy ? (
              <div className="flex items-center justify-center py-16 text-[var(--color-text-muted)]">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-[var(--color-primary)]"
                />
                <span className="ml-3 text-xs font-black">
                  Loading your reviews...
                </span>
              </div>
            ) : errorMy ? (
              <div className="rounded-2xl bg-red-50 p-6 text-center text-xs font-black text-red-600">
                Failed to load your submitted reviews.
              </div>
            ) : myReviews.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-[var(--color-border)] bg-white py-16 text-center shadow-xs">
                <MessageSquare
                  size={40}
                  className="mx-auto text-[var(--color-text-muted)] opacity-50"
                />
                <h3 className="mt-3 text-base font-black text-[var(--color-text-primary)]">
                  You haven't written any reviews yet
                </h3>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  Order delicious dishes from our menu and share your feedback!
                </p>
                <Link
                  href="/menu"
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-2.5 text-xs font-black text-white transition hover:bg-[var(--color-primary-dark)]"
                >
                  <span>Explore Menu & Order</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myReviews.map((rev) => {
                  const isHidden = Boolean(rev.is_hidden);
                  return (
                    <div
                      key={rev.id}
                      className="flex flex-col justify-between rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-xs transition sm:flex-row sm:items-center hover:border-[var(--color-primary)]/30"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          {rev.type === "product" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                              <Package size={13} />
                              <span>
                                {rev.product_name || `Product #${rev.product_id}`}
                              </span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1 text-xs font-black text-purple-700">
                              <Store size={13} />
                              <span>Store Experience Review</span>
                            </span>
                          )}

                          {/* STATUS BADGE */}
                          {isHidden ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-black text-amber-600">
                              <ShieldAlert size={12} />
                              <span>Hidden by Admin</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-600">
                              <CheckCircle2 size={12} />
                              <span>Published & Visible</span>
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                fill={star <= rev.rating ? "#f59e0b" : "none"}
                                color={
                                  star <= rev.rating ? "#f59e0b" : "#d1d5db"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-xs font-black text-[var(--color-text-primary)]">
                            {rev.rating}/5
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)]">•</span>
                          <span className="text-xs font-bold text-[var(--color-text-muted)]">
                            {new Date(rev.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        {rev.title && (
                          <h4 className="mt-2 text-sm font-black text-[var(--color-text-primary)]">
                            {rev.title}
                          </h4>
                        )}

                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                          {rev.comment}
                        </p>
                      </div>

                      {/* EDIT & DELETE ACTIONS */}
                      <div className="mt-4 flex items-center gap-2 border-t border-[var(--color-border)] pt-4 sm:mt-0 sm:border-t-0 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(rev)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-white px-3.5 py-2 text-xs font-black text-[var(--color-text-secondary)] shadow-xs transition hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)]"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(rev.id)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-black text-red-500 shadow-xs transition hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* WRITE / EDIT REVIEW MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-[2rem] border border-[var(--color-border)] bg-white p-7 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <h3 className="text-xl font-black text-[var(--color-text-primary)]">
                  {editingReview
                    ? "Edit Your Review"
                    : "Rate Your SFC Cafe Experience"}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-cream)]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {formError && (
                  <div className="rounded-xl bg-red-50 p-3 text-xs font-black text-red-600">
                    {formError}
                  </div>
                )}

                {/* STAR SELECTOR */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                    Your Rating
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="rounded-lg p-1 transition transform active:scale-125 focus:outline-none"
                        >
                          <Star
                            size={32}
                            fill={active ? "#f59e0b" : "none"}
                            color={active ? "#f59e0b" : "#d1d5db"}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-sm font-black text-[var(--color-secondary)]">
                      {RATING_LABELS[hoverRating || rating]}
                    </span>
                  </div>
                </div>

                {/* TITLE */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                    Review Headline (Optional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Best cafe in town with amazing service!"
                    className="mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)]/30 p-3.5 text-sm font-semibold text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
                  />
                </div>

                {/* COMMENT */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                    Your Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How was the food taste, delivery speed, and customer service?"
                    className="mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)]/30 p-3.5 text-sm font-semibold text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-2xl border border-[var(--color-border)] px-5 py-3 text-xs font-black text-[var(--color-text-secondary)] transition hover:bg-[var(--color-cream)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-7 py-3 text-xs font-black text-white shadow-md shadow-[var(--color-primary)]/20 transition hover:bg-[var(--color-primary-dark)] active:scale-95 disabled:opacity-50"
                  >
                    {(isCreating || isUpdating) && (
                      <LoaderCircle size={16} className="animate-spin" />
                    )}
                    <span>
                      {editingReview ? "Save Changes" : "Submit Review"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
