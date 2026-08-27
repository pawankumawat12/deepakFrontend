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
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  hasOutOfStockItems: boolean;
}

export interface CartData {
  items: CartItem[];
  summary: CartSummary;
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

  const totalItems =
    rawData?.summary?.totalItems !== undefined
      ? Number(rawData.summary.totalItems)
      : items.reduce((sum, it) => sum + it.quantity, 0);

  const subtotal =
    rawData?.summary?.subtotal !== undefined
      ? Number(rawData.summary.subtotal)
      : items.reduce((sum, it) => sum + it.itemTotal, 0);

  const deliveryFee = Number(rawData?.summary?.deliveryFee || 0);
  const discount = Number(rawData?.summary?.discount || 0);
  const grandTotal =
    rawData?.summary?.grandTotal !== undefined
      ? Number(rawData.summary.grandTotal)
      : Math.max(0, subtotal + deliveryFee - discount);

  const summary: CartSummary = {
    totalItems,
    itemTypesCount: items.length,
    subtotal,
    deliveryFee,
    discount,
    grandTotal,
    hasOutOfStockItems: items.some((it) => it.isOutOfStock || it.exceedsStock),
  };

  return {
    success: Boolean(response?.success ?? true),
    message: response?.message,
    data: {
      items,
      summary,
    },
  };
};

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<CartResponse, void>({
      query: () => "/cart",
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
