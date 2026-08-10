# Offline Sync State Icon

Implementation of **BPTR-0498-A01 — Implement Offline Sync State Icon**
(see `spec/BPTR-0498_-_PC_-060826.xlsx` for the full requirements ticket).

A persistent header icon for a mobile-first web app that shows:

- **Offline** — red cloud-with-slash icon + badge count of locally queued changes
- **Reconnecting** — icon pulses green while queued changes are syncing
- **Synced** — neutral icon, no badge, once the queue reaches 0

It also implements the mistake-proofing (Poka-Yoke) requirement: while any
changes are queued, refreshing or closing the tab prompts a confirmation
so local data can't be silently wiped.

## Requirements traceability

| Substep (from spec) | Where it's implemented |
|---|---|
| Select offline icon (cloud with slash) | `src/components/OfflineSyncIcon.jsx` |
| Sync pending badge count | `OfflineSyncIcon.jsx` badge + `useSyncQueue.js` |
| "Reconnecting" animation | `OfflineSyncIcon.css` `@keyframes sync-pulse` |
| Persistent placement logic | `src/App.jsx` sticky `.app-header` |
| Driven by `navigator.onLine` | `src/hooks/useOnlineStatus.js` |
| Block refresh while queue > 0 | `useSyncQueue.js` `beforeunload` handler |

## Run it

Requires [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

To try the offline/reconnect flow:

1. Click **"+ Add a queued change"** a couple of times.
2. Open DevTools → Network tab → set throttling to **Offline** (or turn
   off your machine's Wi-Fi).
3. The header icon turns red with a badge.
4. Turn the network back on — the icon pulses green ("Reconnecting")
   until the simulated queue drains to 0, then returns to neutral.
5. While the badge count is above 0, try refreshing the tab — the
   browser will ask you to confirm before leaving.

### Production build

```bash
npm run build
npm run preview
```

## Project structure

```
offline-sync-icon/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── src/
│   ├── main.jsx
│   ├── App.jsx / App.css
│   ├── components/
│   │   ├── OfflineSyncIcon.jsx
│   │   └── OfflineSyncIcon.css
│   └── hooks/
│       ├── useOnlineStatus.js
│       └── useSyncQueue.js
└── spec/
    └── BPTR-0498_-_PC_-060826.xlsx
```
