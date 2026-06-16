import type {
  LearningImpactLevel,
  LearningAction,
  LearningCategory,
  LearningDashboard,
  LearningDetail,
  LearningListResponse,
  LearningRecordItem,
  LearningRecommendation,
  LearningStatus,
  PatternInsight,
  RecurringTheme,
} from "./types";

const CATEGORIES = new Set<LearningCategory>([
  "operational_improvement", "customer_experience", "security_improvement", "incident_learning",
  "leadership_learning", "process_improvement", "team_collaboration", "technology_learning",
  "vendor_learning", "custom_learning",
]);
const STATUSES = new Set<LearningStatus>([
  "identified", "under_review", "approved", "in_progress", "implemented", "archived",
]);
const IMPACT = new Set<LearningImpactLevel>([
  "minor_improvement", "moderate_improvement", "significant_improvement", "transformational_improvement",
]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)) : [];
}

function parseRecord(raw: unknown): LearningRecordItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const cat = str(d.category, "operational_improvement") as LearningCategory;
  const status = str(d.status, "identified") as LearningStatus;
  const impact = str(d.impact_level, "moderate_improvement") as LearningImpactLevel;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description_full) || str(d.description) || undefined,
    description_full: str(d.description_full) || undefined,
    category: CATEGORIES.has(cat) ? cat : "operational_improvement",
    submitted_by_id: str(d.submitted_by_id) || null,
    submitted_by_name: str(d.submitted_by_name, "Unassigned"),
    owner_id: str(d.owner_id) || null,
    owner_name: str(d.owner_name, "Unassigned"),
    contributor_ids: strArray(d.contributor_ids),
    status: STATUSES.has(status) ? status : "identified",
    impact_level: IMPACT.has(impact) ? impact : "moderate_improvement",
    date_identified: str(d.date_identified),
    date_implemented: str(d.date_implemented) || null,
    related_modules: strArray(d.related_modules),
    notes: str(d.notes_full) || str(d.notes) || undefined,
    notes_full: str(d.notes_full) || undefined,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseAction(raw: unknown): LearningAction {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: str(d.id),
    title: str(d.title),
    root_causes: str(d.root_causes) || undefined,
    recommended_actions: str(d.recommended_actions) || undefined,
    assigned_owner_id: str(d.assigned_owner_id) || null,
    assigned_owner_name: str(d.assigned_owner_name) || undefined,
    success_criteria: str(d.success_criteria) || undefined,
    expected_outcomes: str(d.expected_outcomes) || undefined,
    lessons_applied_elsewhere: str(d.lessons_applied_elsewhere) || undefined,
    notes: str(d.notes) || undefined,
    created_at: str(d.created_at),
  };
}

function parseRecs(raw: unknown): LearningRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), record_id: str(row.record_id) || undefined };
  });
}

function parseThemes(raw: unknown): RecurringTheme[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((t) => {
    const row = t as Record<string, unknown>;
    return { theme_key: str(row.theme_key), count: typeof row.count === "number" ? row.count : 0, label: str(row.label) };
  });
}

function parsePatterns(raw: unknown): PatternInsight[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((p) => {
    const row = p as Record<string, unknown>;
    return { key: str(row.key), active: row.active === true };
  });
}

function parseDashboard(raw: unknown): LearningDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    recently_identified: Array.isArray(d.recently_identified) ? d.recently_identified.map(parseRecord) : [],
    implemented: typeof d.implemented === "number" ? d.implemented : 0,
    awaiting_review: typeof d.awaiting_review === "number" ? d.awaiting_review : 0,
    high_impact: typeof d.high_impact === "number" ? d.high_impact : 0,
    recurring_themes: parseThemes(d.recurring_themes),
    recently_archived: Array.isArray(d.recently_archived) ? d.recently_archived.map(parseRecord) : [],
  };
}

export function parseLearningList(data: unknown): LearningListResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    can_contribute: d.can_contribute === true,
    items: Array.isArray(d.items) ? d.items.map(parseRecord) : [],
    dashboard: parseDashboard(d.dashboard),
    pattern_insights: parsePatterns(d.pattern_insights),
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseLearningDetail(data: unknown): LearningDetail {
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
    record: d.record ? parseRecord(d.record) : undefined,
    actions: Array.isArray(d.actions) ? d.actions.map(parseAction) : [],
    related_follow_ups: Array.isArray(d.related_follow_ups) ? d.related_follow_ups.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    related_decisions: Array.isArray(d.related_decisions) ? d.related_decisions.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    activity_timeline: audit,
    audit_history: audit,
    recommendations: parseRecs(d.recommendations),
  };
}

export function parseLearningRecordItem(data: unknown): LearningRecordItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.record) return parseRecord(d.record);
  return parseRecord(d);
}
