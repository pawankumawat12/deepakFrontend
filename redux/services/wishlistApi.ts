import { baseApi } from "./baseApi";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const assetOrigin = new URL(apiUrl).origin;

const toAssetUrl = (path?: string) => {
  if (!path || /^https?:\/\//i.test(path)) return path || "";
  return `${assetOrigin}${path.startsWith("/") ? path : `/${path}`}`;
};

export type WishlistItem = {
  availability_type: string;
  wishlist_id: number;
  product_id: number;
  wishlisted_at: string;
  id: number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  images?: string[];
  img?: string;
  image?: string;
  is_active?: boolean;
  category_id?: number | string;
  category_name?: string;
  category?: string;
  categoryName?: string;
  rating?: number;
  total_reviews?: number;
};

export type WishlistResponse = {
  message: string;
  data: WishlistItem[];
  inWishlist?: boolean;
};

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWishlist: build.query<WishlistResponse, void>({
      query: () => "/wishlist",
      transformResponse: (response: WishlistResponse) => ({
        ...response,
        data: (response.data || []).map((item) => {
          const isMadeToOrder = String(item.availability_type || "").toUpperCase() === "MADE_TO_ORDER";
          return {
            ...item,
            id: Number(item.product_id || item.id),
            price: Number(item.price),
            stock: isMadeToOrder ? Infinity : (item.stock !== undefined ? Number(item.stock) : 1),
            availability_type: item.availability_type || "IN_STOCK",
            isMadeToOrder,
            category: item.category_name || "Menu",
            categoryName: item.category_name || "Menu",
            img: toAssetUrl(item.images?.[0]),
            image: toAssetUrl(item.images?.[0]),
          };
        }),
      }),
      providesTags: ["Wishlist"],
    }),
    addWishlistItem: build.mutation<WishlistResponse, { productId: number }>({
      query: (body) => ({ url: "/wishlist/items", method: "POST", body }),
      invalidatesTags: ["Wishlist"],
    }),
    removeWishlistItem: build.mutation<WishlistResponse, number>({
      query: (productId) => ({
        url: `/wishlist/items/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
    toggleWishlist: build.mutation<WishlistResponse, { productId: number }>({
      query: (body) => ({ url: "/wishlist/toggle", method: "POST", body }),
      invalidatesTags: ["Wishlist"],
    }),
    clearWishlist: build.mutation<WishlistResponse, void>({
      query: () => ({ url: "/wishlist", method: "DELETE" }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddWishlistItemMutation,
  useRemoveWishlistItemMutation,
  useToggleWishlistMutation,
  useClearWishlistMutation,
} = wishlistApi;

