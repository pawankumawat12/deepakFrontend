import { baseApi } from "./baseApi";

export interface WhyChooseUsItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  image?: string | null;
  color_class?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WhyChooseUsSectionSettings {
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  cta_text: string;
  cta_href: string;
}

export interface WhyChooseUsResponse {
  items: WhyChooseUsItem[];
  section: WhyChooseUsSectionSettings;
}

export const whyChooseUsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWhyChooseUs: build.query<WhyChooseUsResponse, void>({
      query: () => "/why-choose-us",
      transformResponse: (res: any) => {
        return {
          items: Array.isArray(res?.data?.items) ? res.data.items : [],
          section: res?.data?.section || {
            badge: "Why Choose Us",
            title: "More Than Just",
            highlight: "Fast Food",
            subtitle: "We believe great food starts with great ingredients, careful preparation and a whole lot of love.",
            cta_text: "Taste The Difference",
            cta_href: "/menu",
          },
        };
      },
      providesTags: ["WhyChooseUs"],
    }),
  }),
});

export const { useGetWhyChooseUsQuery } = whyChooseUsApi;
