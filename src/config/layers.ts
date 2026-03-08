import type { DataLayerState, LayerKey } from '../types/pulse';

export const DEFAULT_LAYER_STATES: Record<LayerKey, DataLayerState> = {
  earthquakes: { key: 'earthquakes', enabled: true, status: 'idle' },
  wildfires: { key: 'wildfires', enabled: true, status: 'idle' },
  airQuality: { key: 'airQuality', enabled: true, status: 'idle' }
};

export const LAYER_LABELS: Record<LayerKey, string> = {
  earthquakes: 'Earthquakes',
  wildfires: 'Wildfires',
  airQuality: 'Air Quality'
};
