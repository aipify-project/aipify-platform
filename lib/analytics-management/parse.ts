import type { AnalyticsCenter, AnalyticsInsight, ExecutiveInsightsCenter } from "./types";

function num(v: unknown): number | undefined {
  if (v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function parseInsight(row: Record<string, unknown>): AnalyticsInsight {
  return {
    id: String(row.id ?? ""),
    insight_type: String(row.insight_type ?? ""),
    severity: String(row.severity ?? "information"),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    recommendation: String(row.recommendation ?? ""),
    department_id: typeof row.department_id === "string" ? row.department_id : null,
    metric_delta: row.metric_delta == null ? null : num(row.metric_delta),
    status: String(row.status ?? "active"),
    created_at: String(row.created_at ?? ""),
  };
}

export function parseAnalyticsCenter(data: unknown): AnalyticsCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    coaching_note: typeof row.coaching_note === "string" ? row.coaching_note : undefined,
    visibility: row.visibility as AnalyticsCenter["visibility"],
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    operations: row.operations as AnalyticsCenter["operations"],
    departments: Array.isArray(row.departments) ? (row.departments as Record<string, unknown>[]) : [],
    employees: Array.isArray(row.employees) ? (row.employees as Record<string, unknown>[]) : [],
    domains: Array.isArray(row.domains) ? (row.domains as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    assets: row.assets as Record<string, unknown> | undefined,
    communication: row.communication as Record<string, unknown> | undefined,
    knowledge: row.knowledge as Record<string, unknown> | undefined,
    financial: row.financial as Record<string, unknown> | undefined,
    productivity: row.productivity as Record<string, unknown> | undefined,
    reports: Array.isArray(row.reports) ? (row.reports as Record<string, unknown>[]) : [],
    scheduled_reports: Array.isArray(row.scheduled_reports) ? (row.scheduled_reports as Record<string, unknown>[]) : [],
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}

export function parseExecutiveInsightsCenter(data: unknown): ExecutiveInsightsCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) {
    return {
      found: false,
      reason: typeof row.reason === "string" ? row.reason : undefined,
    };
  }

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    coaching_note: typeof row.coaching_note === "string" ? row.coaching_note : undefined,
    organization_health: num(row.organization_health),
    visibility: row.visibility as ExecutiveInsightsCenter["visibility"],
    insights: Array.isArray(row.insights)
      ? (row.insights as Record<string, unknown>[]).map(parseInsight)
      : [],
    briefings: row.briefings as ExecutiveInsightsCenter["briefings"],
    companion_examples: Array.isArray(row.companion_examples)
      ? row.companion_examples.map(String)
      : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}
