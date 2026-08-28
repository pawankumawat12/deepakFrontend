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

export interface FooterSettings {
  phone_number: string;
  email: string;
  location: string;
  working_hours: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

export interface FooterSettingsResponse {
  success: boolean;
  message?: string;
  data: FooterSettings;
}

export interface LogoSettings {
  logo_url: string;
}

export interface LogoSettingsResponse {
  success: boolean;
  message?: string;
  data: LogoSettings;
}

export interface PaymentQrSettings {
  qr_code_url: string;
  upi_id: string;
  merchant_name: string;
  account_name: string;
  is_enabled: boolean;
  instructions: string;
}

export interface PaymentQrSettingsResponse {
  success: boolean;
  message?: string;
  data: PaymentQrSettings;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTheme: build.query<ThemeSettingsResponse, void>({
      query: () => "/settings/theme",
      providesTags: ["Settings"],
    }),
    getFooter: build.query<FooterSettingsResponse, void>({
      query: () => "/settings/footer",
      providesTags: ["Settings"],
    }),
    getLogo: build.query<LogoSettingsResponse, void>({
      query: () => "/settings/logo",
      providesTags: ["Settings"],
    }),
    getPaymentQr: build.query<PaymentQrSettingsResponse, void>({
      query: () => "/settings/payment-qr",
      providesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetThemeQuery,
  useGetFooterQuery,
  useGetLogoQuery,
  useGetPaymentQrQuery,
} = settingsApi;
