"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useGetThemeQuery, ColorThemeItem } from "../redux/services/settingsApi";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  colorTheme: string;
  availableColorThemes: ColorThemeItem[];
  isLoading: boolean;
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
  const { data: themeResponse, isLoading } = useGetThemeQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [theme, setThemeState] = useState<Theme>("light");
  const [colorTheme, setColorThemeState] = useState<string>("matcha");
  const [availableColorThemes, setAvailableColorThemes] = useState<ColorThemeItem[]>([]);

  useEffect(() => {
    if (themeResponse?.data) {
      const serverTheme = themeResponse.data.theme === "dark" ? "dark" : "light";
      const serverColor = themeResponse.data.colorTheme || "matcha";
      const serverPalettes = themeResponse.data.availableColorThemes || [];

      setThemeState(serverTheme);
      setColorThemeState(serverColor);
      setAvailableColorThemes(serverPalettes);
      applyThemeToDOM(serverTheme, serverColor);
    }
  }, [themeResponse]);

  return (
    <ThemeContext.Provider
      value={{ theme, colorTheme, availableColorThemes, isLoading }}
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
    };
  }
  return context;
}
