"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Star,
  MessageSquare,
  Edit2,
  Trash2,
  CheckCircle2,
  LoaderCircle,
  AlertCircle,
  Plus,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetProductReviewsQuery,
  useCreateProductReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  ReviewItem,
} from "../redux/services/reviewApi";
import SkeletonLoader from "./SkeletonLoader";
import { RootState } from "../redux/store";

const RATING_LABELS: Record<number, string> = {
  1: "Poor 😞",
  2: "Fair 😐",
  3: "Good 🙂",
  4: "Very Good 😊",
  5: "Exceptional Taste! 🌟",
};

export default function ProductReviewSection({
  productId,
  productName,
}: {
  productId: number | string;
  productName: string;
}) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetProductReviewsQuery({
    productId,
    page,
    limit: 10,
  });

  const [createProductReview, { isLoading: isCreating }] =
    useCreateProductReviewMutation();
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
  const [expandedReviews, setExpandedReviews] = useState<Record<number, boolean>>({});

  const reviews = data?.data?.reviews || [];
  const summary = data?.data?.summary || {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };
  const pagination = data?.data?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
  };

  // Check if current logged-in user already wrote a review
  const userExistingReview = user
    ? reviews.find((r) => Number(r.user_id) === Number(user.id))
    : null;

  const handleOpenCreate = () => {
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
    if (!confirm("Are you sure you want to delete your review?")) return;
    try {
      await deleteReview(reviewId).unwrap();
      toast.success("Your review was deleted.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete review.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setFormError("Please write a comment for your review.");
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
        toast.success("Your review has been updated!");
      } else {
        await createProductReview({
          productId,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        }).unwrap();
        toast.success("Thank you! Your review has been submitted.");
      }
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <div className="mt-14 overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-sm md:p-10">
      {/* SECTION HEADER & WRITE ACTION */}
      <div className="flex flex-col justify-between gap-5 border-b border-[var(--color-border)] pb-7 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
              <Sparkles size={13} />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-secondary)]">
              Verified Feedback
            </span>
          </div>

          <h3 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Customer Reviews & Ratings
          </h3>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)] sm:text-sm">
            Honest thoughts and ratings from customers who enjoyed {productName}
          </p>
        </div>

        <div>
          {userExistingReview ? (
            <button
              type="button"
              onClick={() => handleOpenEdit(userExistingReview)}
              className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary-50)] px-5 py-3 text-xs font-black text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white active:scale-95 shadow-xs"
            >
              <Edit2 size={15} />
              <span>Edit Your Review</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-xs font-black text-white shadow-md shadow-[var(--color-primary)]/20 transition hover:bg-[var(--color-primary-dark)] hover:-translate-y-0.5 active:scale-95"
            >
              <Plus size={16} />
              <span>Write a Review</span>
            </button>
          )}
        </div>
      </div>

      {/* RATING SUMMARY DASHBOARD */}
      <div className="mt-7 grid grid-cols-1 gap-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-cream)]/50 p-6 sm:grid-cols-3 md:p-8">
        {/* BIG SCORE */}
        <div className="flex flex-col items-center justify-center border-b border-[var(--color-border)] pb-6 sm:border-b-0 sm:border-r sm:pb-0">
          <div className="text-5xl font-black text-[var(--color-text-primary)]">
            {summary.averageRating > 0
              ? summary.averageRating.toFixed(1)
              : "0.0"}
          </div>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={19}
                fill={
                  star <= Math.round(summary.averageRating)
                    ? "#f59e0b"
                    : "none"
                }
                color={
                  star <= Math.round(summary.averageRating)
                    ? "#f59e0b"
                    : "#d1d5db"
                }
              />
            ))}
          </div>
          <div className="mt-2 text-xs font-black text-[var(--color-text-secondary)]">
            Based on {summary.totalReviews}{" "}
            {summary.totalReviews === 1 ? "review" : "reviews"}
          </div>
        </div>

        {/* STAR DISTRIBUTION BARS */}
        <div className="col-span-2 flex flex-col justify-center space-y-2.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count =
              (summary.ratingDistribution as any)?.[stars] || 0;
            const percentage =
              summary.totalReviews > 0
                ? Math.round((count / summary.totalReviews) * 100)
                : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
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
      <div className="mt-8 space-y-4">
        {isLoading ? (
          <SkeletonLoader variant="list" count={3} />
        ) : isError ? (
          <div className="py-6 text-center text-xs font-black text-red-500">
            Failed to load reviews. Please try again.
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--color-border)] py-14 text-center">
            <MessageSquare
              size={36}
              className="mx-auto text-[var(--color-text-muted)] opacity-50"
            />
            <h4 className="mt-3 text-base font-black text-[var(--color-text-primary)]">
              No reviews yet
            </h4>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Be the first to rate and share your experience with {productName}!
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-5 inline-flex items-center gap-1.5 rounded-2xl bg-[var(--color-primary)] px-5 py-2.5 text-xs font-black text-white transition hover:bg-[var(--color-primary-dark)]"
            >
              <Plus size={14} />
              <span>Leave First Review</span>
            </button>
          </div>
        ) : (
          reviews.map((rev) => {
            const isMine =
              user && Number(rev.user_id) === Number(user.id);
            const isHidden = Boolean(rev.is_hidden);

            return (
              <div
                key={rev.id}
                className={`relative rounded-3xl border p-5 transition ${
                  isMine
                    ? "border-[var(--color-primary)]/40 bg-[var(--color-primary-50)]/50 shadow-xs"
                    : "border-[var(--color-border)] bg-[var(--bg-surface)]/70 hover:border-[var(--color-primary)]/30 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* AUTHOR INFO & RATING */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-sm font-black text-white shadow-xs">
                      {rev.user_name ? rev.user_name.charAt(0).toUpperCase() : "C"}
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
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-[var(--color-success)]">
                          <CheckCircle2 size={12} />
                          <span>Verified Order</span>
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={13}
                              fill={star <= rev.rating ? "#f59e0b" : "none"}
                              color={
                                star <= rev.rating ? "#f59e0b" : "#d1d5db"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-[var(--color-text-muted)]">
                          {new Date(rev.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* USER EDIT / DELETE ACTIONS */}
                  {isMine && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(rev)}
                        title="Edit Review"
                        className="rounded-xl border border-[var(--color-border)] bg-white p-2 text-[var(--color-text-secondary)] shadow-xs transition hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)]"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(rev.id)}
                        disabled={isDeleting}
                        title="Delete Review"
                        className="rounded-xl border border-red-200 bg-white p-2 text-red-500 shadow-xs transition hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {/* HIDDEN NOTICE FOR AUTHOR */}
                {isHidden && isMine && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-black text-amber-600">
                    <AlertCircle size={13} />
                    <span>
                      This review is currently under administrative moderation.
                    </span>
                  </div>
                )}

                {/* REVIEW BODY */}
                <div className="mt-3.5">
                  {rev.title && (
                    <h5
                      className="font-black text-[var(--color-text-primary)] break-words"
                      title={rev.title}
                    >
                      {rev.title}
                    </h5>
                  )}
                  <div className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)] break-words">
                    {rev.comment.length > 250 && !expandedReviews[rev.id] ? (
                      <>
                        <span>{rev.comment.slice(0, 250)}...</span>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedReviews((prev) => ({
                              ...prev,
                              [rev.id]: true,
                            }))
                          }
                          className="ml-1.5 text-xs font-bold text-[#4f7d16] hover:underline"
                        >
                          Read more
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{rev.comment}</span>
                        {rev.comment.length > 250 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedReviews((prev) => ({
                                ...prev,
                                [rev.id]: false,
                              }))
                            }
                            className="ml-1.5 text-xs font-bold text-[#4f7d16] hover:underline"
                          >
                            Show less
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* WRITE / EDIT REVIEW MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-[2rem] border border-[var(--color-border)] bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <h3 className="text-xl font-black text-[var(--color-text-primary)]">
                {editingReview ? "Edit Your Review" : `Rate ${productName}`}
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

              {/* STAR RATING SELECTOR */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                  Your Overall Rating
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
                  placeholder="e.g. Incredible flavor and top quality!"
                  className="mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)]/30 p-3.5 text-sm font-semibold text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
                />
              </div>

              {/* COMMENT */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                  Your Feedback / Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like about this dish? How was the taste, presentation, and freshness?"
                  className="mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)]/30 p-3.5 text-sm font-semibold text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
                />
              </div>

              {/* BUTTONS */}
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
  );
}
