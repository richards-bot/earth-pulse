export type LayerKey = 'earthquakes' | 'wildfires' | 'airQuality';

export interface PulseEvent {
  id: string;
  type: LayerKey;
  lat: number;
  lon: number;
  severity: number;
  label: string;
  occurredAt: string;
  source: string;
  rawUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface DataLayerState {
  key: LayerKey;
  enabled: boolean;
  status: 'idle' | 'loading' | 'ready' | 'error';
  lastUpdated?: string;
  error?: string;
}

export interface LayerAdapter {
  key: LayerKey;
  fetchEvents: (signal?: AbortSignal) => Promise<PulseEvent[]>;
}
