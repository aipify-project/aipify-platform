import type { SupabaseClient } from "@supabase/supabase-js";

/** Aggregate member statistics snapshot — counts only, no PII. */
export type UnonightMemberStatisticsSnapshot = {
  found: boolean;
  organization_id: string | null;
  total_members: number | null;
  active_members: number | null;
  new_members_today: number | null;
  new_members_7d: number | null;
  new_members_30d: number | null;
  new_members_since: number | null;
  member_growth: readonly UnonightMemberGrowthPeriod[];
  excluded_test_demo: number | null;
  excluded_deactivated: number | null;
  source_reference: string;
  generated_at: string;
  as_of: string | null;
  timezone: string;
  period: UnonightMemberStatisticsPeriod;
  completeness: "complete" | "partial" | "empty";
  warnings: readonly string[];
  since_boundary_source: "explicit_date_from" | "since_last_login" | "none" | null;
  error?: string | null;
};

export type UnonightMemberGrowthPeriod = {
  period_key: string;
  period_start: string;
  period_end: string;
  new_members: number;
  net_growth: number;
};

export type UnonightMemberStatisticsPeriod = {
  from: string | null;
  to: string | null;
  kind: "explicit" | "since_last" | "current" | "empty";
  since_boundary_source?: string | null;
  timezone?: string | null;
};

export const UNONIGHT_MEMBER_STATISTICS_RPC = "get_unonight_member_statistics";

export const UNONIGHT_MEMBER_METRIC_DEFINITIONS = {
  registered_member:
    "Completed Unonight registration with organization membership confirmed.",
  active_member:
    "Registered member active within 90 days; excludes test, demo, and deactivated accounts.",
  new_member:
    "Registration completed within the requested period; excludes test and demo accounts.",
  excluded_test_demo: "Test and demo accounts excluded per Unonight platform rules.",
  excluded_deactivated:
    "Suspended, removed, or banned accounts excluded from totals.",
} as const;

function readCount(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function parseGrowthPeriods(value: unknown): UnonightMemberGrowthPeriod[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const row = entry as Record<string, unknown>;
      const newMembers = readCount(row.new_members);
      const netGrowth = readCount(row.net_growth);
      const periodKey = readString(row.period_key);
      if (newMembers === null || netGrowth === null || !periodKey) return null;
      return {
        period_key: periodKey,
        period_start: readString(row.period_start) ?? "",
        period_end: readString(row.period_end) ?? "",
        new_members: newMembers,
        net_growth: netGrowth,
      };
    })
    .filter((entry): entry is UnonightMemberGrowthPeriod => entry !== null);
}

function parsePeriod(value: unknown): UnonightMemberStatisticsPeriod {
  if (!value || typeof value !== "object") {
    return { from: null, to: null, kind: "current" };
  }
  const row = value as Record<string, unknown>;
  const kind = readString(row.kind);
  return {
    from: readString(row.from),
    to: readString(row.to),
    kind:
      kind === "explicit" || kind === "since_last" || kind === "empty"
        ? kind
        : "current",
    since_boundary_source: readString(row.since_boundary_source),
    timezone: readString(row.timezone),
  };
}

