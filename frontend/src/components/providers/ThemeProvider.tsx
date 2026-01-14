"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setResolvedTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;

    // Function to get system preference
    const getSystemTheme = (): "light" | "dark" => {
      if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return "light";
    };

    // Determine actual theme to apply
    const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

    // Update resolved theme in store
    setResolvedTheme(resolvedTheme);

    // Apply theme to DOM
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, setResolvedTheme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      setResolvedTheme(newTheme);

      const root = document.documentElement;
      if (newTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, setResolvedTheme]);

  return <>{children}</>;
}
