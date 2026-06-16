import type {
  ResilienceArea,
  ResilienceOverview,
  ResilienceRecommendation,
  ResilienceSignals,
  ResilienceStatus,
  ResilienceTimelineEvent,
  ResilienceTrend,
  ResilienceVulnerability,
} from "./types";
import { RESILIENCE_STATUSES, RESILIENCE_TRENDS } from "./types";

const STATUSES = new Set<ResilienceStatus>(RESILIENCE_STATUSES);
const TRENDS = new Set<ResilienceTrend>(RESILIENCE_TRENDS);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseAreas(raw: unknown): ResilienceArea[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    const status = str(d.resilience_status, "stable") as ResilienceStatus;
    const trend = str(d.trend_direction, "stable") as ResilienceTrend;
    return {
      id: str(d.id),
      title: str(d.title),
      category: str(d.category),
      resilience_status: STATUSES.has(status) ? status : status,
      current_assessment: num(d.current_assessment),
      identified_vulnerabilities: parseStringArray(d.identified_vulnerabilities),
      existing_safeguards: parseStringArray(d.existing_safeguards),
      recovery_considerations: str(d.recovery_considerations),
      responsible_owner: str(d.responsible_owner),
      owner_id: d.owner_id ? str(d.owner_id) : null,
      last_reviewed_date: str(d.last_reviewed_date) || null,
      related_continuity_plans: parseStringArray(d.related_continuity_plans),
      related_risks: parseStringArray(d.related_risks),
      related_playbooks: parseStringArray(d.related_playbooks),
      notes: str(d.notes),
      trend_direction: TRENDS.has(trend) ? trend : trend,
    };
  });
}

function parseRecommendations(raw: unknown): ResilienceRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), priority: str(d.priority) };
  });
}

function parseVulnerabilities(raw: unknown): ResilienceVulnerability[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), severity: str(d.severity) };
  });
}

function parseSignals(raw: unknown): ResilienceSignals | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    continuity_planning: num(d.continuity_planning),
    risk_mitigation_progress: num(d.risk_mitigation_progress),
    backup_ownership_coverage: num(d.backup_ownership_coverage),
    operational_dependencies: num(d.operational_dependencies),
    learning_implementation: num(d.learning_implementation),
    capacity_balance: num(d.capacity_balance),
    policy_compliance: num(d.policy_compliance),
    incident_preparedness: num(d.incident_preparedness),
    vendor_diversification: num(d.vendor_diversification),
    leadership_readiness: num(d.leadership_readiness),
  };
}

export function parseResilienceOverview(data: unknown): ResilienceOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const status = str(d.organizational_resilience_status, "stable") as ResilienceStatus;

  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    can_admin: d.can_admin === true,
    review_started: d.review_started === true,
    organizational_resilience_score: num(d.organizational_resilience_score),
    adaptability_score: num(d.adaptability_score),
    continuity_preparedness_score: num(d.continuity_preparedness_score),
    operational_stability_score: num(d.operational_stability_score),
    dependency_risk_score: num(d.dependency_risk_score),
    recovery_readiness: num(d.recovery_readiness),
    organizational_resilience_status: STATUSES.has(status) ? status : "stable",
    positive_resilience_indicators: parseStringArray(d.positive_resilience_indicators),
    resilience_areas: parseAreas(d.resilience_areas),
    recommendations: parseRecommendations(d.recommendations),
    vulnerabilities: parseVulnerabilities(d.vulnerabilities),
    personal_areas: parseAreas(d.personal_areas),
    resilience_signals: parseSignals(d.resilience_signals),
    principle: str(d.principle),
  };
}

export function parseResilienceTimeline(data: unknown): ResilienceTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.timeline)) return [];
  return d.timeline.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      id: str(row.id),
      event_type: str(row.event_type),
      description: str(row.description),
      created_at: str(row.created_at),
    };
  });
}

export function parseResilienceRecommendations(data: unknown): ResilienceRecommendation[] {
  if (!data || typeof data !== "object") return [];
  return parseRecommendations((data as Record<string, unknown>).recommendations);
}

export function parseResilienceVulnerabilities(data: unknown): ResilienceVulnerability[] {
  if (!data || typeof data !== "object") return [];
  return parseVulnerabilities((data as Record<string, unknown>).vulnerabilities);
}
