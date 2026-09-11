import { baseApi } from "./baseApi";

export interface CustomerTestimonialItem {
  id: number;
  name: string;
  location?: string | null;
  rating: number;
  review: string;
  avatar?: string | null;
  date_text?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerTestimonialSectionSettings {
  badge: string;
  title: string;
  subtitle: string;
}

export interface CustomerTestimonialResponse {
  testimonials: CustomerTestimonialItem[];
  section: CustomerTestimonialSectionSettings;
}

export const testimonialApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTestimonials: build.query<CustomerTestimonialResponse, void>({
      query: () => "/testimonials",
      transformResponse: (res: any) => {
        return {
          testimonials: Array.isArray(res?.data?.testimonials) ? res.data.testimonials : [],
          section: res?.data?.section || {
            badge: "Customer Love",
            title: "What Our Customers Say",
            subtitle: "Real feedback from genuine food lovers who order from us regularly.",
          },
        };
      },
      providesTags: ["Testimonials"],
    }),
  }),
});

export const { useGetTestimonialsQuery } = testimonialApi;
