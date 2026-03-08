import { ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import maplibregl from 'maplibre-gl';
import { useEffect, useMemo, useState } from 'react';
import Map from 'react-map-gl';
import { earthquakeRadiusMagnitude, severityColor } from '../utils/severity';
import type { PulseEvent } from '../types/pulse';

interface GlobeMapProps {
  events: PulseEvent[];
  onSelect: (event: PulseEvent | null) => void;
}

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 20,
  zoom: 1.6,
  pitch: 20,
  bearing: 0
};

function markerColor(event: PulseEvent): [number, number, number, number] {
  if (event.type === 'wildfires') return [255, 94, 0, 220];
  if (event.type === 'airQuality') return severityColor(event.severity);
  return severityColor(event.severity);
}

function markerRadius(event: PulseEvent): number {
  if (event.type === 'airQuality') {
    return (2 + event.severity * 1.2) * 10000;
  }
  if (event.type === 'wildfires') {
    return (3 + event.severity * 1.5) * 10000;
  }
  return earthquakeRadiusMagnitude(event.severity) * 10000;
}

export function GlobeMap({ events, onSelect }: GlobeMapProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const check = () => setIsSmallScreen(window.matchMedia('(max-width: 980px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const layers = useMemo(
    () => [
      new ScatterplotLayer<PulseEvent>({
        id: 'pulse-events',
        data: events,
        pickable: true,
        opacity: 0.86,
        stroked: true,
        filled: true,
        radiusMinPixels: 2,
        radiusMaxPixels: 22,
        getPosition: (d) => [d.lon, d.lat],
        getRadius: (d) => markerRadius(d),
        getFillColor: (d) => markerColor(d),
        getLineColor: [255, 255, 255, 240],
        lineWidthMinPixels: 1,
        onClick: (info) => onSelect((info.object as PulseEvent | undefined) ?? null)
      })
    ],
    [events, onSelect]
  );

  return (
    <div className="map-shell">
      <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers}>
        <Map
          mapLib={maplibregl as unknown as never}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          projection={(isSmallScreen ? { name: 'mercator' } : { name: 'globe' }) as never}
        />
      </DeckGL>
    </div>
  );
}
