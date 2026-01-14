import { useState, useCallback } from 'react';
import apiClient from '@/lib/api';

interface HealthState {
  isChecking: boolean;
  isServerAwake: boolean;
  checkServer: () => Promise<boolean>;
}

export function useHealthCheck(): HealthState {
  const [isChecking, setIsChecking] = useState(false);
  const [isServerAwake, setIsServerAwake] = useState(false);

  const checkServer = useCallback(async (): Promise<boolean> => {
    // If already awake, no need to check
    if (isServerAwake) return true;

    setIsChecking(true);
    try {
      // Ping the health endpoint
      await apiClient.get<{ status: string; message: string }>('/api/health');
      setIsServerAwake(true);
      return true;
    } catch (error) {
      // Server is still waking up
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

