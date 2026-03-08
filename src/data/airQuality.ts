import { clampSeverity } from '../utils/severity';
import type { PulseEvent } from '../types/pulse';

interface CityTarget {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface OpenMeteoAqResponse {
  current?: {
    us_aqi?: number;
    time?: string;
  };
}

const CITY_TARGETS: CityTarget[] = [
  { id: 'london', name: 'London', lat: 51.5072, lon: -0.1276 },
  { id: 'newyork', name: 'New York', lat: 40.7128, lon: -74.006 },
  { id: 'lagos', name: 'Lagos', lat: 6.5244, lon: 3.3792 },
  { id: 'delhi', name: 'Delhi', lat: 28.6139, lon: 77.209 },
  { id: 'beijing', name: 'Beijing', lat: 39.9042, lon: 116.4074 },
  { id: 'sydney', name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { id: 'sao-paulo', name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
  { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lon: 139.6503 }
];

export function normalizeAqiToSeverity(aqi: number): number {
  // Scale typical AQI band (0-300) to 0-10 severity.
  return clampSeverity(aqi / 30, 0, 10);
}

async function fetchCityAq(city: CityTarget, signal?: AbortSignal): Promise<PulseEvent | null> {
  const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  url.searchParams.set('latitude', String(city.lat));
  url.searchParams.set('longitude', String(city.lon));
  url.searchParams.set('current', 'us_aqi');

  const response = await fetch(url, { signal });
  if (!response.ok) return null;

  const data = (await response.json()) as OpenMeteoAqResponse;
  const aqi = data.current?.us_aqi;
  if (!Number.isFinite(aqi)) return null;

  const timestamp = data.current?.time ? new Date(data.current.time).toISOString() : new Date().toISOString();

  return {
    id: `aq-${city.id}`,
    type: 'airQuality',
    lat: city.lat,
    lon: city.lon,
    severity: normalizeAqiToSeverity(aqi as number),
    label: `${city.name} AQI ${Math.round(aqi as number)}`,
    occurredAt: timestamp,
    source: 'Open-Meteo AQ',
    rawUrl: url.toString(),
    metadata: {
      city: city.name,
      aqi: Math.round(aqi as number)
    }
  };
}

export async function fetchAirQualityEvents(signal?: AbortSignal): Promise<PulseEvent[]> {
  const settled = await Promise.allSettled(CITY_TARGETS.map((city) => fetchCityAq(city, signal)));

  return settled
    .flatMap((item) => (item.status === 'fulfilled' ? [item.value] : []))
    .filter((event): event is PulseEvent => event !== null);
}
