import { baseApi } from "./baseApi";

export interface ReviewItem {
  id: number;
  user_id: number;
  product_id?: number | null;
  type: "product" | "site";
  rating: number;
  title?: string | null;
  comment: string;
  is_hidden: boolean;
  status: "published" | "hidden";
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_image?: string | null;
  product_name?: string | null;
  product_image?: string | null;
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: ReviewItem[];
    summary: ReviewSummary;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore?: boolean;
    };
  };
}

export interface MyReviewsResponse {
  success: boolean;
  data: {
    reviews: ReviewItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore?: boolean;
    };
  };
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<
      ReviewsResponse,
      { productId: number | string; page?: number; limit?: number }
    >({
      query: ({ productId, page = 1, limit = 10 }) => ({
        url: `/reviews/product/${productId}`,
        params: { page, limit },
      }),
      providesTags: ["Reviews"],
    }),
    getSiteReviews: builder.query<
      ReviewsResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/reviews/site",
        params: params || { page: 1, limit: 10 },
      }),
      providesTags: ["Reviews"],
    }),
    getMyReviews: builder.query<
      MyReviewsResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/reviews/my",
        params: params || { page: 1, limit: 20 },
      }),
      providesTags: ["Reviews"],
    }),
    getReviewStats: builder.query<{ success: boolean; data: any }, void>({
      query: () => "/reviews/stats",
      providesTags: ["Reviews"],
    }),
    createProductReview: builder.mutation<
      { success: boolean; message: string; data: ReviewItem },
      {
        productId: number | string;
        rating: number;
        title?: string;
        comment: string;
      }
    >({
      query: ({ productId, ...body }) => ({
        url: `/reviews/product/${productId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reviews"],
    }),
    createSiteReview: builder.mutation<
      { success: boolean; message: string; data: ReviewItem },
      { rating: number; title?: string; comment: string }
    >({
      query: (body) => ({
        url: "/reviews/site",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reviews"],
    }),
    updateReview: builder.mutation<
      { success: boolean; message: string; data: ReviewItem },
      { id: number | string; rating?: number; title?: string; comment?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation<
      { success: boolean; message: string },
      number | string
    >({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useGetSiteReviewsQuery,
  useGetMyReviewsQuery,
  useGetReviewStatsQuery,
  useCreateProductReviewMutation,
  useCreateSiteReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;

