import { describe, expect, it } from 'vitest';
import { normalizeUsgsFeature } from '../../src/data/usgs';

describe('normalizeUsgsFeature', () => {
  it('maps USGS feature to PulseEvent', () => {
    const event = normalizeUsgsFeature({
      id: 'abc123',
      properties: {
        mag: 4.6,
        place: '123 km W of Testville',
        time: 1_730_000_000_000,
        url: 'https://earthquake.usgs.gov/test',
        title: 'M 4.6 - Testville'
      },
      geometry: {
        coordinates: [-122.3, 37.9, 12]
      }
    });

    expect(event).not.toBeNull();
    expect(event?.id).toBe('abc123');
    expect(event?.type).toBe('earthquakes');
    expect(event?.lon).toBe(-122.3);
    expect(event?.lat).toBe(37.9);
    expect(event?.severity).toBe(4.6);
    expect(event?.source).toBe('USGS');
  });

  it('returns null for invalid coordinates', () => {
    const event = normalizeUsgsFeature({
      id: 'bad',
      properties: {
        mag: 2,
        place: 'Unknown',
        time: Date.now()
      },
      geometry: {
        coordinates: [Number.NaN, 40]
      }
    });

    expect(event).toBeNull();
  });
});
