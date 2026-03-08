import { LAYER_LABELS } from '../config/layers';
import { formatLastUpdated } from '../utils/time';
import type { DataLayerState, LayerKey, PulseEvent } from '../types/pulse';

interface LayerControlsProps {
  layers: Record<LayerKey, DataLayerState>;
  eventsByLayer: Record<LayerKey, PulseEvent[]>;
  onToggle: (key: LayerKey) => void;
  onRefresh: () => void;
}

export function LayerControls({ layers, eventsByLayer, onToggle, onRefresh }: LayerControlsProps) {
  const totalVisible = (Object.keys(layers) as LayerKey[])
    .filter((key) => layers[key].enabled)
    .reduce((sum, key) => sum + eventsByLayer[key].length, 0);

  return (
    <aside className="panel controls-panel">
      <h2>Earth Pulse</h2>
      <p className="muted">Live planet layers</p>
      <p className="summary">Visible events: {totalVisible}</p>
      <div className="controls">
        {(Object.keys(layers) as LayerKey[]).map((key) => {
          const layer = layers[key];
          const count = eventsByLayer[key].length;
          return (
            <label key={key} className="toggle-row">
              <input type="checkbox" checked={layer.enabled} onChange={() => onToggle(key)} />
              <span>
                {LAYER_LABELS[key]} <span className="muted">({count})</span>
              </span>
              <span className={`status ${layer.status}`}>{layer.status}</span>
            </label>
          );
        })}
      </div>
      <button className="refresh-button" onClick={onRefresh} type="button">
        Refresh now
      </button>
      <ul className="meta-list">
        {(Object.keys(layers) as LayerKey[]).map((key) => (
          <li key={key}>
            <strong>{LAYER_LABELS[key]}:</strong> {formatLastUpdated(layers[key].lastUpdated)}
            {layers[key].error ? <span className="error"> ({layers[key].error})</span> : null}
          </li>
        ))}
      </ul>
      <div className="legend">
        <h4>Legend</h4>
        <p><span className="dot quake" /> Earthquakes</p>
        <p><span className="dot fire" /> Wildfires</p>
        <p><span className="dot aqi" /> Air Quality (higher = worse)</p>
      </div>
    </aside>
  );
}
