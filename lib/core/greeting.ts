export type GreetingPeriod = "morning" | "afternoon" | "evening" | "late";

export type GreetingLabels = {
  morning: string;
  afternoon: string;
  evening: string;
  late: string[];
};

export type TimezoneResolutionInput = {
  userTimezone?: string | null;
  customerTimezone?: string | null;
  country?: string | null;
  browserTimezone?: string | null;
};

/** IANA timezones offered in customer settings. */
export const COMMON_TIMEZONES = [
  "Europe/Oslo",
  "Europe/Stockholm",
  "Europe/Copenhagen",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Vancouver",
  "UTC",
] as const;

const COUNTRY_DEFAULT_TIMEZONES: Record<string, string> = {
  NO: "Europe/Oslo",
  SE: "Europe/Stockholm",
  DK: "Europe/Copenhagen",
  GB: "Europe/London",
  UK: "Europe/London",
};

export function countryDefaultTimezone(country?: string | null): string | null {
  if (!country) return null;
  return COUNTRY_DEFAULT_TIMEZONES[country.trim().toUpperCase()] ?? null;
}

export function resolveTimezone(input: TimezoneResolutionInput): string {
  const candidates = [
    input.userTimezone,
    input.customerTimezone,
    countryDefaultTimezone(input.country),
    input.browserTimezone,
    "UTC",
  ];

  for (const value of candidates) {
    const normalized = normalizeTimezone(value);
    if (normalized) return normalized;
  }

  return "UTC";
}

export function normalizeTimezone(value?: string | null): string | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "utc") return "UTC";
  try {
    Intl.DateTimeFormat(undefined, { timeZone: trimmed });
    return trimmed;
  } catch {
    return null;
  }
}

export function getLocalHour(timezone: string, now: Date = new Date()): number {
  const tz = normalizeTimezone(timezone) ?? "UTC";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);
  const hourPart = parts.find((part) => part.type === "hour");
  return Number(hourPart?.value ?? 0);
}

/** 05:00–10:59 morning · 11:00–16:59 afternoon · 17:00–22:59 evening · 23:00–04:59 late */
export function getGreetingPeriod(hour: number): GreetingPeriod {
  if (hour >= 5 && hour <= 10) return "morning";
  if (hour >= 11 && hour <= 16) return "afternoon";
  if (hour >= 17 && hour <= 22) return "evening";
  return "late";
}

export function getGreetingPeriodForTimezone(
  timezone: string,
  now: Date = new Date()
): GreetingPeriod {
  return getGreetingPeriod(getLocalHour(timezone, now));
}

export function getGreetingText(period: GreetingPeriod, labels: GreetingLabels): string {
  if (period === "late") {
    const options = labels.late.length > 0 ? labels.late : [labels.evening];
    const index = new Date().getUTCDate() % options.length;
    return options[index] ?? labels.evening;
  }
  return labels[period];
}

export function formatWelcomeMessage(
  labels: GreetingLabels,
  options: {
    timezone: string;
    userName?: string | null;
    now?: Date;
  }
): { period: GreetingPeriod; message: string; timezone: string } {
  const timezone = resolveTimezone({ browserTimezone: options.timezone });
  const period = getGreetingPeriodForTimezone(timezone, options.now);
  const greeting = getGreetingText(period, labels);
  const name = options.userName?.trim();
  const message = name ? `${greeting}, ${name}.` : `${greeting}.`;

  return { period, message, timezone };
}

export function getBrowserTimezone(): string {
  if (typeof Intl === "undefined") return "UTC";
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

/** @deprecated Use getGreetingPeriod — kept for platform panels during migration. */
export function getGreetingName(hour: number): GreetingPeriod {
  return getGreetingPeriod(hour);
}
