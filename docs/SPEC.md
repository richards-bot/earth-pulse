# Project Specification

> Status: Draft (MVP kickoff) | Updated: 2026-03-08

## Summary

Earth Pulse is a highly visual, real-time “live planet” dashboard for kids and families. It renders an animated 3D globe with continuously updating global event layers (wildfires, earthquakes, and air quality) and turns live environmental data into an engaging, educational experience.

## Problem & Success Criteria

**Current state:** Most environmental data tools are either too technical or visually dull for kids.
**Desired state:** A cinematic, TV-friendly app that makes “what’s happening on Earth right now” easy and fun to explore.

- [ ] MVP shows globe + 3 live layers (wildfires, earthquakes, air quality)
- [ ] Data refreshes automatically without page reload
- [ ] Clicking any marker opens a clear, kid-friendly info panel
- [ ] App is deployable as static frontend (GitHub Pages / Vercel)

## Scope

**In (MVP):**
- Interactive rotating 3D globe
- Live data ingestion from public feeds
- Layer toggles for wildfire, earthquakes, and air quality
- Marker styling and animation by severity/intensity
- Detail card on click (source, timestamp, key facts)
- Auto-refresh polling (60–120s)

**Out (MVP):**
- User accounts/auth
- Backend database/storage
- Historical replay/timelapse
- Push notifications
- Mobile native app

## Requirements

### FR1: Live Globe Visualization
**Priority:** High
- [ ] Render a 3D globe with smooth pan/zoom/rotate controls
- [ ] Display geospatial points from active layers with distinct visual encoding
- [ ] Provide legend and clear color mapping

### FR2: Real-Time Data Integration
**Priority:** High
- [ ] Fetch wildfire events from NASA FIRMS (or equivalent public feed)
- [ ] Fetch earthquake events from USGS GeoJSON feed
- [ ] Fetch air quality observations from OpenAQ (or fallback provider)
- [ ] Normalize feeds into one internal event model
- [ ] Refresh all sources on interval and update UI gracefully

### FR3: Exploration UX
**Priority:** High
- [ ] Layer toggles on/off per data type
- [ ] Click/tap marker to open detail panel
- [ ] Show event age (e.g., “12 min ago”) and source attribution
- [ ] Keep UI usable by non-technical users (kids + parents)

### FR4: Performance & Reliability
**Priority:** Medium
- [ ] Initial load under 3s on broadband desktop
- [ ] Handle source errors per-layer without crashing app
- [ ] Show non-blocking “data unavailable” state if a feed fails

### Non-Functional
- **Performance:** 60fps target interactions on modern laptop; layer updates should not freeze UI
- **Security:** No secrets in frontend bundle; only public APIs used in MVP
- **Reliability:** If one feed fails, others continue rendering
- **Accessibility:** Keyboard-reachable controls; contrast-safe UI; readable labels

## Technical Architecture

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React + TypeScript + Vite | Fast iteration, strong DX, static deploy friendly |
| Mapping/3D | deck.gl + react-map-gl (MapLibre) | High-performance geospatial rendering + globe mode |
| Data fetching | Browser fetch + React Query (or lightweight polling service) | Simple polling + stale/loading/error state handling |
| Backend | None (MVP) | Reduce complexity, ship quickly |
| Database | None (MVP) | No persistence required initially |

### Key Components

**DataSource adapters:** One adapter per provider (USGS/FIRMS/OpenAQ) to fetch + map raw payloads to common type.

**Event normalizer:** Converts source-specific fields into unified `PulseEvent` schema.

**Globe renderer:** Owns map instance, layers, marker styling, and selection behavior.

**Control panel:** Layer toggles, refresh status, and legend.

**Detail panel:** Human-readable event metadata with source links.

## Data Model

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| PulseEvent | id, type, lat, lon, severity, label, occurredAt, source, rawUrl | belongs to one `DataLayer` |
| DataLayer | key, enabled, status, lastUpdated, error | has many `PulseEvent` |

## API Endpoints / Data Sources (external)

| Method | URL | Description |
|--------|-----|-------------|
| GET | https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson | Recent global earthquakes |
| GET | NASA FIRMS API/feed (public endpoint for active fire detections) | Global wildfire detections |
| GET | OpenAQ API endpoint(s) for latest observations | Air quality readings |

> Note: final exact FIRMS/OpenAQ endpoints to be confirmed during implementation based on CORS + quota constraints.

## Testing Strategy

- **Unit:** Normalizers/adapters, severity mapping, time formatting
- **Integration:** Data fetch + parse + render pipeline per layer
- **E2E:** Smoke test for page load, layer toggles, marker click details
- **Manual acceptance:** “Kid demo” checklist on large screen

## Open Questions

- [ ] Which map style/provider gives best visual quality without paid keys?
- [ ] Confirm best FIRMS endpoint with browser-friendly CORS for static deployment
- [ ] Should AQ be point-based or heatmap in MVP?
- [ ] Add optional “auto-tour camera” mode for unattended display?
