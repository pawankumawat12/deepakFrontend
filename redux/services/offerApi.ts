import { baseApi } from "./baseApi";

export interface OfferItem {
  id: number;
  title: string;
  code: string;
  description?: string | null;
  badge?: string | null;
  type: "PERCENTAGE" | "FLAT" | "BOGO" | "PRODUCT" | "CATEGORY";
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number | null;
  target_product_ids?: number[];
  target_category_ids?: (number | string)[];
  buy_qty?: number;
  get_qty?: number;
  banner_image?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  usage_limit?: number | null;
  used_count: number;
  is_active: boolean;
  auto_apply: boolean;
  priority: number;
  created_at?: string;
  updated_at?: string;
}

export interface OfferValidationResult {
  isEligible: boolean;
  discount: number;
  discountedSubtotal?: number;
  reason?: string;
  offer?: {
    id: number;
    code: string;
    title: string;
    badge?: string;
    type: string;
    discount_value: number;
  };
}

export const offerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOffers: build.query<OfferItem[], void>({
      query: () => "/offers",
      transformResponse: (res: any) => {
        return Array.isArray(res?.data) ? res.data : [];
      },
      providesTags: ["Offers"],
    }),
    validateOffer: build.mutation<
      { success: boolean; message: string; data: OfferValidationResult },
      { code: string; items?: any[] }
    >({
      query: (body) => ({
        url: "/offers/validate",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetOffersQuery, useValidateOfferMutation } = offerApi;

