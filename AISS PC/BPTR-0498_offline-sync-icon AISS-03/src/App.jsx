import { useSyncQueue } from './hooks/useSyncQueue';
import OfflineSyncIcon from './components/OfflineSyncIcon';
import './App.css';

export default function App() {
  const { isOnline, queue, status, enqueue } = useSyncQueue();

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header__title">BPTR-0498 Demo</span>
        <OfflineSyncIcon status={status} queue={queue} />
      </header>

      <main className="app-main">
        <h1>Offline Sync State Icon</h1>
        <p>
          Real state is driven by your browser's actual connectivity
          (<code>navigator.onLine</code> + the <code>online</code>/
          <code>offline</code> events). Turn off Wi-Fi, or use DevTools →
          Network → <em>Offline</em>, to see it live.
        </p>

        <div className="status-panel">
          <div>
            Browser reports: <strong>{isOnline ? 'Online' : 'Offline'}</strong>
          </div>
          <div>
            Icon status: <strong>{status}</strong>
          </div>
          <div>
            Queued changes: <strong>{queue}</strong>
          </div>
        </div>

        <p>Simulate local changes made while offline:</p>
        <button className="btn" onClick={() => enqueue(1)}>
          + Add a queued change
        </button>

        <p className="hint">
          Go offline, add a few queued changes, then go back online — the
          icon turns green and pulses ("Reconnecting") until the queue
          drains to 0. While the queue is above 0, refreshing or closing
          the tab will prompt a confirmation so local data is never lost.
        </p>
      </main>
    </div>
  );
}
