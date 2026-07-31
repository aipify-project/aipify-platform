import { resolveAuthoritativeTimeZone, toBcp47Locale } from "./bcp47";

export type PlatformDateFormatOptions = {
  locale: string;
  timeZone?: string | null;
  /** Shown for null/undefined/empty. */
  emptyFallback: string;
  /** Shown for unparseable values — never a raw ISO string. */
  invalidFallback: string;
};

function parseInstant(value: string | number | Date | null | undefined): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  const ms = Date.parse(trimmed);
  if (Number.isNaN(ms)) return null;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date;
}

function withZone(options: PlatformDateFormatOptions): string {
  return resolveAuthoritativeTimeZone(options.timeZone);
}

/**
 * Full date + time for Platform UI.
 * Example (nb-NO): "31. juli 2026 kl. 04:42"
 * Never returns raw ISO-8601.
 */
export function formatPlatformDateTimeFull(
  value: string | number | Date | null | undefined,
  options: PlatformDateFormatOptions,
): string {
  if (value == null || value === "") return options.emptyFallback;
  const date = parseInstant(value);
  if (!date) return options.invalidFallback;

  try {
    return new Intl.DateTimeFormat(toBcp47Locale(options.locale), {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: withZone(options),
    }).format(date);
  } catch {
    return options.invalidFallback;
  }
}

/**
 * Compact date + time when space is limited.
 * Example (nb-NO): "31.07.2026, 04:42"
 */
export function formatPlatformDateTimeShort(
  value: string | number | Date | null | undefined,
  options: PlatformDateFormatOptions,
): string {
  if (value == null || value === "") return options.emptyFallback;
  const date = parseInstant(value);
  if (!date) return options.invalidFallback;

  try {
    return new Intl.DateTimeFormat(toBcp47Locale(options.locale), {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: withZone(options),
    }).format(date);
  } catch {
    return options.invalidFallback;
  }
}

/** Date only (no time). */
export function formatPlatformDateOnly(
  value: string | number | Date | null | undefined,
  options: PlatformDateFormatOptions,
): string {
  if (value == null || value === "") return options.emptyFallback;
  const date = parseInstant(value);
  if (!date) return options.invalidFallback;

  try {
    return new Intl.DateTimeFormat(toBcp47Locale(options.locale), {
      dateStyle: "long",
      timeZone: withZone(options),
    }).format(date);
  } catch {
    return options.invalidFallback;
  }
}

/** Relative time such as "2 hours ago" / "om 2 timer". */
export function formatPlatformRelativeTime(
  value: string | number | Date | null | undefined,
  options: PlatformDateFormatOptions & { now?: number },
): string {
  if (value == null || value === "") return options.emptyFallback;
  const date = parseInstant(value);
  if (!date) return options.invalidFallback;

  const now = options.now ?? Date.now();
  const diffSec = Math.round((date.getTime() - now) / 1000);
  const abs = Math.abs(diffSec);

  const divisions: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ];

  let remaining = abs;
  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (const division of divisions) {
    if (remaining < division.amount) {
      unit = division.unit;
      break;
    }
    remaining /= division.amount;
    unit = division.unit;
  }

  const signed = diffSec < 0 ? -Math.round(remaining) : Math.round(remaining);

  try {
    return new Intl.RelativeTimeFormat(toBcp47Locale(options.locale), {
      numeric: "auto",
    }).format(signed, unit);
  } catch {
    return formatPlatformDateTimeShort(date, options);
  }
}

/** Human duration between two instants (e.g. "2 hours"). */
export function formatPlatformDuration(
  start: string | number | Date | null | undefined,
  end: string | number | Date | null | undefined,
  options: PlatformDateFormatOptions,
): string {
  const startDate = parseInstant(start);
  const endDate = parseInstant(end);
  if (!startDate || !endDate) return options.invalidFallback;

  const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
  const totalMinutes = Math.round(diffMs / 60_000);
  if (totalMinutes < 1) {
    try {
      return new Intl.NumberFormat(toBcp47Locale(options.locale), {
        style: "unit",
        unit: "second",
        unitDisplay: "long",
      }).format(Math.max(1, Math.round(diffMs / 1000)));
    } catch {
      return options.invalidFallback;
    }
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const bcp = toBcp47Locale(options.locale);

  try {
    if (hours === 0) {
      return new Intl.NumberFormat(bcp, {
        style: "unit",
        unit: "minute",
        unitDisplay: "long",
      }).format(minutes);
    }
    if (minutes === 0) {
      return new Intl.NumberFormat(bcp, {
        style: "unit",
        unit: "hour",
        unitDisplay: "long",
      }).format(hours);
    }
    const hourPart = new Intl.NumberFormat(bcp, {
      style: "unit",
      unit: "hour",
      unitDisplay: "long",
    }).format(hours);
    const minutePart = new Intl.NumberFormat(bcp, {
      style: "unit",
      unit: "minute",
      unitDisplay: "long",
    }).format(minutes);
    return `${hourPart}, ${minutePart}`;
  } catch {
    return options.invalidFallback;
  }
}

/** True when a string looks like a raw ISO-8601 instant (must not appear in UI). */
export function looksLikeRawIsoDateTime(value: string): boolean {
  return (
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) ||
    /\+\d{2}:\d{2}$/.test(value) ||
    /T\d{2}:\d{2}:\d{2}/.test(value)
  );
}
