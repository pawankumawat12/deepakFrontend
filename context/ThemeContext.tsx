"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type ColorTheme = "matcha" | "caramel" | "mocha" | "berry";

export interface ColorThemeOption {
  id: ColorTheme;
  name: string;
  color: string;
  desc: string;
}

export const COLOR_THEMES: ColorThemeOption[] = [
  {
    id: "matcha",
    name: "Matcha Green",
    color: "#7cb324",
    desc: "Organic matcha & espresso",
  },
  {
    id: "caramel",
    name: "Espresso Caramel",
    color: "#e86b1a",
    desc: "Warm roasted caramel",
  },
  {
    id: "mocha",
    name: "Golden Mocha",
    color: "#f5a623",
    desc: "Golden honey & cocoa",
  },
  {
    id: "berry",
    name: "Velvet Berry",
    color: "#e11d48",
    desc: "Rich berry roast",
  },
];

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("matcha");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("sfc_theme") as Theme | null;
      const savedColor = localStorage.getItem("sfc_color_theme") as ColorTheme | null;

      const activeColor =
        savedColor === "matcha" ||
        savedColor === "caramel" ||
        savedColor === "mocha" ||
        savedColor === "berry"
          ? savedColor
          : "matcha";

      setColorThemeState(activeColor);

      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeState(savedTheme);
        applyTheme(savedTheme, activeColor);
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = prefersDark ? "dark" : "light";
        setThemeState(initial);
        applyTheme(initial, activeColor);
      }
    } catch {
      applyTheme("light", "matcha");
    }
    setMounted(true);
  }, []);

  const applyTheme = (nextTheme: Theme, nextColor: ColorTheme) => {
    const root = document.documentElement;
    if (nextTheme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
    root.setAttribute("data-color-theme", nextColor);
  };

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    try {
      localStorage.setItem("sfc_theme", nextTheme);
    } catch {}
    applyTheme(nextTheme, colorTheme);
  };

  const setColorTheme = (nextColor: ColorTheme) => {
    setColorThemeState(nextColor);
    try {
      localStorage.setItem("sfc_color_theme", nextColor);
    } catch {}
    applyTheme(theme, nextColor);
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, colorTheme, toggleTheme, setTheme, setColorTheme }}
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
      colorTheme: "matcha" as ColorTheme,
      toggleTheme: () => {},
      setTheme: () => {},
      setColorTheme: () => {},
    };
  }
  return context;
}
