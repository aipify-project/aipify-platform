const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export function formatRelativeTime(
  isoDate: string | null | undefined,
  locale: string
): string | null {
  if (!isoDate) {
    return null;
  }

  const then = new Date(isoDate).getTime();
  const now = Date.now();
  const diffSeconds = Math.round((then - now) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (absSeconds < MINUTE) {
    return rtf.format(diffSeconds, "second");
  }

  if (absSeconds < HOUR) {
    return rtf.format(Math.round(diffSeconds / MINUTE), "minute");
  }

  if (absSeconds < DAY) {
    return rtf.format(Math.round(diffSeconds / HOUR), "hour");
  }

  return rtf.format(Math.round(diffSeconds / DAY), "day");
}
