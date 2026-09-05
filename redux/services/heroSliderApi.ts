import { baseApi } from "./baseApi";

export interface HeroSliderItem {
  id: number;
  tag: string;
  title: string;
  highlight: string;
  subtitle?: string | null;
  cta: string;
  href: string;
  secondary_cta?: string | null;
  secondaryCta?: string | null;
  secondary_href?: string | null;
  secondaryHref?: string | null;
  image: string;
  img?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const heroSliderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getActiveHeroSliders: build.query<HeroSliderItem[], void>({
      query: () => "/hero-sliders",
      transformResponse: (res: any) => {
        return Array.isArray(res?.data) ? res.data : [];
      },
      providesTags: ["HeroSliders"],
    }),
  }),
});

export const { useGetActiveHeroSlidersQuery } = heroSliderApi;

