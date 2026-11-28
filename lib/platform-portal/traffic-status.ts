/**
 * Platform Admin top-bar counts.
 * A zero is shown only when the existing source returned a complete set.
 * Missing, failed, and unmeasured sources stay unavailable.
 */

export type TrafficCount =
  | { state: "value"; value: number }
  | { state: "unavailable"; reason: "not_measured" | "source_unavailable" };

export type PlatformTrafficStatus = {
  checkedAt: string;
  /** IANA zone used for “today”. */
  dayTimeZone: string;
  /** Platform Admin answered this request. Not a separate infrastructure probe. */
  operational: "console_responding";
  newAppCustomersToday: TrafficCount;
  newSellersToday: TrafficCount;
  appCustomersOnline: TrafficCount;
  sellersOnline: TrafficCount;
  signedInUsers: TrafficCount;
  visitorsToday: TrafficCount;
};

const NOT_MEASURED: TrafficCount = { state: "unavailable", reason: "not_measured" };
const SOURCE_UNAVAILABLE: TrafficCount = { state: "unavailable", reason: "source_unavailable" };

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

/** Start and end (exclusive) of the calendar day containing `now` in `timeZone`. */
export function calendarDayBounds(
  now: Date,
  timeZone: string,
): { startMs: number; endMs: number } | null {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const parts = Object.fromEntries(
      dtf
        .formatToParts(now)
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, part.value]),
    );
    const year = Number(parts.year);
    const month = Number(parts.month);
    const day = Number(parts.day);
    const hour = Number(parts.hour);
    const minute = Number(parts.minute);
    const second = Number(parts.second);
    if (![year, month, day, hour, minute, second].every((n) => Number.isFinite(n))) {
      return null;
    }
    const asUtc = Date.UTC(year, month - 1, day, hour, minute, second);
    const offset = asUtc - now.getTime();
    const startMs = Date.UTC(year, month - 1, day, 0, 0, 0) - offset;
    return { startMs, endMs: startMs + 86_400_000 };
  } catch {
    return null;
  }
}

function createdAtMs(row: unknown): number | null {
  const record = asRecord(row);
  const created = record?.created_at;
  if (typeof created !== "string" || !created.trim()) return null;
  const ms = Date.parse(created);
  return Number.isNaN(ms) ? null : ms;
}

/**
 * Count rows created on the calendar day.
 * Incomplete timestamps or a truncated page that still sits inside the day
 * stay unavailable — never a partial number presented as the total.
 */
export function countCreatedOnCalendarDay(input: {
  rows: unknown;
  now: Date;
  timeZone: string;
  truncated?: boolean;
}): TrafficCount {
  if (!Array.isArray(input.rows)) return SOURCE_UNAVAILABLE;
  const bounds = calendarDayBounds(input.now, input.timeZone);
  if (!bounds) return SOURCE_UNAVAILABLE;

  let count = 0;
  let oldest = Number.POSITIVE_INFINITY;
  for (const row of input.rows) {
    const ms = createdAtMs(row);
    if (ms == null) return SOURCE_UNAVAILABLE;
    if (ms < oldest) oldest = ms;
    if (ms >= bounds.startMs && ms < bounds.endMs) count += 1;
  }

  if (input.truncated && input.rows.length > 0 && oldest >= bounds.startMs) {
    return SOURCE_UNAVAILABLE;
  }
  return { state: "value", value: count };
}

/** Customer organizations from the existing registry, excluding staging identities. */
export function countNewAppCustomersToday(input: {
  registry: unknown;
  environmentByCustomerId: ReadonlyMap<string, string | null> | null;
  now: Date;
  timeZone: string;
}): TrafficCount {
  const root = asRecord(input.registry);
  const customers = root?.customers;
  if (!Array.isArray(customers)) return SOURCE_UNAVAILABLE;
  if (customers.length === 0) {
    return countCreatedOnCalendarDay({
      rows: [],
      now: input.now,
      timeZone: input.timeZone,
    });
  }
  if (!input.environmentByCustomerId) return SOURCE_UNAVAILABLE;

  const rows: { created_at: string }[] = [];
  for (const row of customers) {
    const record = asRecord(row);
    const id = record?.customer_id;
    const created = record?.created_at;
    if (typeof id !== "string" || !id || typeof created !== "string") {
      return SOURCE_UNAVAILABLE;
    }
    if (!input.environmentByCustomerId.has(id)) return SOURCE_UNAVAILABLE;
    const environment = input.environmentByCustomerId.get(id);
    if (environment === "staging") continue;
    rows.push({ created_at: created });
  }
  return countCreatedOnCalendarDay({
    rows,
    now: input.now,
    timeZone: input.timeZone,
  });
}

export function buildPlatformTrafficStatus(input: {
  checkedAt: string;
  dayTimeZone: string;
  newAppCustomersToday: TrafficCount;
  newSellersToday: TrafficCount;
  /** Agent 3 visitor-today contract → Agent 4 top-bar. Omit = not_measured. */
  visitorsToday?: TrafficCount;
}): PlatformTrafficStatus {
  return {
    checkedAt: input.checkedAt,
    dayTimeZone: input.dayTimeZone,
    operational: "console_responding",
    newAppCustomersToday: input.newAppCustomersToday,
    newSellersToday: input.newSellersToday,
    appCustomersOnline: NOT_MEASURED,
    sellersOnline: NOT_MEASURED,
    signedInUsers: NOT_MEASURED,
    visitorsToday: input.visitorsToday ?? NOT_MEASURED,
  };
}
