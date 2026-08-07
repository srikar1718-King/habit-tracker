# Habit Tracker

A standard React + Vite project (no Claude-specific runtime or storage APIs).

Data persistence uses plain browser `localStorage` via a small polyfill in
`src/lib/storage-polyfill.js` that implements the same `get/set/delete/list`
shape the component was originally written against, so the component code
itself (`src/App.jsx`) didn't need to change.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```
