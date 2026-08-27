import { baseApi } from "./baseApi";

export interface ColorThemeItem {
  id: string;
  name: string;
  color: string;
  desc: string;
  accent?: string;
}

export interface ThemeSettings {
  theme: "light" | "dark";
  colorTheme: string;
  availableColorThemes?: ColorThemeItem[];
}

export interface ThemeSettingsResponse {
  success: boolean;
  message?: string;
  data: ThemeSettings;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTheme: build.query<ThemeSettingsResponse, void>({
      query: () => "/settings/theme",
      providesTags: ["Settings"],
    }),
  }),
});

export const { useGetThemeQuery } = settingsApi;
