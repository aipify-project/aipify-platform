import type { CalendarCenterBundle, ContextCenterBundle } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function parseContextCenter(data: unknown): ContextCenterBundle {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }
  const d = data as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    user_name: typeof d.user_name === "string" ? d.user_name : undefined,
    settings: d.settings as ContextCenterBundle["settings"],
    connected_calendars: asArray(d.connected_calendars),
    upcoming_events: asArray(d.upcoming_events),
    priority_tasks: asArray(d.priority_tasks),
    daily_briefing: (d.daily_briefing as ContextCenterBundle["daily_briefing"]) ?? null,
    evening_review: (d.evening_review as ContextCenterBundle["evening_review"]) ?? null,
    analysis: d.analysis as ContextCenterBundle["analysis"],
    conflicts: asArray(d.conflicts),
    cognitive_load: d.cognitive_load as ContextCenterBundle["cognitive_load"],
    suggested_actions: asArray(d.suggested_actions),
    proactive_assistance: asArray(d.proactive_assistance),
    workload: d.workload as ContextCenterBundle["workload"],
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    context_sources: d.context_sources as Record<string, string>,
  };
}

export function parseCalendarCenter(data: unknown): CalendarCenterBundle {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }
  const d = data as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    supported_providers: asArray<string>(d.supported_providers),
    connections: asArray(d.connections),
    recent_events: asArray(d.recent_events),
    sync_history: asArray(d.sync_history),
    purposes_by_connection: (d.purposes_by_connection as Record<string, string>) ?? {},
  };
}
