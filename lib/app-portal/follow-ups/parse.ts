import type {
  FollowUpCategory,
  FollowUpDetail,
  FollowUpItem,
  FollowUpListResponse,
  FollowUpPriority,
  FollowUpStatus,
  FollowUpSuggestion,
} from "./types";

const CATS = new Set<FollowUpCategory>([
  "customer_follow_up", "internal_follow_up", "pending_decision",
  "waiting_external", "strategic_reminder", "overdue_commitment",
]);
const STATUSES = new Set<FollowUpStatus>([
  "open", "in_progress", "waiting", "completed", "cancelled", "escalated",
]);
const PRIOS = new Set<FollowUpPriority>(["low", "medium", "high", "critical"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function parseItem(raw: unknown): FollowUpItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const cat = str(d.category, "internal_follow_up") as FollowUpCategory;
  const st = str(d.status, "open") as FollowUpStatus;
  const pr = str(d.priority, "medium") as FollowUpPriority;
  return {
    id: str(d.id),
    title: str(d.title),
    category: CATS.has(cat) ? cat : "internal_follow_up",
    assigned_owner_id: str(d.assigned_owner_id) || undefined,
    assigned_owner: str(d.assigned_owner, "Unassigned"),
    created_at: str(d.created_at),
    due_at: str(d.due_at) || undefined,
    status: STATUSES.has(st) ? st : "open",
    priority: PRIOS.has(pr) ? pr : "medium",
    related_module: str(d.related_module) || undefined,
    suggested_next_action: str(d.suggested_next_action) || undefined,
    notes: str(d.notes) || undefined,
    is_suggestion: d.is_suggestion === true,
    is_overdue: d.is_overdue === true,
    days_open: typeof d.days_open === "number" ? d.days_open : undefined,
    updated_at: str(d.updated_at) || undefined,
    completed_at: str(d.completed_at) || undefined,
  };
}

function parseSuggestion(raw: unknown): FollowUpSuggestion {
  const d = (raw ?? {}) as Record<string, unknown>;
  const cat = str(d.category, "internal_follow_up") as FollowUpCategory;
  const pr = str(d.priority, "medium") as FollowUpPriority;
  return {
    id: str(d.id),
    title: str(d.title),
    category: CATS.has(cat) ? cat : "internal_follow_up",
    priority: PRIOS.has(pr) ? pr : "medium",
    suggested_next_action: str(d.suggested_next_action),
    related_module: str(d.related_module) || undefined,
    requires_review: d.requires_review !== false,
  };
}

export function parseFollowUpList(data: unknown): FollowUpListResponse {
  if (!data || typeof data !== "object") {
    return { found: false, items: [], suggestions: [], smart_reminders: [], categories: [] };
  }
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    items: Array.isArray(d.items) ? d.items.map(parseItem) : [],
    suggestions: Array.isArray(d.suggestions) ? d.suggestions.map(parseSuggestion) : [],
    smart_reminders: Array.isArray(d.smart_reminders)
      ? d.smart_reminders.map((r) => {
          const row = r as Record<string, unknown>;
          return { message: str(row.message), follow_up_id: row.follow_up_id as string | null, title: str(row.title) };
        })
      : [],
    categories: Array.isArray(d.categories)
      ? d.categories.map((c) => {
          const row = c as Record<string, unknown>;
          const key = str(row.key) as FollowUpCategory;
          return { key: CATS.has(key) ? key : "internal_follow_up", count: typeof row.count === "number" ? row.count : 0 };
        })
      : [],
    principle: str(d.principle),
  };
}

export function parseFollowUpDetail(data: unknown): FollowUpDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  const fu = d.follow_up ? parseItem(d.follow_up) : undefined;
  return {
    found: true,
    follow_up: fu,
    assigned_users: Array.isArray(d.assigned_users)
      ? d.assigned_users.map((u) => {
          const row = u as Record<string, unknown>;
          return { id: str(row.id), name: str(row.name) };
        })
      : [],
    timeline: Array.isArray(d.timeline)
      ? d.timeline.map((t) => {
          const row = t as Record<string, unknown>;
          return {
            id: str(row.id),
            event_type: str(row.event_type),
            description: str(row.description),
            created_at: str(row.created_at),
            performed_by: str(row.performed_by),
          };
        })
      : [],
    status_history: Array.isArray(d.status_history)
      ? d.status_history.map((s) => {
          const row = s as Record<string, unknown>;
          return { status: str(row.status), at: str(row.at), description: str(row.description) || undefined };
        })
      : [],
    recommended_actions: Array.isArray(d.recommended_actions) ? d.recommended_actions.map((a) => str(a)).filter(Boolean) : [],
    audit_history: Array.isArray(d.audit_history)
      ? d.audit_history.map((t) => {
          const row = t as Record<string, unknown>;
          return {
            id: str(row.id),
            event_type: str(row.event_type),
            description: str(row.description),
            created_at: str(row.created_at),
            performed_by: str(row.performed_by),
          };
        })
      : [],
  };
}

export function parseFollowUpItem(data: unknown): FollowUpItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.follow_up) return parseItem(d.follow_up);
  return parseItem(d);
}