export function parseUnonightMemberStatisticsPayload(
  data: unknown,
): UnonightMemberStatisticsSnapshot {
  if (!data || typeof data !== "object") {
    return {
      found: false,
      organization_id: null,
      total_members: null,
      active_members: null,
      new_members_today: null,
      new_members_7d: null,
      new_members_30d: null,
      new_members_since: null,
      member_growth: [],
      excluded_test_demo: null,
      excluded_deactivated: null,
      source_reference: `rpc:${UNONIGHT_MEMBER_STATISTICS_RPC}`,
      generated_at: new Date().toISOString(),
      as_of: null,
      timezone: "UTC",
      period: { from: null, to: null, kind: "empty" },
      completeness: "empty",
      warnings: [],
      since_boundary_source: null,
      error: "invalid_payload",
    };
  }

  const row = data as Record<string, unknown>;
  const period = parsePeriod(row.period);
  const sinceSource = readString(period.since_boundary_source) as
    | UnonightMemberStatisticsSnapshot["since_boundary_source"]
    | null;

  return {
    found: row.found === true,
    organization_id: readString(row.organization_id),
    total_members: readCount(row.total_members),
    active_members: readCount(row.active_members),
    new_members_today: readCount(row.new_members_today),
    new_members_7d: readCount(row.new_members_7d),
    new_members_30d: readCount(row.new_members_30d),
    new_members_since: readCount(row.new_members_since),
    member_growth: parseGrowthPeriods(row.member_growth),
    excluded_test_demo: readCount(row.excluded_test_demo),
    excluded_deactivated: readCount(row.excluded_deactivated),
    source_reference:
      readString(row.source_reference) ?? `rpc:${UNONIGHT_MEMBER_STATISTICS_RPC}`,
    generated_at: readString(row.generated_at) ?? new Date().toISOString(),
    as_of: readString(row.as_of),
    timezone: readString(row.timezone) ?? "UTC",
    period,
    completeness:
      row.completeness === "complete" ||
      row.completeness === "partial" ||
      row.completeness === "empty"
        ? row.completeness
        : "empty",
    warnings: Array.isArray(row.warnings)
      ? row.warnings.filter((entry): entry is string => typeof entry === "string")
      : [],
    since_boundary_source: sinceSource,
    error: readString(row.error),
  };
}

export async function fetchUnonightMemberStatistics(
  supabase: SupabaseClient,
  input?: {
    dateFrom?: string | null;
    dateTo?: string | null;
    timezone?: string | null;
  },
): Promise<UnonightMemberStatisticsSnapshot> {
  const { data, error } = await supabase.rpc(UNONIGHT_MEMBER_STATISTICS_RPC, {
    p_date_from: input?.dateFrom ?? null,
    p_date_to: input?.dateTo ?? null,
    p_timezone: input?.timezone ?? null,
  });

  if (error) {
    return {
      found: false,
      organization_id: null,
      total_members: null,
      active_members: null,
      new_members_today: null,
      new_members_7d: null,
      new_members_30d: null,
      new_members_since: null,
      member_growth: [],
      excluded_test_demo: null,
      excluded_deactivated: null,
      source_reference: `rpc:${UNONIGHT_MEMBER_STATISTICS_RPC}`,
      generated_at: new Date().toISOString(),
      as_of: null,
      timezone: input?.timezone ?? "UTC",
      period: { from: input?.dateFrom ?? null, to: input?.dateTo ?? null, kind: "empty" },
      completeness: "empty",
      warnings: [],
      since_boundary_source: null,
      error: error.message,
    };
  }

  return parseUnonightMemberStatisticsPayload(data);
}

/** Test and E2E helper — builds a snapshot without RPC. */
export function buildUnonightMemberStatisticsSnapshot(input: {
  total_members?: number | null;
  active_members?: number | null;
  new_members_today?: number | null;
  new_members_7d?: number | null;
  new_members_30d?: number | null;
  new_members_since?: number | null;
  member_growth?: readonly UnonightMemberGrowthPeriod[];
  completeness?: "complete" | "partial" | "empty";
  since_boundary_source?: UnonightMemberStatisticsSnapshot["since_boundary_source"];
  found?: boolean;
}): UnonightMemberStatisticsSnapshot {
  return {
    found: input.found ?? true,
    organization_id: "test-org",
    total_members: input.total_members ?? null,
    active_members: input.active_members ?? null,
    new_members_today: input.new_members_today ?? null,
    new_members_7d: input.new_members_7d ?? null,
    new_members_30d: input.new_members_30d ?? null,
    new_members_since: input.new_members_since ?? null,
    member_growth: input.member_growth ?? [],
    excluded_test_demo: 0,
    excluded_deactivated: 0,
    source_reference: "unonight_supabase_views:member_statistics_aggregate",
    generated_at: new Date().toISOString(),
    as_of: new Date().toISOString(),
    timezone: "Europe/Oslo",
    period: {
      from: null,
      to: null,
      kind: input.since_boundary_source === "since_last_login" ? "since_last" : "current",
      since_boundary_source: input.since_boundary_source ?? null,
    },
    completeness: input.completeness ?? "complete",
    warnings: [],
    since_boundary_source: input.since_boundary_source ?? null,
  };
}
