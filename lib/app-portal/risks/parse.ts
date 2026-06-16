import type {
  ImpactLevel,
  Likelihood,
  OverallRiskLevel,
  RiskCategory,
  RiskDetail,
  RiskItem,
  RiskListResponse,
  RiskMitigation,
  RiskRecommendation,
  RiskStatus,
  RisksDashboard,
} from "./types";
import type { ReviewFrequency } from "../responsibilities/types";

const CATEGORIES = new Set<RiskCategory>([
  "operational", "financial", "security", "compliance", "customer",
  "vendor", "strategic", "technology", "reputational", "workforce",
]);
const STATUSES = new Set<RiskStatus>([
  "identified", "under_review", "mitigation_in_progress", "monitoring",
  "accepted", "resolved", "archived",
]);
const LIKELIHOODS = new Set<Likelihood>(["very_low", "low", "moderate", "high", "very_high"]);
const IMPACTS = new Set<ImpactLevel>(["negligible", "minor", "moderate", "major", "critical"]);
const LEVELS = new Set<OverallRiskLevel>(["low", "medium", "high", "critical"]);
const FREQS = new Set<ReviewFrequency>(["monthly", "quarterly", "semi_annual", "annual"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)) : [];
}

function parseItem(raw: unknown): RiskItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const category = str(d.category, "operational") as RiskCategory;
  const status = str(d.status, "identified") as RiskStatus;
  const likelihood = str(d.likelihood, "moderate") as Likelihood;
  const impact = str(d.impact, "moderate") as ImpactLevel;
  const overall = str(d.overall_level, "medium") as OverallRiskLevel;
  const freq = str(d.review_frequency) as ReviewFrequency;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description_full) || str(d.description),
    description_full: str(d.description_full) || undefined,
    category: CATEGORIES.has(category) ? category : "operational",
    owner_id: str(d.owner_id) || null,
    owner_name: str(d.owner_name, "Unassigned"),
    contributor_ids: strArray(d.contributor_ids),
    shared_with_ids: strArray(d.shared_with_ids),
    status: STATUSES.has(status) ? status : "identified",
    likelihood: LIKELIHOODS.has(likelihood) ? likelihood : "moderate",
    impact: IMPACTS.has(impact) ? impact : "moderate",
    overall_level: LEVELS.has(overall) ? overall : "medium",
    risk_score: typeof d.risk_score === "number" ? d.risk_score : 0,
    identified_date: str(d.identified_date),
    review_frequency: FREQS.has(freq) ? freq : null,
    next_review_date: str(d.next_review_date) || null,
    mitigation_strategy: str(d.mitigation_strategy_full) || str(d.mitigation_strategy) || undefined,
    mitigation_strategy_full: str(d.mitigation_strategy_full) || undefined,
    contingency_plan: str(d.contingency_plan_full) || str(d.contingency_plan) || undefined,
    contingency_plan_full: str(d.contingency_plan_full) || undefined,
    related_modules: strArray(d.related_modules),
    notes: str(d.notes_full) || str(d.notes) || undefined,
    notes_full: str(d.notes_full) || undefined,
    needs_review: d.needs_review === true,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseRecs(raw: unknown): RiskRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), risk_id: str(row.risk_id) || undefined };
  });
}

function parseDashboard(raw: unknown): RisksDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    active: typeof d.active === "number" ? d.active : 0,
    high_risk: typeof d.high_risk === "number" ? d.high_risk : 0,
    needs_review: typeof d.needs_review === "number" ? d.needs_review : 0,
    without_owner: typeof d.without_owner === "number" ? d.without_owner : 0,
    approaching_review: typeof d.approaching_review === "number" ? d.approaching_review : 0,
    recently_resolved: Array.isArray(d.recently_resolved) ? d.recently_resolved.map(parseItem) : [],
  };
}

function parseMitigation(raw: unknown): RiskMitigation {
  const d = (raw ?? {}) as Record<string, unknown>;
  const rl = str(d.residual_likelihood) as Likelihood;
  const ri = str(d.residual_impact) as ImpactLevel;
  const level = str(d.residual_level) as OverallRiskLevel;
  return {
    id: str(d.id),
    action_taken: str(d.action_taken),
    effectiveness_review: str(d.effectiveness_review),
    residual_likelihood: LIKELIHOODS.has(rl) ? rl : null,
    residual_impact: IMPACTS.has(ri) ? ri : null,
    residual_level: LEVELS.has(level) ? level : null,
    next_review_date: str(d.next_review_date) || null,
    escalation_required: d.escalation_required === true,
    created_at: str(d.created_at),
    performed_by: str(d.performed_by),
  };
}

export function parseRiskList(data: unknown): RiskListResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map(parseItem) : [],
    dashboard: parseDashboard(d.dashboard),
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseRiskDetail(data: unknown): RiskDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  const audit = Array.isArray(d.audit_history)
    ? d.audit_history.map((a) => {
        const row = a as Record<string, unknown>;
        return {
          id: str(row.id),
          event_type: str(row.event_type),
          description: str(row.description),
          created_at: str(row.created_at),
          performed_by: str(row.performed_by),
        };
      })
    : [];
  return {
    found: true,
    can_manage: d.can_manage === true,
    risk: d.risk ? parseItem(d.risk) : undefined,
    mitigations: Array.isArray(d.mitigations) ? d.mitigations.map(parseMitigation) : [],
    contributors: Array.isArray(d.contributors)
      ? d.contributors.map((c) => {
          const row = c as Record<string, unknown>;
          return { user_id: str(row.user_id), name: str(row.name) };
        })
      : [],
    related_follow_ups: Array.isArray(d.related_follow_ups)
      ? d.related_follow_ups.map((f) => {
          const row = f as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [],
    related_decisions: Array.isArray(d.related_decisions)
      ? d.related_decisions.map((x) => {
          const row = x as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [],
    activity_timeline: audit,
    audit_history: audit,
    recommendations: parseRecs(d.recommendations),
  };
}

export function parseRiskItem(data: unknown): RiskItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.risk) return parseItem(d.risk);
  return parseItem(d);
}
