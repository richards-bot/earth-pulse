import { formatRelativeTime } from '../utils/time';
import type { PulseEvent } from '../types/pulse';

interface DetailPanelProps {
  selected: PulseEvent | null;
}

function renderExtra(selected: PulseEvent) {
  if (!selected.metadata) return null;

  const entries = Object.entries(selected.metadata).slice(0, 4);
  if (!entries.length) return null;

  return (
    <>
      {entries.map(([key, value]) => (
        <li key={key}>
          <strong>{key}:</strong> {String(value)}
        </li>
      ))}
    </>
  );
}

export function DetailPanel({ selected }: DetailPanelProps) {
  if (!selected) {
    return (
      <aside className="panel details-panel">
        <h3>Event details</h3>
        <p className="muted">Click a marker on the globe to explore what&apos;s happening right now.</p>
      </aside>
    );
  }

  return (
    <aside className="panel details-panel">
      <h3>{selected.label}</h3>
      <ul className="meta-list">
        <li>
          <strong>Layer:</strong> {selected.type}
        </li>
        <li>
          <strong>Severity:</strong> {selected.severity.toFixed(1)} / 10
        </li>
        <li>
          <strong>When:</strong> {formatRelativeTime(selected.occurredAt)}
        </li>
        <li>
          <strong>Source:</strong> {selected.source}
        </li>
        {renderExtra(selected)}
      </ul>
      {selected.rawUrl ? (
        <a href={selected.rawUrl} target="_blank" rel="noreferrer" className="source-link">
          View source event
        </a>
      ) : null}
    </aside>
  );
}
