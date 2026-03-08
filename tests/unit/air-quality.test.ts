import { describe, expect, it } from 'vitest';
import { normalizeAqiToSeverity } from '../../src/data/airQuality';

describe('normalizeAqiToSeverity', () => {
  it('maps AQI range into 0-10 severity', () => {
    expect(normalizeAqiToSeverity(0)).toBe(0);
    expect(normalizeAqiToSeverity(150)).toBe(5);
    expect(normalizeAqiToSeverity(500)).toBe(10);
  });
});
