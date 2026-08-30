"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetThemeQuery, ColorThemeItem } from "../redux/services/settingsApi";
import {
  setThemeSettings,
  setThemeMode,
  setColorTheme,
  ThemeMode,
} from "../redux/features/themeSlice";
import { RootState } from "../redux/store";

export type Theme = ThemeMode;

interface ThemeContextType {
  theme: Theme;
  colorTheme: string;
  availableColorThemes: ColorThemeItem[];
  isLoading: boolean;
  setTheme: (mode: Theme) => void;
  setColorThemeName: (colorName: string) => void;
  refetchTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeToDOM(nextTheme: Theme, nextColor: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (nextTheme === "dark") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
  } else {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  }
  root.setAttribute("data-color-theme", nextColor);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  // Read persisted theme state directly from Redux Persist store
  const { theme, colorTheme, availableColorThemes, isLoaded } = useSelector(
    (state: RootState) => state.theme || {}
  );

  // Apply theme to DOM immediately on initial mount / change from persisted state
  useEffect(() => {
    applyThemeToDOM(theme || "light", colorTheme || "matcha");
  }, [theme, colorTheme]);

  // Only query the API if we do NOT have valid loaded theme data in Redux Persist!
  // No aggressive polling or repeated requests on route navigation.
  const {
    data: themeResponse,
    isLoading,
    refetch,
  } = useGetThemeQuery(undefined, {
    skip: Boolean(isLoaded && colorTheme && availableColorThemes?.length > 0),
  });

  // When API returns (initial load or explicit refetch), store in Redux Persist
  useEffect(() => {
    if (themeResponse?.data) {
      const serverTheme =
        themeResponse.data.theme === "dark" ? "dark" : "light";
      const serverColor = themeResponse.data.colorTheme || "matcha";
      const serverPalettes = themeResponse.data.availableColorThemes || [];

      dispatch(
        setThemeSettings({
          theme: serverTheme,
          colorTheme: serverColor,
          availableColorThemes: serverPalettes,
        })
      );
    }
  }, [themeResponse, dispatch]);

  const handleSetTheme = (mode: Theme) => {
    dispatch(setThemeMode(mode));
  };

  const handleSetColorTheme = (colorName: string) => {
    dispatch(setColorTheme(colorName));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: theme || "light",
        colorTheme: colorTheme || "matcha",
        availableColorThemes: availableColorThemes || [],
        isLoading: !isLoaded && isLoading,
        setTheme: handleSetTheme,
        setColorThemeName: handleSetColorTheme,
        refetchTheme: refetch,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "light" as Theme,
      colorTheme: "matcha",
      availableColorThemes: [],
      isLoading: false,
      setTheme: () => {},
      setColorThemeName: () => {},
      refetchTheme: () => {},
    };
  }
  return context;
}
