import type {
  ActionPriority,
  ActionStatus,
  MeetingActionItem,
  MeetingDecision,
  MeetingDetail,
  MeetingItem,
  MeetingListResponse,
  MeetingRecommendation,
  MeetingStatus,
  MeetingType,
  MeetingsDashboard,
} from "./types";

const TYPES = new Set<MeetingType>([
  "executive_meeting", "team_meeting", "project_meeting", "customer_meeting", "vendor_meeting",
  "retrospective", "planning_session", "incident_review", "compliance_review", "custom_meeting",
]);
const STATUSES = new Set<MeetingStatus>(["scheduled", "in_progress", "completed", "cancelled"]);
const ACTION_STATUSES = new Set<ActionStatus>(["open", "in_progress", "waiting", "completed", "cancelled"]);
const PRIORITIES = new Set<ActionPriority>(["low", "medium", "high"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)) : [];
}

function parseMeeting(raw: unknown): MeetingItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const type = str(d.meeting_type, "team_meeting") as MeetingType;
  const status = str(d.status, "scheduled") as MeetingStatus;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description_full) || str(d.description) || undefined,
    description_full: str(d.description_full) || undefined,
    meeting_type: TYPES.has(type) ? type : "team_meeting",
    organizer_id: str(d.organizer_id) || null,
    organizer_name: str(d.organizer_name, "Unassigned"),
    participant_ids: strArray(d.participant_ids),
    meeting_at: str(d.meeting_at),
    duration_minutes: typeof d.duration_minutes === "number" ? d.duration_minutes : 60,
    status: STATUSES.has(status) ? status : "scheduled",
    objectives: str(d.objectives_full) || str(d.objectives) || undefined,
    objectives_full: str(d.objectives_full) || undefined,
    notes: str(d.notes_full) || str(d.notes) || undefined,
    notes_full: str(d.notes_full) || undefined,
    related_modules: strArray(d.related_modules),
    related_goal_ids: strArray(d.related_goal_ids),
    needs_outcomes: d.needs_outcomes === true,
    without_notes: d.without_notes === true,
    open_actions: typeof d.open_actions === "number" ? d.open_actions : 0,
    overdue_actions: typeof d.overdue_actions === "number" ? d.overdue_actions : 0,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseAction(raw: unknown): MeetingActionItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const status = str(d.status, "open") as ActionStatus;
  const priority = str(d.priority, "medium") as ActionPriority;
  return {
    id: str(d.id),
    meeting_id: str(d.meeting_id),
    title: str(d.title),
    description: str(d.description) || undefined,
    owner_id: str(d.owner_id) || null,
    owner_name: str(d.owner_name, "Unassigned"),
    due_date: str(d.due_date) || null,
    priority: PRIORITIES.has(priority) ? priority : "medium",
    status: ACTION_STATUSES.has(status) ? status : "open",
    overdue: d.overdue === true,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseDecision(raw: unknown): MeetingDecision {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: str(d.id),
    meeting_id: str(d.meeting_id),
    title: str(d.title),
    rationale: str(d.rationale) || undefined,
    owner_id: str(d.owner_id) || null,
    owner_name: str(d.owner_name, "Unassigned"),
    related_goal_ids: strArray(d.related_goal_ids),
    related_follow_up_ids: strArray(d.related_follow_up_ids),
    created_at: str(d.created_at),
  };
}

function parseRecs(raw: unknown): MeetingRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), meeting_id: str(row.meeting_id) || undefined };
  });
}

function parseDashboard(raw: unknown): MeetingsDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    upcoming: typeof d.upcoming === "number" ? d.upcoming : 0,
    needs_outcomes: typeof d.needs_outcomes === "number" ? d.needs_outcomes : 0,
    outstanding_actions: typeof d.outstanding_actions === "number" ? d.outstanding_actions : 0,
    recently_completed: Array.isArray(d.recently_completed) ? d.recently_completed.map(parseMeeting) : [],
    without_notes: typeof d.without_notes === "number" ? d.without_notes : 0,
    overdue_actions: typeof d.overdue_actions === "number" ? d.overdue_actions : 0,
  };
}

export function parseMeetingList(data: unknown): MeetingListResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map(parseMeeting) : [],
    dashboard: parseDashboard(d.dashboard),
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseMeetingDetail(data: unknown): MeetingDetail {
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
    meeting: d.meeting ? parseMeeting(d.meeting) : undefined,
    participants: Array.isArray(d.participants)
      ? d.participants.map((p) => {
          const row = p as Record<string, unknown>;
          return { user_id: str(row.user_id), name: str(row.name) };
        })
      : [],
    action_items: Array.isArray(d.action_items) ? d.action_items.map(parseAction) : [],
    decisions: Array.isArray(d.decisions) ? d.decisions.map(parseDecision) : [],
    related_goals: Array.isArray(d.related_goals)
      ? d.related_goals.map((g) => {
          const row = g as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [],
    related_follow_ups: Array.isArray(d.related_follow_ups)
      ? d.related_follow_ups.map((f) => {
          const row = f as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [],
    activity_timeline: audit,
    audit_history: audit,
    recommendations: parseRecs(d.recommendations),
  };
}

export function parseMeetingItem(data: unknown): MeetingItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.meeting) return parseMeeting(d.meeting);
  return parseMeeting(d);
}

export function parseMeetingActionItem(data: unknown): MeetingActionItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.action) return parseAction(d.action);
  return parseAction(d);
}

export function parseMeetingDecisionItem(data: unknown): MeetingDecision | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.decision) return parseDecision(d.decision);
  return parseDecision(d);
}
