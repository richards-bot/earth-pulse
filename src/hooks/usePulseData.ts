import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LAYER_STATES } from '../config/layers';
import { layerAdapters } from '../data/layers';
import type { DataLayerState, LayerKey, PulseEvent } from '../types/pulse';

const DEFAULT_POLL_MS = Number(import.meta.env.VITE_POLL_INTERVAL_MS ?? 90_000);

export function usePulseData() {
  const [layers, setLayers] = useState<Record<LayerKey, DataLayerState>>(DEFAULT_LAYER_STATES);
  const [eventsByLayer, setEventsByLayer] = useState<Record<LayerKey, PulseEvent[]>>({
    earthquakes: [],
    wildfires: [],
    airQuality: []
  });

  const refreshLayer = useCallback(async (key: LayerKey) => {
    const adapter = layerAdapters.find((item) => item.key === key);
    if (!adapter) return;

    setLayers((prev) => ({ ...prev, [key]: { ...prev[key], status: 'loading', error: undefined } }));

    try {
      const events = await adapter.fetchEvents();
      setEventsByLayer((prev) => ({ ...prev, [key]: events }));
      setLayers((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          status: 'ready',
          lastUpdated: new Date().toISOString(),
          error: undefined
        }
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown layer error';
      setLayers((prev) => ({ ...prev, [key]: { ...prev[key], status: 'error', error: message } }));
    }
  }, []);

  const refreshEnabledLayers = useCallback(async () => {
    const enabled = (Object.keys(layers) as LayerKey[]).filter((key) => layers[key].enabled);
    await Promise.all(enabled.map((key) => refreshLayer(key)));
  }, [layers, refreshLayer]);

  useEffect(() => {
    void refreshEnabledLayers();
    const intervalId = window.setInterval(() => {
      void refreshEnabledLayers();
    }, DEFAULT_POLL_MS);

    return () => window.clearInterval(intervalId);
  }, [refreshEnabledLayers]);

  const toggleLayer = useCallback((key: LayerKey) => {
    setLayers((prev) => {
      const nextEnabled = !prev[key].enabled;
      return { ...prev, [key]: { ...prev[key], enabled: nextEnabled } };
    });
  }, []);

  useEffect(() => {
    (Object.keys(layers) as LayerKey[]).forEach((key) => {
      if (layers[key].enabled && layers[key].status === 'idle') {
        void refreshLayer(key);
      }
    });
  }, [layers, refreshLayer]);

  const visibleEvents = useMemo(
    () =>
      (Object.keys(eventsByLayer) as LayerKey[])
        .filter((key) => layers[key].enabled)
        .flatMap((key) => eventsByLayer[key]),
    [eventsByLayer, layers]
  );

  return {
    layers,
    eventsByLayer,
    visibleEvents,
    toggleLayer,
    refreshEnabledLayers
  };
}
