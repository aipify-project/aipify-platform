import type { ReviewFrequency } from "../responsibilities/types";
import type {
  ContinuityCategory,
  ContinuityCriticality,
  ContinuityDashboard,
  ContinuityDetail,
  ContinuityExercise,
  ContinuityListResponse,
  ContinuityPlanItem,
  ContinuityRecommendation,
  ContinuityStatus,
  ExerciseType,
} from "./types";

const CATEGORIES = new Set<ContinuityCategory>([
  "business_continuity", "incident_response", "technology_recovery", "workforce_continuity",
  "vendor_continuity", "communications_continuity", "executive_continuity", "operational_recovery",
  "facility_preparedness", "custom_continuity_area",
]);
const STATUSES = new Set<ContinuityStatus>(["draft", "active", "under_review", "testing", "archived"]);
const CRITICALITY = new Set<ContinuityCriticality>(["low", "moderate", "high", "mission_critical"]);
const FREQUENCIES = new Set<ReviewFrequency>(["monthly", "quarterly", "semi_annual", "annual"]);
const EXERCISE_TYPES = new Set<ExerciseType>(["tabletop", "simulation"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)) : [];
}

function parsePlan(raw: unknown): ContinuityPlanItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const cat = str(d.category, "business_continuity") as ContinuityCategory;
  const status = str(d.status, "draft") as ContinuityStatus;
  const crit = str(d.criticality_level, "moderate") as ContinuityCriticality;
  const freq = str(d.review_frequency, "quarterly") as ReviewFrequency;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description_full) || str(d.description) || undefined,
    description_full: str(d.description_full) || undefined,
    category: CATEGORIES.has(cat) ? cat : "business_continuity",
    owner_id: str(d.owner_id) || null,
    owner_name: str(d.owner_name, "Unassigned"),
    backup_owner_id: str(d.backup_owner_id) || null,
    backup_owner_name: str(d.backup_owner_name, "Unassigned"),
    criticality_level: CRITICALITY.has(crit) ? crit : "moderate",
    status: STATUSES.has(status) ? status : "draft",
    review_frequency: FREQUENCIES.has(freq) ? freq : "quarterly",
    last_reviewed_date: str(d.last_reviewed_date) || null,
    next_review_date: str(d.next_review_date) || null,
    needs_review: d.needs_review === true,
    upcoming_exercise_date: str(d.upcoming_exercise_date) || null,
    recovery_objectives: str(d.recovery_objectives) || undefined,
    critical_dependencies: strArray(d.critical_dependencies),
    alternative_procedures: str(d.alternative_procedures) || undefined,
    escalation_paths: str(d.escalation_paths) || undefined,
    minimum_operational_requirements: str(d.minimum_operational_requirements) || undefined,
    notes: str(d.notes_full) || str(d.notes) || undefined,
    notes_full: str(d.notes_full) || undefined,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseExercise(raw: unknown): ContinuityExercise {
  const d = (raw ?? {}) as Record<string, unknown>;
  const type = str(d.exercise_type, "tabletop") as ExerciseType;
  return {
    id: str(d.id),
    title: str(d.title),
    exercise_type: EXERCISE_TYPES.has(type) ? type : "tabletop",
    exercise_date: str(d.exercise_date),
    lessons_learned: str(d.lessons_learned) || undefined,
    improvement_actions: str(d.improvement_actions) || undefined,
    notes: str(d.notes) || undefined,
    created_at: str(d.created_at),
  };
}

function parseRecs(raw: unknown): ContinuityRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), plan_id: str(row.plan_id) || undefined };
  });
}

function parseDashboard(raw: unknown): ContinuityDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    active: typeof d.active === "number" ? d.active : 0,
    needs_review: typeof d.needs_review === "number" ? d.needs_review : 0,
    mission_critical: typeof d.mission_critical === "number" ? d.mission_critical : 0,
    without_owner: typeof d.without_owner === "number" ? d.without_owner : 0,
    upcoming_exercises: typeof d.upcoming_exercises === "number" ? d.upcoming_exercises : 0,
    recently_updated: Array.isArray(d.recently_updated) ? d.recently_updated.map(parsePlan) : [],
  };
}

export function parseContinuityList(data: unknown): ContinuityListResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map(parsePlan) : [],
    dashboard: parseDashboard(d.dashboard),
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseContinuityDetail(data: unknown): ContinuityDetail {
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
    plan: d.plan ? parsePlan(d.plan) : undefined,
    exercises: Array.isArray(d.exercises) ? d.exercises.map(parseExercise) : [],
    related_risks: Array.isArray(d.related_risks) ? d.related_risks.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    related_playbooks: Array.isArray(d.related_playbooks) ? d.related_playbooks.map((p) => { const row = p as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    related_external_relationships: Array.isArray(d.related_external_relationships) ? d.related_external_relationships.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), name: str(row.name), status: str(row.status) }; }) : [],
    activity_timeline: audit,
    audit_history: audit,
    recommendations: parseRecs(d.recommendations),
  };
}

export function parseContinuityPlanItem(data: unknown): ContinuityPlanItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.plan) return parsePlan(d.plan);
  return parsePlan(d);
}
