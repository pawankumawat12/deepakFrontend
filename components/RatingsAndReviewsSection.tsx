"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Star,
  Edit2,
  Trash2,
  MessageSquare,
  ShieldCheck,
  Check,
  X,
  Loader2,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetProductReviewsQuery,
  useCreateProductReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  ReviewItem,
} from "../redux/services/reviewApi";

interface RatingsAndReviewsSectionProps {
  productId: number | string;
  productName: string;
}

const ratingLabelMap: Record<number, string> = {
  1: "Poor 😞",
  2: "Fair 😐",
  3: "Good 🙂",
  4: "Very Good 😊",
  5: "Exceptional Taste! 🌟",
};

export default function RatingsAndReviewsSection({
  productId,
  productName,
}: RatingsAndReviewsSectionProps) {
  const user = useSelector(
    (state: { auth: { user: any | null } }) => state.auth.user
  );

  const [reviewsPage, setReviewsPage] = useState(1);
  const [allReviews, setAllReviews] = useState<ReviewItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Review Modal state
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, number>>({});
  const [votedReviews, setVotedReviews] = useState<Record<number, boolean>>({});

  const {
    data: reviewsResponse,
    isLoading: isReviewsLoading,
    isFetching: isReviewsFetching,
  } = useGetProductReviewsQuery(
    { productId, page: reviewsPage, limit: 12 },
    { skip: !productId }
  );

  const [createProductReview, { isLoading: isCreatingReview }] =
    useCreateProductReviewMutation();
  const [updateReview, { isLoading: isUpdatingReview }] =
    useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeletingReview }] =
    useDeleteReviewMutation();

  const totalReviews = Number(
    reviewsResponse?.data?.summary?.totalReviews ??
      reviewsResponse?.data?.pagination?.total ??
      allReviews.length
  );
  const averageRating = Number(
    reviewsResponse?.data?.summary?.averageRating || 0
  );
  const ratingDistribution = reviewsResponse?.data?.summary?.ratingDistribution || {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  useEffect(() => {
    if (reviewsResponse?.data?.reviews) {
      const incoming = reviewsResponse.data.reviews;
      if (reviewsPage === 1) {
        setAllReviews(incoming);
      } else {
        setAllReviews((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const uniqueIncoming = incoming.filter(
            (r: ReviewItem) => !existingIds.has(r.id)
          );
          return [...prev, ...uniqueIncoming];
        });
      }
      const total =
        reviewsResponse?.data?.pagination?.total ?? incoming.length;
      const currentFetched =
        reviewsPage === 1
          ? incoming.length
          : allReviews.length + incoming.length;
      setHasMore(currentFetched < total);
    }
  }, [reviewsResponse, reviewsPage]);

  // Lock body scroll when modal is open & add Escape key listener
  useEffect(() => {
    if (isWritingReview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isWritingReview) {
        handleCancelReviewForm();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isWritingReview]);

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
      handleEditReview(userOwnReview);
      return;
    }
    setEditingReviewId(null);
    setRating(5);
    setTitle("");
    setComment("");
    setIsWritingReview(true);
  };

  const handleEditReview = (rev: ReviewItem) => {
    setEditingReviewId(rev.id);
    setRating(rev.rating);
    setTitle(rev.title || "");
    setComment(rev.comment || "");
    setIsWritingReview(true);
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
    if (!comment.trim()) {
      toast.error("Please enter your review feedback");
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
          productId: Number(productId),
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        }).unwrap();
        toast.success("Thank you! Your review was submitted.");
      }
      handleCancelReviewForm();
      setReviewsPage(1);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  const handleConfirmDelete = async (reviewId: number) => {
    try {
      await deleteReview(reviewId).unwrap();
      toast.success("Review deleted successfully");
      setDeletingReviewId(null);
      setAllReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete review");
    }
  };

  const handleHelpfulClick = (reviewId: number) => {
    if (votedReviews[reviewId]) return;
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    setVotedReviews((prev) => ({
      ...prev,
      [reviewId]: true,
    }));
    toast.success("Thanks for your feedback!");
  };

  const getFlipkartRatingStyle = (r: number) => {
    if (r >= 3.8) return "bg-[#388e3c] text-white";
    if (r >= 2.5) return "bg-[#fbc02d] text-stone-900";
    return "bg-[#d32f2f] text-white";
  };

  const getRatingSentiment = (avg: number) => {
    if (avg >= 4.5) return "Exceptional";
    if (avg >= 4.0) return "Very Good";
    if (avg >= 3.0) return "Good";
    if (avg >= 2.0) return "Average";
    return "Needs Improvement";
  };

  const formatReviewDate = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <section
      id="reviews-section"
      className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12"
    >
      <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm md:p-10">
        {/* Section Header */}
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
            </p>
          </div>

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
        </div>

    

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
                      ${
                        isOwnReview
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
                        <h4 className="text-sm font-black text-[var(--color-text-primary)] break-words [overflow-wrap:anywhere]">
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
                          <span>Delete this review permanently?</span>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setDeletingReviewId(null)}
                            className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-100 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(rev.id)}
                            disabled={isDeletingReview}
                            className="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition"
                          >
                            {isDeletingReview ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Review Body Comment */}
                    <p className="mt-3 text-xs leading-5 text-[var(--color-text-secondary)] whitespace-pre-line break-words [overflow-wrap:anywhere]">
                      {rev.comment}
                    </p>

                    {/* Bottom Metadata: Author Name, Verified Badge, Date, Helpful Button */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)]/60 pt-3 text-[11px] text-[var(--color-text-muted)]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-[var(--color-text-primary)]">
                          {rev.user_name || "Guest Customer"}
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                          <ShieldCheck size={11} className="text-emerald-600" />
                          Certified Buyer
                        </span>

                        <span>·</span>
                        <span>{formatReviewDate(rev.created_at)}</span>
                      </div>

                      {/* Helpful Button */}
                      <button
                        type="button"
                        onClick={() => handleHelpfulClick(rev.id)}
                        disabled={votedReviews[rev.id]}
                        className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 transition text-[11px] ${
                          votedReviews[rev.id]
                            ? "bg-emerald-50 text-emerald-700 font-bold"
                            : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                        }`}
                      >
                        <ThumbsUp size={12} />
                        <span>
                          {(helpfulVotes[rev.id] || 0) > 0
                            ? `Helpful (${helpfulVotes[rev.id]})`
                            : "Helpful"}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button if more pages exist */}
          {hasMore && (
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => setReviewsPage((p) => p + 1)}
                disabled={isReviewsFetching}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-5 py-2.5 text-xs font-bold text-[var(--color-text-primary)] shadow-xs hover:bg-stone-50 transition active:scale-95"
              >
                {isReviewsFetching ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-[var(--color-primary)]" />
                    <span>Loading more...</span>
                  </>
                ) : (
                  <span>Load More Reviews</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Create / Update Popup Modal */}
      {isWritingReview && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={handleCancelReviewForm}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-[var(--color-border)] bg-white p-6 sm:p-8 shadow-2xl my-auto transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <Star size={20} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[var(--color-text-primary)]">
                    {editingReviewId
                      ? "Edit Your Review"
                      : "Rate & Review Dish"}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-1
                  
    leading-tight
    tracking-tight
    overflow-hidden"
  style={{ maxWidth: "200px" }}
  >
                    {productName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancelReviewForm}
                className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
                aria-label="Close review dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitReview} className="mt-5 space-y-4">
              {/* Star Rating Picker */}
              <div className="rounded-2xl bg-[var(--bg-body)] p-3.5 sm:p-4 text-center">
                <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
                  Select Your Overall Rating *
                </label>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-1.5">
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
                            size={32}
                            className={
                              isFilled
                                ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                                : "text-stone-300 fill-stone-100"
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-bold text-[var(--color-text-primary)]">
                    {ratingLabelMap[hoveredRating || rating]}
                  </span>
                </div>
              </div>

              {/* Review Headline / Title */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                  Review Headline (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fresh, flavorful and delicious!"
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
                  placeholder="Describe your dining experience (taste, presentation, aroma, packaging)..."
                  className="w-full rounded-xl border border-[var(--color-border)] bg-white p-3.5 text-sm text-[var(--color-text-primary)] placeholder:text-stone-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                  required
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border)]">
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
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
        </div>
      )}
    </section>
  );
}
