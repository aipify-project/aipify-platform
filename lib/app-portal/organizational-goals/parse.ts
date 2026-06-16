import type {
  GoalAuditEntry,
  GoalDetail,
  GoalItem,
  GoalListResponse,
  GoalPriority,
  GoalProgressEntry,
  GoalRecommendation,
  GoalRelatedLink,
  GoalStatus,
  GoalType,
  GoalsDashboard,
  ProgressUpdateType,
} from "./types";

const TYPES = new Set<GoalType>([
  "strategic", "operational", "customer_experience", "employee_experience",
  "revenue", "security", "growth", "innovation", "compliance",
]);
const STATUSES = new Set<GoalStatus>(["draft", "active", "at_risk", "on_track", "achieved", "cancelled"]);
const PRIOS = new Set<GoalPriority>(["low", "medium", "high", "critical"]);
const UPDATES = new Set<ProgressUpdateType>([
  "milestone_achieved", "progress_change", "challenge", "lesson_learned", "support_needed",
]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)) : [];
}

function parseGoal(raw: unknown): GoalItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const gt = str(d.goal_type, "operational") as GoalType;
  const st = str(d.status, "draft") as GoalStatus;
  const pr = str(d.priority, "medium") as GoalPriority;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description_full) || str(d.description),
    description_full: str(d.description_full) || undefined,
    goal_type: TYPES.has(gt) ? gt : "operational",
    owner_id: str(d.owner_id) || undefined,
    owner_name: str(d.owner_name, "Unassigned"),
    contributor_ids: strArray(d.contributor_ids),
    status: STATUSES.has(st) ? st : "draft",
    priority: PRIOS.has(pr) ? pr : "medium",
    start_date: str(d.start_date) || null,
    target_date: str(d.target_date) || null,
    success_criteria: str(d.success_criteria_full) || str(d.success_criteria),
    success_criteria_full: str(d.success_criteria_full) || undefined,
    progress_percent: num(d.progress_percent),
    related_business_packs: strArray(d.related_business_packs),
    related_initiatives: strArray(d.related_initiatives),
    related_follow_up_ids: strArray(d.related_follow_up_ids),
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseRecs(raw: unknown): GoalRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), goal_id: str(row.goal_id) || undefined };
  });
}

function parseDashboard(raw: unknown): GoalsDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    active_goals: num(d.active_goals),
    achieved_this_quarter: num(d.achieved_this_quarter),
    requiring_attention: num(d.requiring_attention),
    upcoming_target_dates: Array.isArray(d.upcoming_target_dates)
      ? d.upcoming_target_dates.map((u) => {
          const row = u as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), target_date: str(row.target_date) || undefined, status: str(row.status) };
        })
      : [],
  };
}

function parseAudit(raw: unknown): GoalAuditEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((t) => {
    const row = t as Record<string, unknown>;
    return { id: str(row.id), event_type: str(row.event_type), description: str(row.description), created_at: str(row.created_at), performed_by: str(row.performed_by) };
  });
}

function parseRelated(raw: unknown): GoalRelatedLink[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), title: str(row.title), status: str(row.status) };
  });
}

function parseProgress(raw: unknown): GoalProgressEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((p) => {
    const row = p as Record<string, unknown>;
    const ut = str(row.update_type, "progress_change") as ProgressUpdateType;
    return {
      id: str(row.id),
      update_type: UPDATES.has(ut) ? ut : "progress_change",
      progress_percent: typeof row.progress_percent === "number" ? row.progress_percent : null,
      milestone_title: str(row.milestone_title) || null,
      notes: str(row.notes),
      created_at: str(row.created_at),
      created_by: str(row.created_by),
    };
  });
}

export function parseGoalList(data: unknown): GoalListResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map(parseGoal) : [],
    dashboard: parseDashboard(d.dashboard),
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseGoalDetail(data: unknown): GoalDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  return {
    found: true,
    can_manage: d.can_manage === true,
    goal: d.goal ? parseGoal(d.goal) : undefined,
    contributors: Array.isArray(d.contributors)
      ? d.contributors.map((c) => {
          const row = c as Record<string, unknown>;
          return { user_id: str(row.user_id), name: str(row.name) };
        })
      : [],
    progress_timeline: parseProgress(d.progress_timeline),
    related_follow_ups: parseRelated(d.related_follow_ups),
    related_decisions: parseRelated(d.related_decisions),
    related_actions: parseRelated(d.related_actions),
    activity_history: parseAudit(d.activity_history),
    audit_history: parseAudit(d.audit_history),
    recommendations: parseRecs(d.recommendations),
  };
}

export function parseGoalItem(data: unknown): GoalItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.goal) return parseGoal(d.goal);
  return parseGoal(d);
}
