import {
  FOCUS_TRENDS,
  NOTE_TYPES,
  REMINDER_TYPES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "./constants";
import type {
  WorkspaceAuditEntry,
  WorkspaceFilters,
  WorkspaceInsights,
  WorkspaceMeeting,
  WorkspaceMyDay,
  WorkspaceNote,
  WorkspaceOverview,
  WorkspaceProductivityHub,
  WorkspaceReminder,
  WorkspaceSuggestion,
  WorkspaceTask,
} from "./types";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const str = asString(value, fallback);
  return (allowed.includes(str as T) ? str : fallback) as T;
}

function parseOverview(raw: unknown): WorkspaceOverview {
  const row = asRecord(raw) ?? {};
  return {
    my_tasks: asNumber(row.my_tasks),
    today_priorities: asNumber(row.today_priorities),
    upcoming_reminders: asNumber(row.upcoming_reminders),
    pending_approvals: asNumber(row.pending_approvals),
    suggested_actions: asNumber(row.suggested_actions),
    completed_this_week: asNumber(row.completed_this_week),
  };
}

function parseTask(raw: unknown): WorkspaceTask | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    title: asString(row.title),
    description: asString(row.description),
    due_date: row.due_date ? asString(row.due_date) : null,
    priority: parseEnum(row.priority, TASK_PRIORITIES, "medium"),
    status: parseEnum(row.status, TASK_STATUSES, "not_started"),
    category: asString(row.category, "general"),
    assignee_user_id: row.assignee_user_id ? asString(row.assignee_user_id) : null,
    assignee_label: asString(row.assignee_label),
    completed_at: row.completed_at ? asString(row.completed_at) : null,
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
}

function parseReminder(raw: unknown): WorkspaceReminder | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    title: asString(row.title),
    reminder_type: parseEnum(row.reminder_type, REMINDER_TYPES, "one_time"),
    due_at: asString(row.due_at),
    recurrence_rule: row.recurrence_rule ? asString(row.recurrence_rule) : null,
    linked_task_id: row.linked_task_id ? asString(row.linked_task_id) : null,
    dismissed_at: row.dismissed_at ? asString(row.dismissed_at) : null,
    created_at: asString(row.created_at),
  };
}

function parseNote(raw: unknown): WorkspaceNote | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    title: asString(row.title),
    body: asString(row.body),
    note_type: parseEnum(row.note_type, NOTE_TYPES, "personal"),
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
}

function parseMeeting(raw: unknown): WorkspaceMeeting | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    title: asString(row.title),
    starts_at: asString(row.starts_at),
    ends_at: row.ends_at ? asString(row.ends_at) : null,
    calendar_purpose: asString(row.calendar_purpose),
  };
}

function parseMyDay(raw: unknown): WorkspaceMyDay {
  const row = asRecord(raw) ?? {};
  return {
    tasks: Array.isArray(row.tasks)
      ? row.tasks.map(parseTask).filter((t): t is WorkspaceTask => t != null)
      : [],
    meetings: Array.isArray(row.meetings)
      ? row.meetings.map(parseMeeting).filter((m): m is WorkspaceMeeting => m != null)
      : [],
    reminders: Array.isArray(row.reminders)
      ? row.reminders.map(parseReminder).filter((r): r is WorkspaceReminder => r != null)
      : [],
    focus_areas: Array.isArray(row.focus_areas)
      ? row.focus_areas.map((item) => {
          const area = asRecord(item) ?? {};
          return { key: asString(area.key), label: asString(area.label) };
        })
      : [],
  };
}

function parseInsights(raw: unknown): WorkspaceInsights {
  const row = asRecord(raw) ?? {};
  return {
    completed_this_week: asNumber(row.completed_this_week),
    average_completion_hours: asNumber(row.average_completion_hours),
    overdue_items: asNumber(row.overdue_items),
    focus_trend: parseEnum(row.focus_trend, FOCUS_TRENDS, "building"),
  };
}

function parseSuggestion(raw: unknown): WorkspaceSuggestion | null {
  const row = asRecord(raw);
  if (!row || !row.key) return null;
  return {
    key: asString(row.key),
    message_key: asString(row.message_key, asString(row.key)),
    count: row.count == null ? undefined : asNumber(row.count),
    severity: asString(row.severity, "informational"),
  };
}

function parseAudit(raw: unknown): WorkspaceAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseFilters(raw: unknown): WorkspaceFilters {
  const row = asRecord(raw) ?? {};
  return {
    search: row.search ? asString(row.search) : undefined,
    status: row.status ? parseEnum(row.status, TASK_STATUSES, "not_started") : undefined,
    priority: row.priority ? parseEnum(row.priority, TASK_PRIORITIES, "medium") : undefined,
    category: row.category ? asString(row.category) : undefined,
    due_from: row.due_from ? asString(row.due_from) : undefined,
    due_to: row.due_to ? asString(row.due_to) : undefined,
  };
}

export function parseWorkspaceProductivityHub(raw: unknown): WorkspaceProductivityHub {
  const row = asRecord(raw) ?? {};
  if (!row.has_customer) return { has_customer: false };

  return {
    has_customer: true,
    user_name: asString(row.user_name),
    overview: parseOverview(row.overview),
    my_day: parseMyDay(row.my_day),
    tasks: Array.isArray(row.tasks)
      ? row.tasks.map(parseTask).filter((t): t is WorkspaceTask => t != null)
      : [],
    reminders: Array.isArray(row.reminders)
      ? row.reminders.map(parseReminder).filter((r): r is WorkspaceReminder => r != null)
      : [],
    notes: Array.isArray(row.notes)
      ? row.notes.map(parseNote).filter((n): n is WorkspaceNote => n != null)
      : [],
    insights: parseInsights(row.insights),
    suggestions: Array.isArray(row.suggestions)
      ? row.suggestions.map(parseSuggestion).filter((s): s is WorkspaceSuggestion => s != null)
      : [],
    audit: Array.isArray(row.audit)
      ? row.audit.map(parseAudit).filter((a): a is WorkspaceAuditEntry => a != null)
      : [],
    filters: parseFilters(row.filters),
    principle: asString(row.principle),
  };
}

export function buildWorkspaceFilterQuery(filters: WorkspaceFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.category) params.set("category", filters.category);
  if (filters.due_from) params.set("due_from", filters.due_from);
  if (filters.due_to) params.set("due_to", filters.due_to);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
