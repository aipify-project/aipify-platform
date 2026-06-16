import type {
  AppPortalExecutiveInsights,
  ExecutiveInsightsCard,
  ExecutiveInsightsHealthStatus,
  ExecutiveInsightsPriority,
  ExecutiveInsightsRecommendation,
  ExecutiveInsightsSinceLastLogin,
  ExecutiveInsightsTrend,
  RiskSeverity,
} from "./types";

const HEALTH = new Set<ExecutiveInsightsHealthStatus>(["healthy", "warning", "critical"]);
const TREND = new Set<ExecutiveInsightsTrend>(["improving", "stable", "declining"]);
const SEV = new Set<RiskSeverity>(["low", "medium", "high"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}
function num(v: unknown, fb = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fb;
}
function bool(v: unknown): boolean {
  return v === true;
}
function strArr(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean) : [];
}

function parsePriority(raw: unknown): ExecutiveInsightsPriority {
  const d = (raw ?? {}) as Record<string, unknown>;
  return { id: str(d.id), title: str(d.title), href: str(d.href), kind: str(d.kind) || undefined };
}

function parseCard(raw: unknown): ExecutiveInsightsCard {
  const d = (raw ?? {}) as Record<string, unknown>;
  const sev = str(d.severity, "low");
  return {
    id: str(d.id),
    title: str(d.title),
    detail: str(d.detail),
    severity: SEV.has(sev as RiskSeverity) ? (sev as RiskSeverity) : "low",
  };
}

function parseRecommendation(raw: unknown): ExecutiveInsightsRecommendation {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: str(d.id),
    title: str(d.title),
    why: str(d.why),
    expected_impact: str(d.expected_impact),
    action: str(d.action),
    href: str(d.href),
  };
}

function parseSinceLastLogin(raw: unknown): ExecutiveInsightsSinceLastLogin {
  if (!raw || typeof raw !== "object") return {};
  const d = raw as Record<string, unknown>;
  return {
    new_team_members: num(d.new_team_members) || undefined,
    integrations_connected: num(d.integrations_connected) || undefined,
    business_packs_installed: num(d.business_packs_installed) || undefined,
    tasks_completed: num(d.tasks_completed) || undefined,
    major_events: strArr(d.major_events),
    billing_events: strArr(d.billing_events),
    summary: str(d.summary) || undefined,
    highlights: Array.isArray(d.highlights)
      ? d.highlights.map((h) => {
          const row = h as Record<string, unknown>;
          return { title: str(row.title), detail: str(row.detail) || undefined };
        })
      : undefined,
  };
}

export function parseAppPortalExecutiveInsights(data: unknown): AppPortalExecutiveInsights {
  if (!data || typeof data !== "object") {
    return { found: false, has_access: false, priorities: [], since_last_login: {}, opportunities: [], risks: [], recommendations: [] };
  }
  const d = data as Record<string, unknown>;
  const h = d.health as Record<string, unknown> | undefined;
  const trend = str(h?.trend, "stable");
  const status = str(h?.status, "healthy");

  return {
    found: bool(d.found),
    has_access: bool(d.has_access),
    error: str(d.error) || undefined,
    principle: str(d.principle),
    sparse_data: bool(d.sparse_data),
    health: h
      ? {
          score: num(h.score, 75),
          trend: TREND.has(trend as ExecutiveInsightsTrend) ? (trend as ExecutiveInsightsTrend) : "stable",
          status: HEALTH.has(status as ExecutiveInsightsHealthStatus) ? (status as ExecutiveInsightsHealthStatus) : "healthy",
          status_label: str(h.status_label),
          factors: Array.isArray(h.factors)
            ? h.factors.map((f) => {
                const row = f as Record<string, unknown>;
                return {
                  key: str(row.key),
                  label: str(row.label),
                  value: typeof row.value === "number" ? row.value : str(row.value),
                  status: str(row.status),
                };
              })
            : [],
        }
      : undefined,
    priorities: Array.isArray(d.priorities) ? d.priorities.map(parsePriority) : [],
    since_last_login: parseSinceLastLogin(d.since_last_login),
    opportunities: Array.isArray(d.opportunities) ? d.opportunities.map(parseCard) : [],
    risks: Array.isArray(d.risks) ? d.risks.map(parseCard) : [],
    recommendations: Array.isArray(d.recommendations) ? d.recommendations.map(parseRecommendation) : [],
  };
}
