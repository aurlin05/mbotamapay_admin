'use client';

import { useOnlineStatus } from '@/lib/hooks/use-online-status';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-destructive px-4 py-3 text-destructive-foreground shadow-lg">
      <WifiOff className="h-5 w-5" />
      <div className="flex flex-col">
        <span className="font-semibold">No Internet Connection</span>
        <span className="text-sm opacity-90">
          Auto-refresh is paused. Reconnect to resume.
        </span>
      </div>
    </div>
  );
}
