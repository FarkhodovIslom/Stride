import { useState, useCallback, useRef } from 'react';
import apiClient from '@/lib/api';
import { LOADER_CONFIG } from '@/constants/loader';

interface HealthState {
  isChecking: boolean;
  isServerAwake: boolean;
  checkServer: () => Promise<boolean>;
}

/**
 * Hook for background server health checks.
 * Tracks whether the backend API is responsive.
 */
export function useHealthCheck(): HealthState {
  const [isChecking, setIsChecking] = useState(false);
  const [isServerAwake, setIsServerAwake] = useState(false);
  const retryCountRef = useRef(0);

  const checkServer = useCallback(async (): Promise<boolean> => {
    // If already awake, no need to check
    if (isServerAwake) return true;

    // Stop after max retries (server truly down)
    if (retryCountRef.current >= LOADER_CONFIG.MAX_RETRY_ATTEMPTS) {
      return false;
    }

    setIsChecking(true);
    try {
      await apiClient.get<{ status: string; message: string }>('/api/health');
      setIsServerAwake(true);
      retryCountRef.current = 0;
      return true;
    } catch {
      retryCountRef.current += 1;
      setIsServerAwake(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [isServerAwake]);

  return {
    isChecking,
    isServerAwake,
    checkServer,
  };
}
