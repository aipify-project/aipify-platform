import type {
  CommitmentDashboard,
  CommitmentDetail,
  CommitmentItem,
  CommitmentListResponse,
  CommitmentPriority,
  CommitmentProgressRecord,
  CommitmentRecommendation,
  CommitmentStatus,
  CommitmentType,
} from "./types";

const TYPES = new Set<CommitmentType>([
  "customer_commitment", "employee_commitment", "executive_commitment", "team_commitment",
  "vendor_commitment", "regulatory_commitment", "strategic_commitment", "operational_commitment",
  "partnership_commitment", "custom_commitment",
]);
const STATUSES = new Set<CommitmentStatus>([
  "proposed", "accepted", "in_progress", "at_risk", "fulfilled", "cancelled", "archived",
]);
const PRIORITIES = new Set<CommitmentPriority>(["low", "medium", "high", "critical"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function parseItem(raw: unknown): CommitmentItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const type = str(d.commitment_type, "operational_commitment") as CommitmentType;
  const status = str(d.status, "proposed") as CommitmentStatus;
  const priority = str(d.priority, "medium") as CommitmentPriority;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description_full) || str(d.description) || undefined,
    description_full: str(d.description_full) || undefined,
    commitment_type: TYPES.has(type) ? type : "operational_commitment",
    owner_id: str(d.owner_id) || null,
    owner_name: str(d.owner_name, "Unassigned"),
    recipient: str(d.recipient),
    contributor_ids: Array.isArray(d.contributor_ids) ? d.contributor_ids.map(String) : [],
    status: STATUSES.has(status) ? status : "proposed",
    priority: PRIORITIES.has(priority) ? priority : "medium",
    commitment_date: str(d.commitment_date) || null,
    due_date: str(d.due_date) || null,
    fulfillment_criteria: str(d.fulfillment_criteria_full) || str(d.fulfillment_criteria) || undefined,
    fulfillment_criteria_full: str(d.fulfillment_criteria_full) || undefined,
    progress_percent: typeof d.progress_percent === "number" ? d.progress_percent : 0,
    milestones_achieved: str(d.milestones_achieved) || undefined,
    delays_encountered: str(d.delays_encountered) || undefined,
    obstacles_identified: str(d.obstacles_identified) || undefined,
    completion_evidence: str(d.completion_evidence) || undefined,
    lessons_learned: str(d.lessons_learned) || undefined,
    is_overdue: d.is_overdue === true,
    is_at_risk: d.is_at_risk === true,
    notes: str(d.notes_full) || str(d.notes) || undefined,
    notes_full: str(d.notes_full) || undefined,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseRecs(raw: unknown): CommitmentRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), commitment_id: str(row.commitment_id) || undefined };
  });
}

function parseDashboard(raw: unknown): CommitmentDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    active: typeof d.active === "number" ? d.active : 0,
    at_risk: Array.isArray(d.at_risk) ? d.at_risk.map(parseItem) : [],
    recently_fulfilled: Array.isArray(d.recently_fulfilled) ? d.recently_fulfilled.map(parseItem) : [],
    overdue: typeof d.overdue === "number" ? d.overdue : 0,
    high_priority: Array.isArray(d.high_priority) ? d.high_priority.map(parseItem) : [],
    completion_trends: Array.isArray(d.completion_trends) ? d.completion_trends.map(parseItem) : [],
  };
}

export function parseCommitmentList(data: unknown): CommitmentListResponse {
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

export function parseCommitmentDetail(data: unknown): CommitmentDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  const audit = Array.isArray(d.audit_history)
    ? d.audit_history.map((a) => {
        const row = a as Record<string, unknown>;
        return { id: str(row.id), event_type: str(row.event_type), description: str(row.description), created_at: str(row.created_at), performed_by: str(row.performed_by) };
      })
    : [];
  const progress: CommitmentProgressRecord[] = Array.isArray(d.progress_history)
    ? d.progress_history.map((h) => {
        const row = h as Record<string, unknown>;
        return {
          id: str(row.id),
          progress_percent: typeof row.progress_percent === "number" ? row.progress_percent : undefined,
          milestones_achieved: str(row.milestones_achieved) || undefined,
          delays_encountered: str(row.delays_encountered) || undefined,
          obstacles_identified: str(row.obstacles_identified) || undefined,
          progress_update: str(row.progress_update) || undefined,
          completion_evidence: str(row.completion_evidence) || undefined,
          lessons_learned: str(row.lessons_learned) || undefined,
          created_at: str(row.created_at),
          performed_by: str(row.performed_by),
        };
      })
    : [];
  return {
    found: true,
    can_manage: d.can_manage === true,
    commitment: d.commitment ? parseItem(d.commitment) : undefined,
    progress_history: progress,
    related_goals: Array.isArray(d.related_goals) ? d.related_goals.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    related_follow_ups: Array.isArray(d.related_follow_ups) ? d.related_follow_ups.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    related_decisions: Array.isArray(d.related_decisions) ? d.related_decisions.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    related_communications: Array.isArray(d.related_communications) ? d.related_communications.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    activity_timeline: audit,
    audit_history: audit,
    recommendations: parseRecs(d.recommendations),
  };
}

export function parseCommitmentItem(data: unknown): CommitmentItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.commitment) return parseItem(d.commitment);
  return parseItem(d);
}
