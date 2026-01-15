"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "@/lib/api";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<{ user: User; token: string }>(
            "/auth/login",
            { email, password }
          );

          // Save token to both localStorage and cookie
          if (typeof window !== "undefined") {
            localStorage.setItem("token", response.token);
            // Set cookie for middleware (max age 30 days)
            document.cookie = `token=${response.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
          }

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: (error as Error).message,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (email: string, password: string, name?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<{ user: User; token: string }>(
            "/auth/register",
            { email, password, name }
          );

          // Save token to both localStorage and cookie
          if (typeof window !== "undefined") {
            localStorage.setItem("token", response.token);
            // Set cookie for middleware (max age 30 days)
            document.cookie = `token=${response.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
          }

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: (error as Error).message,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          // Remove cookie
          document.cookie = "token=; path=/; max-age=0";
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
