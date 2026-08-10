import './OfflineSyncIcon.css';

/**
 * BPTR-0498-A01 — Implement Offline Sync State Icon
 *
 * Persistent header icon (added to the global application shell header).
 * States:
 *   synced        -> hidden/neutral cloud, no badge
 *   offline       -> cloud-with-slash, badge shows queued count
 *   reconnecting  -> cloud pulses green until queue reaches 0
 *
 * a11y: uses role="status" + aria-live so screen readers announce
 * state changes without the user needing to look at the header.
 */
export default function OfflineSyncIcon({ status, queue }) {
  const label =
    status === 'offline'
      ? `Offline. ${queue} change${queue === 1 ? '' : 's'} queued to sync.`
      : status === 'reconnecting'
      ? `Reconnecting. Syncing ${queue} change${queue === 1 ? '' : 's'}...`
      : 'All changes synced.';

  return (
    <div
      className={`offline-sync-icon offline-sync-icon--${status}`}
      role="status"
      aria-live="polite"
      title={label}
    >
      <CloudIcon status={status} />
      {queue > 0 && (
        <span className="offline-sync-icon__badge" aria-hidden="true">
          {queue > 99 ? '99+' : queue}
        </span>
      )}
      <span className="offline-sync-icon__sr-only">{label}</span>
    </div>
  );
}

function CloudIcon({ status }) {
  const showSlash = status === 'offline';
  return (
    <svg
      className="offline-sync-icon__svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6.5 19a4.5 4.5 0 0 1-.4-8.98A5.5 5.5 0 0 1 17.2 8.03 4 4 0 0 1 17 16H6.5a4.5 4.5 0 0 1 0 3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        transform="translate(0,-3)"
      />
      {showSlash && (
        <line
          x1="3"
          y1="3"
          x2="21"
          y2="21"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
