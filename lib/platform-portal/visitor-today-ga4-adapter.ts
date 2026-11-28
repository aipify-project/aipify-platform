/**
 * Fail-closed GA4 Data API adapter for unique visitors today.
 * No credentials / property wiring → unavailable (never invent 0 or realtime).
 * Does not call Google APIs until owner YES + secrets + property verification.
 */

import { calendarDayBounds } from "@/lib/platform-portal/traffic-status";
import {
  buildMeasuredVisitorToday,
  buildUnavailableVisitorToday,
  type VisitorTodayContract,
} from "@/lib/platform-portal/visitor-today-contract";

export type Ga4VisitorTodayEnv = {
  /** GA4 property id digits only — never log full secrets. */
  propertyId: string | undefined;
  /** Service account / OIDC path marker — presence only, not contents. */
  credentialsConfigured: boolean;
};

export function readGa4VisitorTodayEnv(
  env: NodeJS.ProcessEnv = process.env,
): Ga4VisitorTodayEnv {
  const propertyId =
    typeof env.GA4_PROPERTY_ID === "string" && env.GA4_PROPERTY_ID.trim()
      ? env.GA4_PROPERTY_ID.trim()
      : typeof env.GOOGLE_ANALYTICS_PROPERTY_ID === "string" &&
          env.GOOGLE_ANALYTICS_PROPERTY_ID.trim()
        ? env.GOOGLE_ANALYTICS_PROPERTY_ID.trim()
        : undefined;
  const credentialsConfigured = Boolean(
    (typeof env.GA4_DATA_API_CREDENTIALS_JSON === "string" &&
      env.GA4_DATA_API_CREDENTIALS_JSON.trim()) ||
      (typeof env.GOOGLE_APPLICATION_CREDENTIALS === "string" &&
        env.GOOGLE_APPLICATION_CREDENTIALS.trim()),
  );
  return { propertyId, credentialsConfigured };
}

/**
 * Resolve unique visitors for the calendar day.
 * Without verified property + credentials this stays unavailable.
 * Live Data API fetch is intentionally not implemented until approval pack YES.
 */
export async function resolveVisitorTodayFromGa4(input: {
  now: Date;
  dayTimeZone: string;
  env?: Ga4VisitorTodayEnv;
  /** Test/fixture only — never pass Production live counts from client. */
  fixtureUniqueVisitors?: number | null;
}): Promise<VisitorTodayContract> {
  const asOf = input.now.toISOString();
  const bounds = calendarDayBounds(input.now, input.dayTimeZone);
  const dayStartIso = bounds ? new Date(bounds.startMs).toISOString() : null;
  const dayEndIso = bounds ? new Date(bounds.endMs).toISOString() : null;
  const env = input.env ?? readGa4VisitorTodayEnv();

  if (
    typeof input.fixtureUniqueVisitors === "number" &&
    Number.isFinite(input.fixtureUniqueVisitors) &&
    input.fixtureUniqueVisitors >= 0
  ) {
    if (!dayStartIso || !dayEndIso) {
      return buildUnavailableVisitorToday({
        asOf,
        dayTimeZone: input.dayTimeZone,
        source: "fixture",
        reason: "source_unavailable",
        note: "Fixture provided but day bounds failed.",
      });
    }
    return buildMeasuredVisitorToday({
      asOf,
      dayTimeZone: input.dayTimeZone,
      dayStartIso,
      dayEndIso,
      value: Math.floor(input.fixtureUniqueVisitors),
      source: "fixture",
      freshness: "fresh",
      note: "Fixture path for unit/contract tests only.",
    });
  }

  if (!env.propertyId || !env.credentialsConfigured) {
    return buildUnavailableVisitorToday({
      asOf,
      dayTimeZone: input.dayTimeZone,
      dayStartIso,
      dayEndIso,
      source: "not_configured",
      freshness: "unavailable",
      reason: "not_measured",
      note:
        "GA4 Data API property/credentials not configured. Visitors today stays unavailable until owner YES.",
    });
  }

  // Credentials present but live fetch gated — fail closed (no silent fake fetch).
  return buildUnavailableVisitorToday({
    asOf,
    dayTimeZone: input.dayTimeZone,
    dayStartIso,
    dayEndIso,
    source: "ga4_data_api",
    freshness: "unavailable",
    reason: "source_unavailable",
    note:
      "GA4 credentials detected but live Data API fetch is gated pending owner approval pack. Not realtime.",
  });
}
