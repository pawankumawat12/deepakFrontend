import { baseApi } from "./baseApi";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const assetOrigin = new URL(apiUrl).origin;

type ApiProduct = {
  id: number | string;
  name: string;
  description?: string;
  category_id: number | string;
  category_name?: string;
  price: number | string;
  images?: string[];
  is_active?: boolean;
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

const toAssetUrl = (path?: string) => {
  if (!path || /^https?:\/\//i.test(path)) return path || "";
  return `${assetOrigin}${path.startsWith("/") ? path : `/${path}`}`;
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
