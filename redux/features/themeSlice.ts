import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ColorThemeItem, ThemeSettings } from "../services/settingsApi";

export type ThemeMode = "light" | "dark";

export interface ThemeState {
  theme: ThemeMode;
  colorTheme: string;
  availableColorThemes: ColorThemeItem[];
  isLoaded: boolean;
  lastUpdated: number | null;
}

const initialState: ThemeState = {
  theme: "light",
  colorTheme: "matcha",
  availableColorThemes: [],
  isLoaded: false,
  lastUpdated: null,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeSettings: (
      state,
      action: PayloadAction<Partial<ThemeSettings>>
    ) => {
      if (action.payload.theme) {
        state.theme = action.payload.theme === "dark" ? "dark" : "light";
      }
      if (action.payload.colorTheme) {
        state.colorTheme = action.payload.colorTheme;
      }
      if (action.payload.availableColorThemes) {
        state.availableColorThemes = action.payload.availableColorThemes;
      }
      state.isLoaded = true;
      state.lastUpdated = Date.now();
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      state.lastUpdated = Date.now();
    },
    setColorTheme: (state, action: PayloadAction<string>) => {
      state.colorTheme = action.payload;
      state.lastUpdated = Date.now();
    },
  },
});

export const { setThemeSettings, setThemeMode, setColorTheme } =
  themeSlice.actions;

export default themeSlice.reducer;

