import type {
  StrategyCategory,
  StrategyDashboard,
  StrategyDetail,
  StrategyExecutionInsight,
  StrategyExecutionRecommendation,
  StrategyInitiativeItem,
  StrategyListResponse,
  StrategyMilestone,
  StrategyMilestoneStatus,
  StrategicImportance,
  StrategyStatus,
} from "./types";

const CATEGORIES = new Set<StrategyCategory>([
  "growth_strategy", "customer_strategy", "operational_excellence", "digital_transformation",
  "innovation_strategy", "employee_strategy", "financial_strategy", "risk_strategy",
  "sustainability_strategy", "custom_strategic_theme",
]);
const STATUSES = new Set<StrategyStatus>([
  "planning", "active", "on_track", "needs_attention", "delayed", "completed", "archived",
]);
const IMPORTANCE = new Set<StrategicImportance>([
  "important", "high_priority", "critical_priority", "transformational",
]);
const MILESTONE_STATUSES = new Set<StrategyMilestoneStatus>([
  "pending", "in_progress", "completed", "missed", "cancelled",
]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function parseInitiative(raw: unknown): StrategyInitiativeItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const cat = str(d.category, "growth_strategy") as StrategyCategory;
  const status = str(d.status, "planning") as StrategyStatus;
  const imp = str(d.strategic_importance, "important") as StrategicImportance;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description_full) || str(d.description) || undefined,
    description_full: str(d.description_full) || undefined,
    category: CATEGORIES.has(cat) ? cat : "growth_strategy",
    executive_sponsor_id: str(d.executive_sponsor_id) || null,
    executive_sponsor_name: str(d.executive_sponsor_name, "Unassigned"),
    initiative_owner_id: str(d.initiative_owner_id) || null,
    initiative_owner_name: str(d.initiative_owner_name, "Unassigned"),
    contributor_ids: Array.isArray(d.contributor_ids) ? d.contributor_ids.map(String) : [],
    status: STATUSES.has(status) ? status : "planning",
    strategic_importance: IMPORTANCE.has(imp) ? imp : "important",
    start_date: str(d.start_date) || null,
    target_date: str(d.target_date) || null,
    success_definition: str(d.success_definition_full) || str(d.success_definition) || undefined,
    success_definition_full: str(d.success_definition_full) || undefined,
    progress_percent: typeof d.progress_percent === "number" ? d.progress_percent : 0,
    needs_attention: d.needs_attention === true,
    notes: str(d.notes_full) || str(d.notes) || undefined,
    notes_full: str(d.notes_full) || undefined,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseMilestone(raw: unknown): StrategyMilestone {
  const d = (raw ?? {}) as Record<string, unknown>;
  const status = str(d.status, "pending") as StrategyMilestoneStatus;
  return {
    id: str(d.id),
    initiative_id: str(d.initiative_id),
    title: str(d.title),
    owner_id: str(d.owner_id) || null,
    owner_name: str(d.owner_name, "Unassigned"),
    target_date: str(d.target_date) || null,
    completion_date: str(d.completion_date) || null,
    status: MILESTONE_STATUSES.has(status) ? status : "pending",
    notes: str(d.notes) || undefined,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseRecs(raw: unknown): StrategyExecutionRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), initiative_id: str(row.initiative_id) || undefined };
  });
}

function parseInsights(raw: unknown): StrategyExecutionInsight[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: str(row.id),
      key: str(row.key),
      count: typeof row.count === "number" ? row.count : undefined,
      priority: str(row.priority) || undefined,
    };
  });
}

function parseDashboard(raw: unknown): StrategyDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    active: typeof d.active === "number" ? d.active : 0,
    requiring_attention: Array.isArray(d.requiring_attention) ? d.requiring_attention.map(parseInitiative) : [],
    progress_overview: typeof d.progress_overview === "number" ? d.progress_overview : 0,
    upcoming_milestones: Array.isArray(d.upcoming_milestones) ? d.upcoming_milestones.map(parseMilestone) : [],
    recently_completed: Array.isArray(d.recently_completed) ? d.recently_completed.map(parseInitiative) : [],
    execution_trends: Array.isArray(d.execution_trends) ? d.execution_trends.map(parseInitiative) : [],
  };
}

export function parseStrategyList(data: unknown): StrategyListResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map(parseInitiative) : [],
    dashboard: parseDashboard(d.dashboard),
    execution_insights: parseInsights(d.execution_insights),
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseStrategyDetail(data: unknown): StrategyDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  const audit = Array.isArray(d.audit_history)
    ? d.audit_history.map((a) => {
        const row = a as Record<string, unknown>;
        return { id: str(row.id), event_type: str(row.event_type), description: str(row.description), created_at: str(row.created_at), performed_by: str(row.performed_by) };
      })
    : [];
  const milestones = Array.isArray(d.milestones) ? d.milestones.map(parseMilestone) : [];
  return {
    found: true,
    can_manage: d.can_manage === true,
    initiative: d.initiative ? parseInitiative(d.initiative) : undefined,
    milestones,
    related_goals: Array.isArray(d.related_goals) ? d.related_goals.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    related_decisions: Array.isArray(d.related_decisions) ? d.related_decisions.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    related_follow_ups: Array.isArray(d.related_follow_ups) ? d.related_follow_ups.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    related_risks: Array.isArray(d.related_risks) ? d.related_risks.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    milestone_timeline: Array.isArray(d.milestone_timeline) ? d.milestone_timeline.map(parseMilestone) : milestones,
    audit_history: audit,
    execution_insights: parseInsights(d.execution_insights),
    recommendations: parseRecs(d.recommendations),
  };
}

export function parseStrategyInitiativeItem(data: unknown): StrategyInitiativeItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.initiative) return parseInitiative(d.initiative);
  return parseInitiative(d);
}

export function parseStrategyMilestone(data: unknown): StrategyMilestone | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.milestone) return parseMilestone(d.milestone);
  return parseMilestone(d);
}
