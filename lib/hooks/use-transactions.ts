import { useQuery } from '@tanstack/react-query';
import { getAllTransactions } from '@/lib/api/transactions';
import type { TransactionFilters } from '@/types/transaction';
import { useOnlineStatus } from './use-online-status';
import { useEffect, useRef, useState } from 'react';

export function useTransactions(filters: TransactionFilters) {
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
    queryKey: ['transactions', filters],
    queryFn: () => getAllTransactions(filters),
    refetchInterval: shouldRefetch ? 60000 : false, // Auto-refresh every 60 seconds when enabled
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}
