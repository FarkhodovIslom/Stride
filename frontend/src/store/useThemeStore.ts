"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeStore {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setResolvedTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: "light",
      toggleTheme: () =>
        set((state) => {
          // Toggle only between light and dark, not system
          const newTheme = state.resolvedTheme === "light" ? "dark" : "light";
          return { theme: newTheme, resolvedTheme: newTheme };
        }),
      setTheme: (theme) => {
        if (theme === "system") {
          // Let the provider determine the resolved theme
          set({ theme });
        } else {
          set({ theme, resolvedTheme: theme });
        }
      },
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
    }),
    {
      name: "stride-theme",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
