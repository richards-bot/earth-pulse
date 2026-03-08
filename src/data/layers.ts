import type { LayerAdapter } from '../types/pulse';
import { fetchAirQualityEvents } from './airQuality';
import { fetchEarthquakeEvents } from './usgs';
import { fetchWildfireEvents } from './wildfires';

export const layerAdapters: LayerAdapter[] = [
  {
    key: 'earthquakes',
    fetchEvents: (signal) => fetchEarthquakeEvents(signal)
  },
  {
    key: 'wildfires',
    fetchEvents: (signal) => fetchWildfireEvents(signal)
  },
  {
    key: 'airQuality',
    fetchEvents: (signal) => fetchAirQualityEvents(signal)
  }
];
