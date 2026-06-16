import type {
  SuccessCategory,
  SuccessDashboard,
  SuccessDetail,
  SuccessInitiativeItem,
  SuccessListResponse,
  SuccessValueRecommendation,
  SuccessStatus,
  SuccessValueLevel,
} from "./types";

const CATEGORIES = new Set<SuccessCategory>([
  "financial_value", "operational_value", "customer_value", "employee_value",
  "strategic_value", "productivity_value", "quality_improvement", "risk_reduction",
  "innovation_value", "custom_value_category",
]);
const STATUSES = new Set<SuccessStatus>([
  "planned", "in_progress", "measuring", "successful", "partially_successful",
  "did_not_meet_expectations", "archived",
]);
const VALUE_LEVELS = new Set<SuccessValueLevel>([
  "emerging_value", "moderate_value", "significant_value", "transformational_value",
]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function parseInitiative(raw: unknown): SuccessInitiativeItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const cat = str(d.category, "operational_value") as SuccessCategory;
  const status = str(d.status, "planned") as SuccessStatus;
  const vl = str(d.value_level, "moderate_value") as SuccessValueLevel;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description_full) || str(d.description) || undefined,
    description_full: str(d.description_full) || undefined,
    category: CATEGORIES.has(cat) ? cat : "operational_value",
    initiative_owner_id: str(d.initiative_owner_id) || null,
    initiative_owner_name: str(d.initiative_owner_name, "Unassigned"),
    executive_sponsor_id: str(d.executive_sponsor_id) || null,
    executive_sponsor_name: str(d.executive_sponsor_name, "Unassigned"),
    status: STATUSES.has(status) ? status : "planned",
    value_level: VALUE_LEVELS.has(vl) ? vl : "moderate_value",
    expected_outcomes: str(d.expected_outcomes_full) || str(d.expected_outcomes) || undefined,
    expected_outcomes_full: str(d.expected_outcomes_full) || undefined,
    actual_outcomes: str(d.actual_outcomes_full) || str(d.actual_outcomes) || undefined,
    actual_outcomes_full: str(d.actual_outcomes_full) || undefined,
    value_hypothesis: str(d.value_hypothesis_full) || str(d.value_hypothesis) || undefined,
    value_hypothesis_full: str(d.value_hypothesis_full) || undefined,
    measurement_method: str(d.measurement_method_full) || str(d.measurement_method) || undefined,
    measurement_method_full: str(d.measurement_method_full) || undefined,
    start_date: str(d.start_date) || null,
    completion_date: str(d.completion_date) || null,
    review_date: str(d.review_date) || null,
    missing_measurement: d.missing_measurement === true,
    goals_achieved: str(d.goals_achieved) || undefined,
    goals_missed: str(d.goals_missed) || undefined,
    unexpected_benefits: str(d.unexpected_benefits) || undefined,
    unexpected_consequences: str(d.unexpected_consequences) || undefined,
    recommended_adjustments: str(d.recommended_adjustments) || undefined,
    replication_opportunities: str(d.replication_opportunities) || undefined,
    lessons_learned: str(d.lessons_learned) || undefined,
    notes: str(d.notes_full) || str(d.notes) || undefined,
    notes_full: str(d.notes_full) || undefined,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseRecs(raw: unknown): SuccessValueRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), initiative_id: str(row.initiative_id) || undefined };
  });
}

function parseDashboard(raw: unknown): SuccessDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    active: typeof d.active === "number" ? d.active : 0,
    recently_realized: Array.isArray(d.recently_realized) ? d.recently_realized.map(parseInitiative) : [],
    under_review: typeof d.under_review === "number" ? d.under_review : 0,
    highest_impact: typeof d.highest_impact === "number" ? d.highest_impact : 0,
    missing_measurements: typeof d.missing_measurements === "number" ? d.missing_measurements : 0,
    success_trends: Array.isArray(d.success_trends) ? d.success_trends.map(parseInitiative) : [],
  };
}

export function parseSuccessList(data: unknown): SuccessListResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map(parseInitiative) : [],
    dashboard: parseDashboard(d.dashboard),
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseSuccessDetail(data: unknown): SuccessDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  const audit = Array.isArray(d.audit_history)
    ? d.audit_history.map((a) => {
        const row = a as Record<string, unknown>;
        return { id: str(row.id), event_type: str(row.event_type), description: str(row.description), created_at: str(row.created_at), performed_by: str(row.performed_by) };
      })
    : [];
  return {
    found: true,
    can_manage: d.can_manage === true,
    initiative: d.initiative ? parseInitiative(d.initiative) : undefined,
    related_decisions: Array.isArray(d.related_decisions) ? d.related_decisions.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    related_follow_ups: Array.isArray(d.related_follow_ups) ? d.related_follow_ups.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    review_timeline: audit,
    activity_timeline: audit,
    audit_history: audit,
    recommendations: parseRecs(d.recommendations),
  };
}

export function parseSuccessInitiativeItem(data: unknown): SuccessInitiativeItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.initiative) return parseInitiative(d.initiative);
  return parseInitiative(d);
}
