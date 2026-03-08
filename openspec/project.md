# Project Context

## Identity

- **Name:** Earth Pulse
- **Mission:** Make live environmental and geophysical data feel exciting, visual, and understandable for families.
- **Target Users:** Ricky and his kids (primary), families and curious learners (secondary).

## Status

- **Phase:** Initial Dev
- **Codebase:** Greenfield
- **Test Coverage:** None (starting from template)

## Technical Context

- **Languages:** TypeScript
- **Frameworks:** React + Vite
- **Data Stores:** None (MVP)
- **External Services:** USGS Earthquake feed, NASA FIRMS wildfire feed, OpenAQ API

## Constraints

- Ship MVP quickly (weekend/short sprint velocity)
- Frontend-first architecture; avoid backend unless unavoidable
- Keep UX highly visual and kid-friendly, not dashboard-clinical
- Use only public/free data sources for MVP

## Domain Terminology

| Term | Definition |
|------|------------|
| Pulse Event | A normalized, display-ready live event on the globe |
| Layer | A thematic feed (earthquakes, wildfires, air quality) that can be toggled |
| Severity | Visual intensity score derived from source-specific metrics |
| Freshness | Relative age of an event from timestamp to now |
