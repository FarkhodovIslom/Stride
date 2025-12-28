"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStore {
  isMinimized: boolean;
  toggleSidebar: () => void;
  setSidebarMinimized: (minimized: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isMinimized: false,
      toggleSidebar: () =>
        set((state) => ({
          isMinimized: !state.isMinimized,
        })),
      setSidebarMinimized: (minimized) => set({ isMinimized: minimized }),
    }),
    {
      name: "stride-sidebar",
    }
  )
);
