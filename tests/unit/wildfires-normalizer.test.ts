import { describe, expect, it } from 'vitest';
import { normalizeWildfire } from '../../src/data/wildfires';

describe('normalizeWildfire', () => {
  it('normalizes EONET wildfire event', () => {
    const event = normalizeWildfire({
      id: 'EONET_1',
      title: 'Test wildfire',
      link: 'https://example.com/wildfire',
      geometry: [
        { date: '2026-03-08T09:00:00Z', coordinates: [10, 20] },
        { date: '2026-03-08T10:00:00Z', coordinates: [11, 21] }
      ]
    });

    expect(event).not.toBeNull();
    expect(event?.type).toBe('wildfires');
    expect(event?.lat).toBe(21);
    expect(event?.lon).toBe(11);
    expect(event?.source).toBe('NASA EONET');
  });
});
