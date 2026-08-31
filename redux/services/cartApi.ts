import { baseApi } from "./baseApi";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const assetOrigin = new URL(apiUrl).origin;

const toAssetUrl = (path?: string | null) => {
  if (!path || /^https?:\/\//i.test(path)) return path || "";
  return `${assetOrigin}${path.startsWith("/") ? path : `/${path}`}`;
};

export interface CartItem {
  id: number;
  cart_item_id: number;
  product_id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  images?: string[];
  image?: string | null;
  img: string;
  is_active: boolean;
  availability_type: "IN_STOCK" | "MADE_TO_ORDER";
  isMadeToOrder: boolean;
  category_id: number | string;
  category_name: string;
  quantity: number;
  itemTotal: number;
  isOutOfStock: boolean;
  exceedsStock: boolean;
  added_at?: string;
  updated_at?: string;
}

export interface CartSummary {
  totalItems: number;
  itemTypesCount: number;
  subtotal: number;
  discountPercent: number;
  discount: number;
  discountedSubtotal: number;

  gstPercent: number;
  taxInclusive: boolean;
  taxAmount: number;
  taxAddedToTotal: number;
  taxLabel: string;

  deliveryChargeType: string;
  deliveryChargeValue: number;
  deliveryFee: number;
  isFreeDelivery: boolean;
  freeDeliveryThreshold: number;
  freeDeliverySavings: number;
  freeDeliveryShortfall: number;

  distanceKm: number | null;
  maxDeliveryDistance: number;
  isOutOfRange: boolean;

  packagingFee: number;
  platformFee: number;
  codFee: number;
  isCod: boolean;

  minimumOrderAmount: number;
  isBelowMinimumOrder: boolean;
  minimumOrderShortfall: number;

  appliedOffer?: {
    id: number | null;
    code: string;
    title: string;
    badge?: string;
    type?: string;
    discount: number;
  } | null;
  offerEvaluation?: any;

  grandTotal: number;
  hasOutOfStockItems: boolean;
  outOfStockCount: number;

  timer?: {
    calculatedAt: string;
    expiresAt: string;
    validForSeconds: number;
  };
}

export interface CartData {
  items: CartItem[];
  summary: CartSummary;
  pricing?: any;
  deliveryAddress?: any;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data: CartData;
}

const transformCartResponse = (response: any): CartResponse => {
  const rawData = response?.data;

  // If response.data is an array (legacy fallback) or { items, summary }
  const rawItems = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.items)
    ? rawData.items
    : [];

  const items: CartItem[] = rawItems.map((item: any) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const stock = Number(item.stock) || 0;
    const availabilityType: "IN_STOCK" | "MADE_TO_ORDER" =
      String(item.availability_type || "IN_STOCK").toUpperCase() === "MADE_TO_ORDER"
        ? "MADE_TO_ORDER"
        : "IN_STOCK";
    const isMadeToOrder = availabilityType === "MADE_TO_ORDER";
    const firstImg = Array.isArray(item.images)
      ? item.images[0]
      : item.image || item.img || null;

    return {
      id: Number(item.product_id || item.id),
      cart_item_id: Number(item.cart_item_id || item.id),
      product_id: Number(item.product_id || item.id),
      name: item.name || "Item",
      description: item.description || "",
      price,
      stock,
      images: Array.isArray(item.images) ? item.images : [],
      image: toAssetUrl(firstImg),
      img: toAssetUrl(firstImg),
      is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
      availability_type: availabilityType,
      isMadeToOrder,
      category_id: item.category_id || "",
      category_name: item.category_name || "Menu",
      quantity,
      itemTotal: price * quantity,
      // MADE_TO_ORDER products are never out of stock
      isOutOfStock: isMadeToOrder ? false : (stock <= 0 || item.is_active === false),
      exceedsStock: isMadeToOrder ? false : quantity > stock,
      added_at: item.added_at,
      updated_at: item.updated_at,
    };
  });

  const rawSummary = rawData?.summary || {};
  const rawPricing = rawData?.pricing || {};

  const totalItems =
    rawSummary.totalItems !== undefined
      ? Number(rawSummary.totalItems)
      : items.reduce((sum, it) => sum + it.quantity, 0);

  const subtotal =
    rawSummary.subtotal !== undefined
      ? Number(rawSummary.subtotal)
      : items.reduce((sum, it) => sum + it.itemTotal, 0);

  const discountPercent = Number(rawSummary.discountPercent ?? rawPricing.discount_percent ?? 0);
  const discount = Number(rawSummary.discount ?? rawPricing.discount ?? 0);
  const discountedSubtotal = Number(rawSummary.discountedSubtotal ?? rawPricing.discounted_subtotal ?? (subtotal - discount));

  const gstPercent = Number(rawSummary.gstPercent ?? rawPricing.gst_percent ?? 0);
  const taxInclusive = Boolean(rawSummary.taxInclusive ?? rawPricing.tax_inclusive ?? false);
  const taxAmount = Number(rawSummary.taxAmount ?? rawPricing.tax_amount ?? 0);
  const taxAddedToTotal = Number(rawSummary.taxAddedToTotal ?? rawPricing.tax_added_to_total ?? 0);
  const taxLabel = rawSummary.taxLabel || rawPricing.tax_label || (taxInclusive ? "Inclusive of all taxes" : `GST (${gstPercent}%)`);

  const deliveryChargeType = rawSummary.deliveryChargeType || rawPricing.delivery_charge_type || "fixed";
  const deliveryChargeValue = Number(rawSummary.deliveryChargeValue ?? rawPricing.delivery_charge_value ?? 0);
  const deliveryFee = Number(rawSummary.deliveryFee ?? rawPricing.delivery_fee ?? 0);
  const isFreeDelivery = Boolean(rawSummary.isFreeDelivery ?? rawPricing.is_free_delivery ?? false);
  const freeDeliveryThreshold = Number(rawSummary.freeDeliveryThreshold ?? rawPricing.free_delivery_threshold ?? 0);
  const freeDeliverySavings = Number(rawSummary.freeDeliverySavings ?? rawPricing.free_delivery_savings ?? 0);
  const freeDeliveryShortfall = Number(rawSummary.freeDeliveryShortfall ?? rawPricing.free_delivery_shortfall ?? 0);

  const distanceKm = rawSummary.distanceKm ?? rawPricing.distance_km ?? null;
  const maxDeliveryDistance = Number(rawSummary.maxDeliveryDistance ?? rawPricing.max_delivery_distance ?? 0);
  const isOutOfRange = Boolean(rawSummary.isOutOfRange ?? rawPricing.is_out_of_range ?? false);

  const packagingFee = Number(rawSummary.packagingFee ?? rawPricing.packaging_fee ?? 0);
  const platformFee = Number(rawSummary.platformFee ?? rawPricing.platform_fee ?? 0);
  const codFee = Number(rawSummary.codFee ?? rawPricing.cod_fee ?? 0);
  const isCod = Boolean(rawSummary.isCod ?? rawPricing.is_cod ?? true);

  const minimumOrderAmount = Number(rawSummary.minimumOrderAmount ?? rawPricing.minimum_order_amount ?? 0);
  const isBelowMinimumOrder = Boolean(rawSummary.isBelowMinimumOrder ?? rawPricing.is_below_minimum_order ?? false);
  const minimumOrderShortfall = Number(rawSummary.minimumOrderShortfall ?? rawPricing.minimum_order_shortfall ?? 0);

  const grandTotal =
    rawSummary.grandTotal !== undefined
      ? Number(rawSummary.grandTotal)
      : rawPricing.grand_total !== undefined
      ? Number(rawPricing.grand_total)
      : Math.max(0, subtotal + deliveryFee - discount);

  const summary: CartSummary = {
    totalItems,
    itemTypesCount: items.length,
    subtotal,
    discountPercent,
    discount,
    discountedSubtotal,

    gstPercent,
    taxInclusive,
    taxAmount,
    taxAddedToTotal,
    taxLabel,

    deliveryChargeType,
    deliveryChargeValue,
    deliveryFee,
    isFreeDelivery,
    freeDeliveryThreshold,
    freeDeliverySavings,
    freeDeliveryShortfall,

    distanceKm,
    maxDeliveryDistance,
    isOutOfRange,

    packagingFee,
    platformFee,
    codFee,
    isCod,

    minimumOrderAmount,
    isBelowMinimumOrder,
    minimumOrderShortfall,

    appliedOffer: rawSummary.appliedOffer || rawPricing.applied_offer || null,
    offerEvaluation: rawSummary.offerEvaluation || rawPricing.offer_evaluation || null,

    grandTotal,
    hasOutOfStockItems: items.some((it) => it.isOutOfStock || it.exceedsStock),
    outOfStockCount: items.filter((it) => it.isOutOfStock || it.exceedsStock).length,

    timer: rawSummary.timer || (rawPricing.calculated_at ? {
      calculatedAt: rawPricing.calculated_at,
      expiresAt: rawPricing.expires_at,
      validForSeconds: rawPricing.valid_for_seconds,
    } : undefined),
  };

  return {
    success: Boolean(response?.success ?? true),
    message: response?.message,
    data: {
      items,
      summary,
      pricing: rawPricing,
      deliveryAddress: rawData?.deliveryAddress,
    },
  };
};

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<
      CartResponse,
      { addressId?: number; paymentMethod?: string; offerCode?: string } | void
    >({
      query: (params) => {
        if (!params) return "/cart";
        const query = new URLSearchParams();
        if (params.addressId) query.append("addressId", String(params.addressId));
        if (params.paymentMethod) query.append("paymentMethod", params.paymentMethod);
        if (params.offerCode) query.append("offerCode", params.offerCode);
        const qStr = query.toString();
        return `/cart${qStr ? `?${qStr}` : ""}`;
      },
      transformResponse: transformCartResponse,
      providesTags: ["Cart"],
    }),
    addCartItem: build.mutation<
      CartResponse,
      { productId: number; quantity?: number }
    >({
      query: (body) => ({
        url: "/cart/items",
        method: "POST",
        body,
      }),
      transformResponse: transformCartResponse,
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: build.mutation<
      CartResponse,
      { productId: number; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: transformCartResponse,
      invalidatesTags: ["Cart"],
    }),
    deleteCartItem: build.mutation<CartResponse, number>({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: "DELETE",
      }),
      transformResponse: transformCartResponse,
      invalidatesTags: ["Cart"],
    }),
    clearCart: build.mutation<CartResponse, void>({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      transformResponse: transformCartResponse,
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useClearCartMutation,
} = cartApi;
