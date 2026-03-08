import maplibregl from 'maplibre-gl';
import { useEffect, useMemo, useState } from 'react';
import Map, { Marker } from 'react-map-gl';
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

function markerColor(event: PulseEvent): string {
  if (event.type === 'wildfires') return 'rgba(255,94,0,0.9)';
  const [r, g, b, a] = severityColor(event.severity);
  return `rgba(${r},${g},${b},${a / 255})`;
}

function markerSize(event: PulseEvent): number {
  if (event.type === 'airQuality') return 6 + event.severity * 0.9;
  if (event.type === 'wildfires') return 7 + event.severity * 1.0;
  return Math.max(6, earthquakeRadiusMagnitude(event.severity) * 1.2);
}

export function GlobeMap({ events, onSelect }: GlobeMapProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const check = () => setIsSmallScreen(window.matchMedia('(max-width: 980px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const projection = useMemo(
    () => (isSmallScreen ? ({ name: 'mercator' } as const) : ({ name: 'globe' } as const)),
    [isSmallScreen]
  );

  return (
    <div className="map-shell">
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        mapLib={maplibregl as unknown as never}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        projection={projection as never}
        style={{ width: '100%', height: '100%' }}
      >
        {events.map((event) => (
          <Marker key={event.id} longitude={event.lon} latitude={event.lat} anchor="center">
            <button
              className="event-marker"
              type="button"
              onClick={() => onSelect(event)}
              style={{
                width: `${markerSize(event)}px`,
                height: `${markerSize(event)}px`,
                background: markerColor(event)
              }}
              aria-label={event.label}
              title={event.label}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
}
