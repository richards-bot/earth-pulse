import { clampSeverity } from '../utils/severity';
import type { PulseEvent } from '../types/pulse';

interface EonetResponse {
  events: EonetEvent[];
}

interface EonetEvent {
  id: string;
  title: string;
  link?: string;
  geometry: Array<{
    date: string;
    coordinates: [number, number];
  }>;
}

export function normalizeWildfire(event: EonetEvent): PulseEvent | null {
  const latest = event.geometry[event.geometry.length - 1];
  if (!latest) return null;

  const [lon, lat] = latest.coordinates;
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;

  const activityScore = clampSeverity(Math.min(10, 3 + event.geometry.length * 0.7), 0, 10);

  return {
    id: `wf-${event.id}`,
    type: 'wildfires',
    lat,
    lon,
    severity: activityScore,
    label: event.title || 'Wildfire event',
    occurredAt: latest.date,
    source: 'NASA EONET',
    rawUrl: event.link,
    metadata: {
      geometryPoints: event.geometry.length
    }
  };
}

export async function fetchWildfireEvents(signal?: AbortSignal): Promise<PulseEvent[]> {
  const response = await fetch(
    'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=wildfires',
    { signal }
  );

  if (!response.ok) {
    throw new Error(`Wildfire request failed (${response.status})`);
  }

  const data = (await response.json()) as EonetResponse;
  return data.events.map(normalizeWildfire).filter((event): event is PulseEvent => event !== null);
}
