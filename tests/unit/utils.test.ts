import { describe, expect, it } from 'vitest';
import { clampSeverity, earthquakeRadiusMagnitude, severityColor } from '../../src/utils/severity';
import { formatRelativeTime } from '../../src/utils/time';

describe('severity utils', () => {
  it('clamps severity into expected range', () => {
    expect(clampSeverity(-4)).toBe(0);
    expect(clampSeverity(12)).toBe(10);
    expect(clampSeverity(3.5)).toBe(3.5);
  });

  it('assigns colors by severity band', () => {
    expect(severityColor(2)[0]).toBe(68);
    expect(severityColor(5)[0]).toBe(255);
    expect(severityColor(9)[0]).toBe(218);
  });

  it('scales earthquake marker radius by magnitude', () => {
    expect(earthquakeRadiusMagnitude(0)).toBe(2);
    expect(earthquakeRadiusMagnitude(4)).toBeGreaterThan(earthquakeRadiusMagnitude(2));
  });
});

describe('time utils', () => {
  it('formats relative time in minutes', () => {
    const now = Date.UTC(2026, 2, 8, 9, 0, 0);
    const fortyMinutesAgo = new Date(now - 40 * 60 * 1000).toISOString();

    expect(formatRelativeTime(fortyMinutesAgo, now)).toBe('40 min ago');
  });

  it('handles invalid date input', () => {
    expect(formatRelativeTime('bad-date')).toBe('Unknown time');
  });
});
