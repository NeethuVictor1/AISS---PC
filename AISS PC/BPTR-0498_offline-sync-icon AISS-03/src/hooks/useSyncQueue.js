import { useEffect, useRef, useState } from 'react';
import { useOnlineStatus } from './useOnlineStatus';

/**
 * BPTR-0498-A01 — Implement Offline Sync State Icon
 *
 * Drives the icon's state machine:
 *   - "offline"      : navigator is offline, work is queued locally
 *   - "reconnecting"  : connection just returned but the queue hasn't drained yet
 *                        (icon pulses green until queue hits 0)
 *   - "synced"        : online, queue empty
 *
 * Also implements the mistake-proofing (Poka-Yoke) requirement:
 * physically block page refresh/close while syncQueue > 0, so an
 * accidental refresh can never wipe unsynced local data.
 */
export function useSyncQueue() {
  const isOnline = useOnlineStatus();
  const [queue, setQueue] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const drainTimer = useRef(null);

  // Enter "reconnecting" the moment we come back online with items still queued.
  useEffect(() => {
    if (isOnline && queue > 0) {
      setIsReconnecting(true);
    }
    if (!isOnline) {
      setIsReconnecting(false);
    }
  }, [isOnline, queue]);

  // Simulated drain: once online, work the queue down until it hits 0,
  // then stop pulsing. In a real app this effect is replaced by the
  // actual sync-worker's completion callback decrementing `queue`.
  useEffect(() => {
    if (isOnline && queue > 0) {
      drainTimer.current = setInterval(() => {
        setQueue((q) => Math.max(0, q - 1));
      }, 900);
      return () => clearInterval(drainTimer.current);
    }
    if (queue === 0) {
      setIsReconnecting(false);
    }
  }, [isOnline, queue]);

  // Poka-Yoke: block refresh/close while there is unsynced work queued.
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (queue > 0) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [queue]);

  const enqueue = (n = 1) => setQueue((q) => q + n);

  let status = 'synced';
  if (!isOnline) status = 'offline';
  else if (isReconnecting && queue > 0) status = 'reconnecting';

  return { isOnline, queue, status, enqueue };
}
