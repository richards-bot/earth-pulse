import type { LayerAdapter } from '../types/pulse';
import { fetchAirQualityEvents } from './airQuality';
import { fetchEarthquakeEvents } from './usgs';
import { fetchWildfireEvents } from './wildfires';

export const layerAdapters: LayerAdapter[] = [
  {
    key: 'earthquakes',
    fetchEvents: () => fetchEarthquakeEvents()
  },
  {
    key: 'wildfires',
    fetchEvents: () => fetchWildfireEvents()
  },
  {
    key: 'airQuality',
    fetchEvents: () => fetchAirQualityEvents()
  }
];
