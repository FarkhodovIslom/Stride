"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import ServerWakeUp from "./ServerWakeUp";
import { useHealthCheck } from "@/hooks/useHealthCheck";

interface ApiStatusContextType {
  isServerAwake: boolean;
  isLoading: boolean;
  wakeUpServer: () => Promise<void>;
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

// Cleanup function type
type CleanupFunction = () => void;

export function ApiStatusProvider({ children }: { children: ReactNode }) {
  const [showWakeUp, setShowWakeUp] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);
  const { isServerAwake, checkServer } = useHealthCheck();
  const checkIntervalRef = useCallbackRef<ReturnType<typeof setInterval> | null>(null);

  // Start wake-up sequence
  const startWakeUp = useCallback(async () => {
    if (showWakeUp || isServerAwake) return;
    
    setShowWakeUp(true);
    
    // Check server status periodically
    checkIntervalRef.current = setInterval(async () => {
      const isAwake = await checkServer();
      if (isAwake) {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
        // Hide wake-up after a short delay for smooth transition
        setTimeout(() => {
          setShowWakeUp(false);
        }, 500);
      }
    }, 2000);
  }, [showWakeUp, isServerAwake, checkServer, checkIntervalRef]);

  // Track pending API requests
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      // Skip non-API requests and health checks
      const url = args[0]?.toString() || "";
      if (!url.includes("/api/") || url.includes("/api/health")) {
        return originalFetch(...args);
      }

      // Show wake-up screen if server might be asleep
      if (!isServerAwake && !showWakeUp) {
        setShowWakeUp(true);
      }

      setPendingRequests((prev) => prev + 1);
      
      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        setPendingRequests((prev) => {
          const newCount = prev - 1;
          // Hide wake-up when all requests complete and server is awake
          if (newCount === 0 && isServerAwake) {
            setTimeout(() => setShowWakeUp(false), 300);
          }
          return newCount;
        });
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [isServerAwake, showWakeUp]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // Auto-wake on mount
  useEffect(() => {
    const wakeUpTimer = setTimeout(() => {
      startWakeUp();
    }, 500);

    return () => clearTimeout(wakeUpTimer);
  }, [startWakeUp]);

  return (
    <ApiStatusContext.Provider
      value={{
        isServerAwake,
        isLoading: showWakeUp || pendingRequests > 0,
        wakeUpServer: startWakeUp,
      }}
    >
      {showWakeUp && <ServerWakeUp />}
      {children}
    </ApiStatusContext.Provider>
  );
}

// Custom hook for refs with useCallback
function useCallbackRef<T>(initialValue: T | null): React.MutableRefObject<T | null> {
  const ref = useState(() => ({ current: initialValue }))[0];
  return ref;
}

export function useApiStatus() {
  const context = useContext(ApiStatusContext);
  if (!context) {
    throw new Error("useApiStatus must be used within an ApiStatusProvider");
  }
  return context;
}

