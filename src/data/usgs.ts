import { clampSeverity } from '../utils/severity';
import type { PulseEvent } from '../types/pulse';

interface UsgsFeed {
  features: UsgsFeature[];
}

interface UsgsFeature {
  id: string;
  properties: {
    mag: number | null;
    place: string;
    time: number;
    url?: string;
    title?: string;
  };
  geometry: {
    coordinates: [number, number, number?];
  };
}

export function normalizeUsgsFeature(feature: UsgsFeature): PulseEvent | null {
  const [lon, lat] = feature.geometry.coordinates;
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;

  const magnitude = clampSeverity(feature.properties.mag ?? 0, 0, 10);

  return {
    id: feature.id,
    type: 'earthquakes',
    lat,
    lon,
    severity: magnitude,
    label: feature.properties.title ?? feature.properties.place ?? 'Earthquake event',
    occurredAt: new Date(feature.properties.time).toISOString(),
    source: 'USGS',
    rawUrl: feature.properties.url,
    metadata: {
      magnitude,
      place: feature.properties.place
    }
  };
}

export async function fetchEarthquakeEvents(signal?: AbortSignal): Promise<PulseEvent[]> {
  const response = await fetch(
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson',
    { signal }
  );

  if (!response.ok) {
    throw new Error(`USGS request failed (${response.status})`);
  }

  const data = (await response.json()) as UsgsFeed;
  return data.features.map(normalizeUsgsFeature).filter((event): event is PulseEvent => event !== null);
}
