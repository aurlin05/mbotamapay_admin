import { useEffect, useRef, useState } from 'react';

interface UseAutoRefreshOptions {
  /**
   * Refresh interval in milliseconds
   */
  interval: number;
  /**
   * Callback function to execute on each refresh
   */
  onRefresh: () => void;
  /**
   * Whether auto-refresh is enabled
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether to pause refresh during active interactions
   * @default true
   */
  pauseOnInteraction?: boolean;
}

/**
 * Hook for managing auto-refresh functionality with support for:
 * - Configurable refresh intervals
 * - Pausing during active interactions
 * - Pausing when offline
 */
export function useAutoRefresh({
  interval,
  onRefresh,
  enabled = true,
  pauseOnInteraction = true,
}: UseAutoRefreshOptions) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshRef = useRef<number>(Date.now());

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track user interactions to pause refresh
  useEffect(() => {
    if (!pauseOnInteraction) return;

    let interactionTimeout: NodeJS.Timeout;

    const handleInteraction = () => {
      setIsPaused(true);
      clearTimeout(interactionTimeout);
      
      // Resume after 2 seconds of no interaction
      interactionTimeout = setTimeout(() => {
        setIsPaused(false);
      }, 2000);
    };

    // Listen for various interaction events
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((event) => {
      window.addEventListener(event, handleInteraction, { passive: true });
    });

    return () => {
      clearTimeout(interactionTimeout);
      events.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, [pauseOnInteraction]);

  // Manage the refresh interval
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Don't start interval if disabled, offline, or paused
    if (!enabled || !isOnline || isPaused) {
      return;
    }

    // Set up the refresh interval
    intervalRef.current = setInterval(() => {
      lastRefreshRef.current = Date.now();
      onRefresh();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [interval, onRefresh, enabled, isOnline, isPaused]);

  return {
    isOnline,
    isPaused,
    lastRefresh: lastRefreshRef.current,
  };
}
