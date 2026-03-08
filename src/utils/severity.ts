export function clampSeverity(value: number, min = 0, max = 10): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function severityColor(scale: number): [number, number, number, number] {
  if (scale < 3) return [68, 157, 68, 180];
  if (scale < 6) return [255, 186, 59, 220];
  if (scale < 8) return [255, 123, 0, 230];
  return [218, 41, 28, 240];
}

export function earthquakeRadiusMagnitude(magnitude: number): number {
  const safeMag = clampSeverity(magnitude, 0, 10);
  return 2 + safeMag * 2.5;
}
