"use client";

import { createContext, useContext, useEffect, ReactNode, useRef } from "react";
import { useHealthCheck } from "@/hooks/useHealthCheck";
import { LOADER_CONFIG } from "@/constants/loader";

interface ApiStatusContextType {
  isServerAwake: boolean;
  checkServer: () => Promise<boolean>;
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

/**
 * Provides server status context with background health checks.
 * No full-screen loader - each page handles its own loading states.
 */
export function ApiStatusProvider({ children }: { children: ReactNode }) {
  const { isServerAwake, checkServer } = useHealthCheck();
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Run health checks in background on mount
  useEffect(() => {
    // Initial check after short delay
    const initialTimer = setTimeout(() => {
      checkServer();
    }, LOADER_CONFIG.WAKE_UP_DELAY);

    // Continue checking periodically until server is awake
    checkIntervalRef.current = setInterval(() => {
      if (!isServerAwake) {
        checkServer();
      }
    }, LOADER_CONFIG.HEALTH_CHECK_INTERVAL);

    return () => {
      clearTimeout(initialTimer);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [checkServer, isServerAwake]);

  // Stop interval once server is awake
  useEffect(() => {
    if (isServerAwake && checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
  }, [isServerAwake]);

  return (
    <ApiStatusContext.Provider
      value={{
        isServerAwake,
        checkServer,
      }}
    >
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
