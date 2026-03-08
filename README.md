# Earth Pulse

Live-planet dashboard MVP for kids/families: visual, fast, and understandable.

## MVP Status (Implemented)

- ✅ React + TypeScript + Vite app scaffolded
- ✅ **Earthquakes** live via USGS hourly GeoJSON feed
- ✅ **Wildfires** live via NASA EONET active wildfire feed
- ✅ **Air Quality** live via Open-Meteo AQ API (major global cities)
- ✅ Shared `PulseEvent` model + per-layer adapters
- ✅ Globe map rendering with per-layer marker styling
- ✅ Click marker detail panel (including metadata)
- ✅ Layer control panel with toggles, statuses, and event counts
- ✅ Polling loop for real-time refresh
- ✅ Unit tests for adapters/normalizers and utility functions

## Stack

- React 18 + TypeScript
- Vite
- deck.gl + react-map-gl + MapLibre (globe projection)
- Vitest

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Tests

```bash
npm test
```

## Build

```bash
npm run build
npm run preview
```

## Configuration

Optional:

- `VITE_POLL_INTERVAL_MS` (default: `90000`)
- `VITE_BASE_PATH` (default: `/`, GitHub Pages build sets this automatically)

Create `.env` from `.env.example` and set values as needed.

## Current Layer Status

- **Earthquakes:** live (USGS)
- **Wildfires:** live (NASA EONET)
- **Air Quality:** live (Open-Meteo AQ)

## Deployment

GitHub Actions workflow included: `.github/workflows/deploy-pages.yml`

- Push to `main` triggers build + deploy to GitHub Pages.
- Build uses repository-name base path automatically.

## Notes

- If one layer fetch fails, layer status is set to `error` and other enabled layers continue.
- This kickoff focuses on production-minded structure for quick extension of additional feeds.
