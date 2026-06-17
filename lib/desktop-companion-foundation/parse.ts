import type {
  DesktopCompanionBriefing,
  DesktopCompanionHome,
  DesktopCompanionNotifications,
  DesktopCompanionProfilePayload,
  DesktopCompanionSearch,
  DesktopCompanionTasks,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseDesktopCompanionProfile(data: unknown): DesktopCompanionProfilePayload {
  const row = asRecord(data);
  return {
    has_customer: Boolean(row.has_customer),
    positioning: String(row.positioning ?? ""),
    profile: row.profile as DesktopCompanionProfilePayload["profile"],
    preferences: asRecord(row.preferences),
    notification_settings: asRecord(row.notification_settings),
    state: row.state as DesktopCompanionProfilePayload["state"],
    permissions: Array.isArray(row.permissions)
      ? (row.permissions as DesktopCompanionProfilePayload["permissions"])
      : [],
    privacy_note: String(row.privacy_note ?? ""),
  };
}

export function parseDesktopCompanionBriefing(data: unknown): DesktopCompanionBriefing {
  const row = asRecord(data);
  return {
    has_customer: Boolean(row.has_customer),
    greeting: String(row.greeting ?? ""),
    headline: String(row.headline ?? ""),
    summary: String(row.summary ?? ""),
    bullets: Array.isArray(row.bullets) ? row.bullets : [],
    calendar_hints: Array.isArray(row.calendar_hints) ? row.calendar_hints : [],
    likely_next_task: String(row.likely_next_task ?? ""),
    recent_work_summary: String(row.recent_work_summary ?? ""),
  };
}

export function parseDesktopCompanionTasks(data: unknown): DesktopCompanionTasks {
  const row = asRecord(data);
  const items = Array.isArray(row.items) ? row.items : [];
  return {
    has_customer: Boolean(row.has_customer),
    items: items as DesktopCompanionTasks["items"],
    reminders: Array.isArray(row.reminders) ? (row.reminders as DesktopCompanionTasks["items"]) : [],
    context_tasks: Array.isArray(row.context_tasks) ? row.context_tasks : [],
  };
}

export function parseDesktopCompanionNotifications(data: unknown): DesktopCompanionNotifications {
  const row = asRecord(data);
  return {
    has_customer: Boolean(row.has_customer),
    items: Array.isArray(row.items)
      ? (row.items as DesktopCompanionNotifications["items"])
      : [],
  };
}

export function parseDesktopCompanionHome(data: unknown): DesktopCompanionHome {
  const row = asRecord(data);
  return {
    has_customer: Boolean(row.has_customer),
    greeting: String(row.greeting ?? ""),
    todays_focus: String(row.todays_focus ?? ""),
    profile: row.profile ? parseDesktopCompanionProfile(row.profile) : undefined,
    daily_briefing: row.daily_briefing
      ? parseDesktopCompanionBriefing(row.daily_briefing)
      : undefined,
    tasks: row.tasks ? parseDesktopCompanionTasks(row.tasks) : undefined,
    calendar: Array.isArray(row.calendar) ? row.calendar : [],
    companion_insights: asRecord(row.companion_insights),
    recommended_actions: Array.isArray(row.recommended_actions) ? row.recommended_actions : [],
    recent_activity: Array.isArray(row.recent_activity)
      ? (row.recent_activity as DesktopCompanionHome["recent_activity"])
      : [],
    quick_actions: Array.isArray(row.quick_actions)
      ? (row.quick_actions as DesktopCompanionHome["quick_actions"])
      : [],
    notifications: row.notifications
      ? parseDesktopCompanionNotifications(row.notifications)
      : undefined,
    positioning: String(row.positioning ?? ""),
  };
}

export function parseDesktopCompanionSearch(data: unknown): DesktopCompanionSearch {
  const row = asRecord(data);
  return {
    has_customer: Boolean(row.has_customer),
    query: String(row.query ?? ""),
    results: Array.isArray(row.results)
      ? (row.results as DesktopCompanionSearch["results"])
      : [],
  };
}
