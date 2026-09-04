import React from "react";

export type SkeletonVariant =
  | "generic"
  | "text"
  | "circular"
  | "rectangular"
  | "product"
  | "category"
  | "card"
  | "list"
  | "table"
  | "product-detail";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  count?: number;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  lines?: number;
  gridClassName?: string;
  shimmer?: boolean;
  pulse?: boolean;
}

/**
 * Base YouTube-style Skeleton Block Primitive
 */
export function SkeletonItem({
  className = "",
  style,
  width,
  height,
  circle = false,
  shimmer = true,
  pulse = true,
  ...props
}: {
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  shimmer?: boolean;
  pulse?: boolean;
  [key: string]: any;
}) {
  const inlineStyles: React.CSSProperties = {
    ...style,
    ...(width !== undefined ? { width: typeof width === "number" ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === "number" ? `${height}px` : height } : {}),
  };

  const classes = [
    "skeleton-base",
    shimmer ? "skeleton-shimmer" : "",
    pulse ? "skeleton-pulse" : "",
    circle ? "!rounded-full aspect-square" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} style={inlineStyles} {...props} />;
}

/**
 * Product Card Skeleton (Matches Menu.tsx & PopularProducts.tsx)
 */
export function ProductSkeleton({ className = "" }: { className?: string }) {
  return (
    <article
      className={`
        overflow-hidden
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-white
        shadow-sm
        dark:bg-[var(--bg-surface)]
        p-3 sm:p-4
        flex flex-col justify-between
        transition-all
        ${className}
      `}
    >
      <div>
        {/* Product Image Area */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800">
          <SkeletonItem className="h-full w-full !rounded-xl" />
          {/* Wishlist Heart Button Placeholder */}
          <div className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 p-1.5 shadow-sm dark:bg-stone-700/80">
            <SkeletonItem circle className="h-full w-full" />
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-3 space-y-2">
          {/* Rating Pill Placeholder */}
          <div className="flex items-center gap-1.5">
            <SkeletonItem className="h-4 w-12 !rounded-md" />
            <SkeletonItem className="h-3.5 w-16 !rounded-md" />
          </div>

          {/* Title */}
          <SkeletonItem className="h-5 w-4/5 !rounded-md" />
          <SkeletonItem className="h-3.5 w-3/5 !rounded-md" />
        </div>
      </div>

      {/* Bottom Bar: Price & Add to Cart Button */}
      <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-border)]/50">
        <div>
          <SkeletonItem className="h-6 w-16 !rounded-md" />
          <SkeletonItem className="mt-1 h-3 w-10 !rounded-md" />
        </div>
        <SkeletonItem className="h-9 w-24 !rounded-full" />
      </div>
    </article>
  );
}

/**
 * Category Pill Skeleton (Matches Menu.tsx & PopularPreview.tsx)
 */
export function CategorySkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2.5
        rounded-full
        border
        border-[var(--color-border)]
        bg-white
        px-3.5
        py-2
        shadow-sm
        dark:bg-[var(--bg-surface)]
        ${className}
      `}
    >
      <SkeletonItem circle className="h-8 w-8 !rounded-full shrink-0" />
      <SkeletonItem className="h-4 w-16 !rounded-md" />
    </div>
  );
}

/**
 * Generic Content / Card Skeleton (Matches Offers, Addresses, Orders)
 */
export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-white
        p-5
        shadow-sm
        dark:bg-[var(--bg-surface)]
        space-y-4
        ${className}
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SkeletonItem circle className="h-10 w-10 shrink-0" />
          <div className="space-y-1.5">
            <SkeletonItem className="h-4 w-32 !rounded-md" />
            <SkeletonItem className="h-3 w-20 !rounded-md" />
          </div>
        </div>
        <SkeletonItem className="h-6 w-16 !rounded-full" />
      </div>

      <div className="space-y-2 pt-1">
        <SkeletonItem className="h-3.5 w-full !rounded-md" />
        <SkeletonItem className="h-3.5 w-4/5 !rounded-md" />
        <SkeletonItem className="h-3.5 w-2/3 !rounded-md" />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/60">
        <SkeletonItem className="h-4 w-24 !rounded-md" />
        <SkeletonItem className="h-8 w-20 !rounded-lg" />
      </div>
    </div>
  );
}

/**
 * List / Table Row Skeleton (Matches Notifications, Reviews, History)
 */
export function ListSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-4
        rounded-xl
        border
        border-[var(--color-border)]
        bg-white
        p-4
        shadow-sm
        dark:bg-[var(--bg-surface)]
        ${className}
      `}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <SkeletonItem circle className="h-10 w-10 shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonItem className="h-4 w-48 !rounded-md" />
          <SkeletonItem className="h-3 w-3/4 !rounded-md" />
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <SkeletonItem className="h-3 w-14 !rounded-md" />
        <SkeletonItem className="h-8 w-8 !rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Full Product Details Page Skeleton (Matches ProductDetailsClient.tsx)
 */
