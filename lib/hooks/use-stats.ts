import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/lib/api/stats';
import { useOnlineStatus } from './use-online-status';
import { useEffect, useRef, useState } from 'react';

export function useStats() {
  const isOnline = useOnlineStatus();
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Track user interactions to pause refresh
  useEffect(() => {
    const handleInteraction = () => {
      setIsPaused(true);
      clearTimeout(interactionTimeoutRef.current);
      
      // Resume after 2 seconds of no interaction
      interactionTimeoutRef.current = setTimeout(() => {
        setIsPaused(false);
      }, 2000);
    };

    // Listen for various interaction events
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((event) => {
      window.addEventListener(event, handleInteraction, { passive: true });
    });

    return () => {
      clearTimeout(interactionTimeoutRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  // Only enable auto-refresh when online and not paused
  const shouldRefetch = isOnline && !isPaused;

  return useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    refetchInterval: shouldRefetch ? 30000 : false, // Auto-refresh every 30 seconds when enabled
    staleTime: 25000, // Consider data stale after 25 seconds
  });
}
