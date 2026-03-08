import { useState } from 'react';
import { DetailPanel } from './components/DetailPanel';
import { GlobeMap } from './components/GlobeMap';
import { LayerControls } from './components/LayerControls';
import { usePulseData } from './hooks/usePulseData';
import type { PulseEvent } from './types/pulse';

function App() {
  const { layers, eventsByLayer, visibleEvents, toggleLayer, refreshEnabledLayers } = usePulseData();
  const [selectedEvent, setSelectedEvent] = useState<PulseEvent | null>(null);

  return (
    <main className="layout">
      <LayerControls
        layers={layers}
        eventsByLayer={eventsByLayer}
        onToggle={toggleLayer}
        onRefresh={() => void refreshEnabledLayers()}
      />
      <GlobeMap events={visibleEvents} onSelect={setSelectedEvent} />
      <DetailPanel selected={selectedEvent} />
    </main>
  );
}

export default App;
