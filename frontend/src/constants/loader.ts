/**
 * Configuration constants for the server wake-up loader
 */
export const LOADER_CONFIG = {
  /** Interval between health check pings (ms) */
  HEALTH_CHECK_INTERVAL: 2000,

  /** Interval between motivational message changes (ms) */
  MESSAGE_CYCLE_INTERVAL: 2000,

  /** Delay before showing wake-up screen (ms) */
  WAKE_UP_DELAY: 500,

  /** Delay before hiding wake-up after server responds (ms) */
  HIDE_DELAY: 300,

  /** Auto-hide loader after this duration regardless of server status (ms) */
  AUTO_HIDE_DELAY: 4000, // 4 seconds

  /** Maximum number of health check attempts before showing error */
  MAX_RETRY_ATTEMPTS: 30, // 60 seconds at 2s intervals
} as const;
