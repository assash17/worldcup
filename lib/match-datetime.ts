export function parseMatchTime(time: string | null | undefined): {
  clock: string | null;
  timezone: string | null;
} {
  if (!time?.trim()) {
    return { clock: null, timezone: null };
  }

  const trimmed = time.trim();
  const match = trimmed.match(/^(\d{1,2}:\d{2})\s*(.*)$/);

  if (!match) {
    return { clock: trimmed, timezone: null };
  }

  const clock = match[1];
  const timezone = match[2]?.trim() || null;

  return { clock, timezone };
}

export function formatMatchDateTime(
  date: string,
  time: string | null | undefined,
): string {
  const { clock, timezone } = parseMatchTime(time);

  if (!clock) {
    return date;
  }

  if (timezone) {
    return `${date} ${clock} ${timezone}`;
  }

  return `${date} ${clock}`;
}
