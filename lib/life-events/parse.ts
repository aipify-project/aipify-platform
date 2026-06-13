import type { LifeEventsCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseLifeEventsCenter(raw: unknown): LifeEventsCenter {
  const row = asRecord(raw);

  const settingsRaw = asRecord(row.settings);
  const settings =
    Object.keys(settingsRaw).length > 0
      ? {
          enabled_categories: Array.isArray(settingsRaw.enabled_categories)
            ? settingsRaw.enabled_categories.map(String)
            : [],
          proactivity_level: String(settingsRaw.proactivity_level ?? "moderate"),
          suggest_actions_allowed: Boolean(settingsRaw.suggest_actions_allowed ?? true),
          execute_actions_allowed: Boolean(settingsRaw.execute_actions_allowed ?? false),
          reminder_timing_default: String(settingsRaw.reminder_timing_default ?? "3_days_before"),
          opt_out_all: Boolean(settingsRaw.opt_out_all ?? false),
        }
      : null;

  return {
    settings,
    upcoming_events: Array.isArray(row.upcoming_events)
      ? row.upcoming_events.map((e) => {
          const item = asRecord(e);
          return {
            event_key: String(item.event_key ?? ""),
            title: String(item.title ?? ""),
            category: String(item.category ?? ""),
            event_date: String(item.event_date ?? ""),
            importance_level: String(item.importance_level ?? "important"),
            status: String(item.status ?? "upcoming"),
            days_until: item.days_until != null ? Number(item.days_until) : null,
            requires_preparation: Boolean(item.requires_preparation),
          };
        })
      : [],
    suggested_actions: Array.isArray(row.suggested_actions)
      ? row.suggested_actions.map((a) => {
          const item = asRecord(a);
          return {
            action_key: String(item.action_key ?? ""),
            event_key: String(item.event_key ?? ""),
            action_type: String(item.action_type ?? ""),
            message: String(item.message ?? ""),
            status: String(item.status ?? "suggested"),
            requires_approval: Boolean(item.requires_approval ?? true),
          };
        })
      : [],
    preparation_needed: Array.isArray(row.preparation_needed)
      ? row.preparation_needed.map((e) => {
          const item = asRecord(e);
          return {
            event_key: String(item.event_key ?? ""),
            title: String(item.title ?? ""),
            category: String(item.category ?? ""),
            event_date: String(item.event_date ?? ""),
            importance_level: String(item.importance_level ?? "important"),
            status: String(item.status ?? "upcoming"),
            days_until: item.days_until != null ? Number(item.days_until) : null,
            requires_preparation: true,
          };
        })
      : [],
    recently_completed: Array.isArray(row.recently_completed)
      ? row.recently_completed.map((a) => {
          const item = asRecord(a);
          return {
            action_key: String(item.action_key ?? ""),
            event_key: String(item.event_key ?? ""),
            action_type: String(item.action_type ?? ""),
            completed_at: String(item.completed_at ?? ""),
          };
        })
      : [],
    care_insights: Array.isArray(row.care_insights)
      ? row.care_insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            insight_type: String(item.insight_type ?? ""),
            status: String(item.status ?? "active"),
          };
        })
      : [],
    reminders: Array.isArray(row.reminders)
      ? row.reminders.map((r) => {
          const item = asRecord(r);
          return {
            reminder_key: String(item.reminder_key ?? ""),
            event_key: String(item.event_key ?? ""),
            message: String(item.message ?? ""),
            timing_option: String(item.timing_option ?? ""),
            scheduled_for: String(item.scheduled_for ?? ""),
            status: String(item.status ?? "pending"),
          };
        })
      : [],
    blueprint: row.blueprint ? asRecord(row.blueprint) : null,
    links: row.links
      ? Object.fromEntries(
          Object.entries(asRecord(row.links)).map(([key, value]) => [key, String(value)]),
        )
      : null,
    can_manage: Boolean(row.can_manage),
    can_record: Boolean(row.can_record),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
