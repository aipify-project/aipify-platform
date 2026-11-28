/**
 * Authoritative visitor-today contract for Platform Admin status (Agent 3 → Agent 4).
 *
 * Agent 3 owns this analytics contract + fail-closed adapters.
 * Agent 4 owns top-bar / presence UI consumption — never invent parallel visitor models.
 *
 * Definitions:
 * - unique visitors: distinct visitors for the calendar day in `dayTimeZone`
 * - sessions / events: not this metric (do not substitute)
 * - freshness: GA4 reporting can be delayed; never label as realtime unless source proves it
 * - value 0 = measured empty day; unavailable/null = not measured / source failed / stale gate
 */

import type { TrafficCount } from "@/lib/platform-portal/traffic-status";

export const VISITOR_TODAY_METRIC = "unique_visitors_today" as const;
export const VISITOR_TODAY_DEFAULT_TIMEZONE = "Europe/Oslo" as const;

export type VisitorTodaySource =
  | "ga4_data_api"
  | "not_configured"
  | "fixture";

export type VisitorTodayFreshness =
  | "fresh"
  | "delayed"
  | "stale"
  | "unavailable";

export type VisitorTodayContract = {
  metric: typeof VISITOR_TODAY_METRIC;
  /** IANA zone used for “today” day bounds. */
  dayTimeZone: string;
  /** Inclusive calendar day start (ISO). */
  dayStartIso: string | null;
  /** Exclusive calendar day end (ISO). */
  dayEndIso: string | null;
  /** ISO timestamp when this snapshot was assembled. */
  asOf: string;
  source: VisitorTodaySource;
  freshness: VisitorTodayFreshness;
  /**
   * Measured unique visitors for the day, or unavailable.
   * Never coerce source failure into 0.
   */
  count: TrafficCount;
  /** Optional human note for operators (no secrets). */
  note: string | null;
};

export type VisitorTodayAdapterResult = Omit<VisitorTodayContract, "metric">;

export function buildUnavailableVisitorToday(input: {
  asOf: string;
  dayTimeZone: string;
  source?: VisitorTodaySource;
  freshness?: VisitorTodayFreshness;
  reason?: "not_measured" | "source_unavailable";
  note?: string | null;
  dayStartIso?: string | null;
  dayEndIso?: string | null;
}): VisitorTodayContract {
  return {
    metric: VISITOR_TODAY_METRIC,
    dayTimeZone: input.dayTimeZone,
    dayStartIso: input.dayStartIso ?? null,
    dayEndIso: input.dayEndIso ?? null,
    asOf: input.asOf,
    source: input.source ?? "not_configured",
    freshness: input.freshness ?? "unavailable",
    count: {
      state: "unavailable",
      reason: input.reason ?? "not_measured",
    },
    note: input.note ?? null,
  };
}

export function buildMeasuredVisitorToday(input: {
  asOf: string;
  dayTimeZone: string;
  dayStartIso: string;
  dayEndIso: string;
  value: number;
  source: VisitorTodaySource;
  freshness: Exclude<VisitorTodayFreshness, "unavailable">;
  note?: string | null;
}): VisitorTodayContract {
  return {
    metric: VISITOR_TODAY_METRIC,
    dayTimeZone: input.dayTimeZone,
    dayStartIso: input.dayStartIso,
    dayEndIso: input.dayEndIso,
    asOf: input.asOf,
    source: input.source,
    freshness: input.freshness,
    count: { state: "value", value: input.value },
    note: input.note ?? null,
  };
}

/** Map contract → TrafficCount for Agent 4 top-bar (no raw analytics payload). */
export function visitorTodayToTrafficCount(
  contract: VisitorTodayContract,
): TrafficCount {
  return contract.count;
}
