import { baseApi } from "./baseApi";

export interface CmsNavPage {
  id: number;
  title: string;
  slug: string;
}

export interface CmsPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsPagesResponse {
  success: boolean;
  data: CmsNavPage[];
}

export interface CmsPageResponse {
  success: boolean;
  data: CmsPage;
  message?: string;
}

export const cmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCmsPages: builder.query<CmsPagesResponse, void>({
      query: () => "/cms/pages",
      providesTags: ["CmsPages"],
    }),
    getCmsPageBySlug: builder.query<CmsPageResponse, string>({
      query: (slug) => `/cms/pages/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "CmsPages", id: slug }],
    }),
  }),
});

export const {
  useGetCmsPagesQuery,
  useGetCmsPageBySlugQuery,
} = cmsApi;

