interface RelativeTimeStrings {
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
}

export function formatRelativeTime(
  timestamp: number,
  strings: RelativeTimeStrings
): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) {
    return strings.justNow;
  }

  if (minutes < 60) {
    return `${minutes} ${strings.minutesAgo}`;
  }

  if (hours < 24) {
    return `${hours} ${strings.hoursAgo}`;
  }

  if (weeks < 1) {
    return `${days} ${strings.daysAgo}`;
  }

  return new Date(timestamp).toLocaleDateString();
}
