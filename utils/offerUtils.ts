export interface ProductOffer {
  id: number;
  title: string;
  code: string;
  description?: string | null;
  badge?: string | null;
  type: "PERCENTAGE" | "FLAT" | "BOGO" | "PRODUCT" | "CATEGORY" | string;
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number | null;
  buy_qty?: number;
  get_qty?: number;
  banner_image?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  auto_apply?: boolean;
  priority?: number;
  is_product_specific?: boolean;
  applied_scope?: "PRODUCT" | "CATEGORY";
  target_product_ids?: (number | string)[];
  target_category_ids?: (number | string)[];
}

/**
 * Returns the highest priority applicable offer for a product.
 * Product-specific offers (target_product_ids) are given priority over category offers.
 */
export function getProductPrimaryOffer(
  product: any,
  fallbackOffers: any[] = []
): ProductOffer | null {
  if (!product) return null;

  // 1. If product already has backend-computed offers, take the top one
  // (the backend already orders product-specific offers first, followed by category offers)
  if (Array.isArray(product.offers) && product.offers.length > 0) {
    return product.offers[0];
  }

  if (!Array.isArray(fallbackOffers) || fallbackOffers.length === 0) {
    return null;
  }

  const productId = String(product.id ?? "").trim();
  const categoryId = String(product.category_id ?? product.category ?? "").trim();

  // 2. Client-side fallback: check product-specific offers first
  if (productId) {
    const productOffer = fallbackOffers.find((offer) => {
      if (!offer || !offer.is_active) return false;
      const targetProductIds = Array.isArray(offer.target_product_ids)
        ? offer.target_product_ids
        : [];
      return targetProductIds.some((id: any) => String(id).trim() === productId);
    });

    if (productOffer) {
      return {
        ...productOffer,
        is_product_specific: true,
        applied_scope: "PRODUCT",
      };
    }
  }

  // 3. Client-side fallback: check category offers next
  if (categoryId) {
    const categoryOffer = fallbackOffers.find((offer) => {
      if (!offer || !offer.is_active) return false;
      const targetCategoryIds = Array.isArray(offer.target_category_ids)
        ? offer.target_category_ids
        : [];
      return targetCategoryIds.some((id: any) => String(id).trim() === categoryId);
    });

    if (categoryOffer) {
      return {
        ...categoryOffer,
        is_product_specific: false,
        applied_scope: "CATEGORY",
      };
    }
  }

  return null;
}

/**
 * Returns all applicable offers for a product, prioritizing product-specific offers
 */
export function getAllProductOffers(
  product: any,
  fallbackOffers: any[] = []
): ProductOffer[] {
  if (!product) return [];

  if (Array.isArray(product.offers) && product.offers.length > 0) {
    return product.offers;
  }

  if (!Array.isArray(fallbackOffers) || fallbackOffers.length === 0) {
    return [];
  }

  const productId = String(product.id ?? "").trim();
  const categoryId = String(product.category_id ?? product.category ?? "").trim();

  const seenIds = new Set<number>();
  const productSpecific: ProductOffer[] = [];
  const categorySpecific: ProductOffer[] = [];

  for (const offer of fallbackOffers) {
    if (!offer || !offer.is_active || seenIds.has(offer.id)) continue;

    const targetProductIds = Array.isArray(offer.target_product_ids)
      ? offer.target_product_ids
      : [];
    const targetCategoryIds = Array.isArray(offer.target_category_ids)
      ? offer.target_category_ids
      : [];

    const matchesProduct =
      Boolean(productId) &&
      targetProductIds.some((id: any) => String(id).trim() === productId);

    const matchesCategory =
      Boolean(categoryId) &&
      targetCategoryIds.some((id: any) => String(id).trim() === categoryId);

    if (matchesProduct) {
      seenIds.add(offer.id);
      productSpecific.push({
        ...offer,
        is_product_specific: true,
        applied_scope: "PRODUCT",
      });
    } else if (matchesCategory) {
      seenIds.add(offer.id);
      categorySpecific.push({
        ...offer,
        is_product_specific: false,
        applied_scope: "CATEGORY",
      });
    }
  }

  return [...productSpecific, ...categorySpecific];
}

/**
 * Formats a short badge label for an offer to display on product cards
 */
export function formatOfferBadge(offer: ProductOffer | null | undefined): string {
  if (!offer) return "";
  if (offer.type === "BOGO") {
    return `BUY ${offer.buy_qty || 1} GET ${offer.get_qty || 1} FREE`;
  }
  if (offer.badge) {
    return offer.badge;
  }
  if (offer.type === "PERCENTAGE" && Number(offer.discount_value) > 0) {
    return `${offer.discount_value}% OFF`;
  }
  if (offer.type === "FLAT" && Number(offer.discount_value) > 0) {
    return `₹${offer.discount_value} OFF`;
  }
  return offer.title || "SPECIAL OFFER";
}

