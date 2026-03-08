const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelativeTime(timestamp: string, now = Date.now()): string {
  const time = new Date(timestamp).getTime();
  if (Number.isNaN(time)) return 'Unknown time';

  const delta = Math.max(0, now - time);
  if (delta < MINUTE) return 'just now';
  if (delta < HOUR) return `${Math.floor(delta / MINUTE)} min ago`;
  if (delta < DAY) return `${Math.floor(delta / HOUR)} hr ago`;
  return `${Math.floor(delta / DAY)} day ago`;
}

export function formatLastUpdated(timestamp?: string): string {
  if (!timestamp) return 'Never';
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
