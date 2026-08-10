import { useEffect, useState } from 'react';

/**
 * BPTR-0498-A01-M... : SVG icon updates driven by browser navigator.onLine API.
 * Tracks live connectivity state using the `online` / `offline` window events,
 * seeded from navigator.onLine on mount.
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

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

  return isOnline;
}