export function ProductDetailSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto max-w-7xl px-4 py-8 md:px-8 ${className}`}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Product Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm dark:bg-[var(--bg-surface)]">
            <SkeletonItem className="h-full w-full !rounded-2xl" />
          </div>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonItem key={i} className="h-20 w-20 !rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <SkeletonItem className="h-6 w-24 !rounded-full" />
              <SkeletonItem className="h-6 w-20 !rounded-full" />
            </div>
            <SkeletonItem className="h-8 w-3/4 !rounded-lg" />
            <SkeletonItem className="h-4 w-1/3 !rounded-md" />
          </div>

          {/* Price & Rating */}
          <div className="flex items-center gap-4 py-2 border-y border-[var(--color-border)]">
            <SkeletonItem className="h-9 w-28 !rounded-md" />
            <SkeletonItem className="h-6 w-24 !rounded-full" />
          </div>

          {/* Description Paragraph */}
          <div className="space-y-2">
            <SkeletonItem className="h-4 w-full !rounded-md" />
            <SkeletonItem className="h-4 w-5/6 !rounded-md" />
            <SkeletonItem className="h-4 w-2/3 !rounded-md" />
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 pt-4">
            <SkeletonItem className="h-12 w-32 !rounded-xl" />
            <SkeletonItem className="h-12 flex-1 !rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Common Reusable SkeletonLoader Component
 */
export default function SkeletonLoader({
  variant = "generic",
  count = 1,
  className = "",
  gridClassName = "",
  lines = 3,
  width,
  height,
  circle = false,
  shimmer = true,
  pulse = true,
  ...props
}: SkeletonProps) {
  const items = Array.from({ length: Math.max(1, count) });

  // 1. PRODUCT CARDS GRID
  if (variant === "product") {
    const defaultGrid =
      gridClassName ||
      "grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4";

    return (
      <div className={defaultGrid} {...props}>
        {items.map((_, i) => (
          <ProductSkeleton key={i} className={className} />
        ))}
      </div>
    );
  }

  // 2. CATEGORY PILLS STRIP / GRID
  if (variant === "category") {
    const defaultGrid =
      gridClassName || "flex items-center gap-2.5 overflow-x-auto py-2";

    return (
      <div className={defaultGrid} {...props}>
        {items.map((_, i) => (
          <CategorySkeleton key={i} className={className} />
        ))}
      </div>
    );
  }

  // 3. CARD VARIANT (Offers, Addresses, Orders)
  if (variant === "card") {
    const defaultGrid =
      gridClassName || "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

    return (
      <div className={defaultGrid} {...props}>
        {items.map((_, i) => (
          <CardSkeleton key={i} className={className} />
        ))}
      </div>
    );
  }

  // 4. LIST / TABLE ROWS VARIANT (Reviews, Notifications)
  if (variant === "list" || variant === "table") {
    const defaultGrid = gridClassName || "flex flex-col gap-3";

    return (
      <div className={defaultGrid} {...props}>
        {items.map((_, i) => (
          <ListSkeleton key={i} className={className} />
        ))}
      </div>
    );
  }

  // 5. FULL PRODUCT DETAIL PAGE
  if (variant === "product-detail") {
    return <ProductDetailSkeleton className={className} {...props} />;
  }

  // 6. MULTI-LINE TEXT SKELETON
  if (variant === "text") {
    return (
      <div className={`space-y-2 ${className}`} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonItem
            key={i}
            height={height || "1rem"}
            width={i === lines - 1 ? "60%" : width || "100%"}
            shimmer={shimmer}
            pulse={pulse}
          />
        ))}
      </div>
    );
  }

  // 7. CIRCULAR SKELETON
  if (variant === "circular" || circle) {
    return (
      <SkeletonItem
        circle
        width={width || height || "2.5rem"}
        height={height || width || "2.5rem"}
        className={className}
        shimmer={shimmer}
        pulse={pulse}
        {...props}
      />
    );
  }

  // 8. GENERIC / RECTANGULAR SKELETON
  if (count > 1) {
    return (
      <div className={gridClassName || "space-y-2"} {...props}>
        {items.map((_, i) => (
          <SkeletonItem
            key={i}
            width={width}
            height={height || "2.5rem"}
            className={className}
            shimmer={shimmer}
            pulse={pulse}
          />
        ))}
      </div>
    );
  }

  return (
    <SkeletonItem
      width={width}
      height={height}
      className={className}
      shimmer={shimmer}
      pulse={pulse}
      {...props}
    />
  );
}

