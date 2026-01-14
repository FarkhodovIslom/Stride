"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";
import ServerWakeUp from "./ServerWakeUp";
import { useHealthCheck } from "@/hooks/useHealthCheck";

interface ApiStatusContextType {
  isServerAwake: boolean;
  isLoading: boolean;
  wakeUpServer: () => Promise<void>;
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

export function ApiStatusProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showWakeUp, setShowWakeUp] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);
  const { isServerAwake, checkServer } = useHealthCheck();
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isWakingUpRef = useRef(false);

  // Check if current page is an auth page (don't show loader on these)
  const isAuthPage = pathname?.startsWith('/auth');

  // Start wake-up sequence
  const startWakeUp = useCallback(async () => {
    if (isWakingUpRef.current || isServerAwake || isAuthPage) return;

    isWakingUpRef.current = true;
    setShowWakeUp(true);

    // Check server status periodically
    checkIntervalRef.current = setInterval(async () => {
      try {
        const isAwake = await checkServer();
        if (isAwake) {
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
          // Hide wake-up after a short delay for smooth transition
          setTimeout(() => {
            setShowWakeUp(false);
            isWakingUpRef.current = false;
          }, 500);
        }
      } catch (error) {
        console.error("Health check failed:", error);
      }
    }, 2000);
  }, [isServerAwake, checkServer, isAuthPage]);

  // Track pending API requests - setup once on mount
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      // Skip non-API requests and health checks
      const url = args[0]?.toString() || "";
      if (!url.includes("/api/") || url.includes("/api/health")) {
        return originalFetch(...args);
      }

      setPendingRequests((prev) => prev + 1);

      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        setPendingRequests((prev) => prev - 1);
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []); // Only setup once on mount

  // Monitor server status and show wake-up if needed when requests are pending
  useEffect(() => {
    // Don't show loader on auth pages
    if (isAuthPage) return;

    if (pendingRequests > 0 && !isServerAwake && !isWakingUpRef.current) {
      setShowWakeUp(true);
    }

    // Hide wake-up when server is awake and no pending requests
    if (pendingRequests === 0 && isServerAwake && showWakeUp) {
      setTimeout(() => setShowWakeUp(false), 300);
    }
  }, [pendingRequests, isServerAwake, showWakeUp, isAuthPage]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // Auto-wake on mount - only once
  useEffect(() => {
    // Don't auto-wake on auth pages
    if (isAuthPage) return;

    const wakeUpTimer = setTimeout(() => {
      startWakeUp();
    }, 500);

    return () => clearTimeout(wakeUpTimer);
  }, [isAuthPage]); // Empty deps - only run once on mount

  return (
    <ApiStatusContext.Provider
      value={{
        isServerAwake,
        isLoading: showWakeUp || pendingRequests > 0,
        wakeUpServer: startWakeUp,
      }}
    >
      {!isAuthPage && showWakeUp && <ServerWakeUp />}
      {children}
    </ApiStatusContext.Provider>
  );
}

export function useApiStatus() {
  const context = useContext(ApiStatusContext);
  if (!context) {
    throw new Error("useApiStatus must be used within an ApiStatusProvider");
  }
  return context;
}

