import { baseApi } from "./baseApi";

const backendUrl = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) ||
  process.env.VITE_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
  ""
).replace(/\/+$/, "");

const toAssetUrl = (path?: string | null) => {
  if (!path || /^https?:\/\//i.test(path) || /^(?:blob:|data:)/i.test(path)) return path || "";
  return `${backendUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

type ApiProduct = {
  id: number | string;
  name: string;
  description?: string;
  category_id: number | string;
  category_name?: string;
  price: number | string;
  images?: string[];
  is_active?: boolean;
  offers?: any[];
  [key: string]: unknown;
};

type ApiCategory = {
  id: number | string;
  name: string;
  description?: string;
  image?: string;
  is_active?: boolean;
  [key: string]: unknown;
};

type ApiResponse<T> = { data?: T[];[key: string]: unknown };
type ApiItemResponse<T> = { data: T;[key: string]: unknown };
type StoreProductQuery = {
  categoryId?: string | number;
  isActive?: boolean;
  limit?: number;
  page?: number;
};


const normalizeProduct = (product: ApiProduct) => {
  const availabilityType = String(product.availability_type || "IN_STOCK").toUpperCase();
  const isMadeToOrder = availabilityType === "MADE_TO_ORDER";
  return {
    ...product,
    id: Number(product.id),
    category: String(product.category_id),
    categoryName: product.category_name || "Menu",
    price: Number(product.price),
    // MADE_TO_ORDER products have unlimited stock — never treat as 0
    stock: isMadeToOrder ? Infinity : (product.stock !== undefined ? Number(product.stock) : 1),
    img: toAssetUrl(product.images?.[0]),
    image: toAssetUrl(product.images?.[0]),
    isActive: Boolean(product.is_active),
    availability_type: availabilityType,
    isMadeToOrder,
    rating: Number(product.rating || 0),
    total_reviews: Number(product.total_reviews || 0),
    offers: Array.isArray(product.offers) ? product.offers : [],
  };
};

const normalizeCategory = (category: ApiCategory) => ({
  ...category,
  id: String(category.id),
  img: toAssetUrl(category.image),
  isActive: Boolean(category.is_active),
});

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStoreProducts: build.query<
      ApiResponse<ReturnType<typeof normalizeProduct>>,
      StoreProductQuery | void
    >({
      query: (params = {}) => ({
        url: "/products",
        params: { limit: 100, isActive: true, ...params },
      }),
      transformResponse: (response: ApiResponse<ApiProduct>) => ({
        ...response,
        data: (response.data || []).map(normalizeProduct),
      }),
      providesTags: ["Catalog"],
    }),
    getStoreProduct: build.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response: ApiItemResponse<ApiProduct>) => ({
        ...response,
        data: normalizeProduct(response.data),
      }),
      providesTags: (_result, _error, id) => [{ type: "Catalog", id }],
    }),
    getStoreCategories: build.query({
      query: (params = {}) => ({
        url: "/categories",
        params: { limit: 100, isActive: true, ...params },
      }),
      transformResponse: (response: ApiResponse<ApiCategory>) => ({
        ...response,
        data: (response.data || []).map(normalizeCategory),
      }),
      providesTags: ["Catalog"],
    }),
  }),
});

export const {
  useGetStoreProductsQuery,
  useGetStoreProductQuery,
  useGetStoreCategoriesQuery,
} = catalogApi;

export { normalizeProduct };
