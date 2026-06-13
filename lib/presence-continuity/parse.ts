import type { PresenceContinuityCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseSummary(raw: unknown): PresenceContinuityCenter["since_last_session"] {
  if (!raw || typeof raw !== "object") return null;
  const row = asRecord(raw);
  const items = Array.isArray(row.summary_items)
    ? row.summary_items.map((item) => {
        const i = asRecord(item);
        return {
          label: String(i.label ?? i.text ?? ""),
          value: i.value != null ? (i.value as string | number) : undefined,
        };
      })
    : [];
  return {
    session_key: String(row.session_key ?? ""),
    display_mode: String(row.display_mode ?? "standard"),
    summary_items: items,
    completed_actions: row.completed_actions != null ? Number(row.completed_actions) : null,
    pending_approvals: row.pending_approvals != null ? Number(row.pending_approvals) : null,
    emerging_risks: row.emerging_risks != null ? Number(row.emerging_risks) : null,
    greeting: row.greeting ? String(row.greeting) : null,
  };
}

export function parsePresenceContinuityCenter(raw: unknown): PresenceContinuityCenter {
  const row = asRecord(raw);
  const settingsRaw = asRecord(row.settings);

  const settings =
    Object.keys(settingsRaw).length > 0
      ? {
          presence_state: String(settingsRaw.presence_state ?? "available"),
          greeting_style: String(settingsRaw.greeting_style ?? "warm"),
          briefing_frequency: String(settingsRaw.briefing_frequency ?? "on_return"),
          presence_level: String(settingsRaw.presence_level ?? "standard"),
          focus_mode_behavior: String(settingsRaw.focus_mode_behavior ?? "reduce_interruptions"),
          since_last_session_detail: String(settingsRaw.since_last_session_detail ?? "standard"),
          notification_channels: settingsRaw.notification_channels ?? null,
        }
      : null;

  return {
    settings,
    presence_status: String(row.presence_status ?? row.presence_state ?? "available"),
    continuity_context: Array.isArray(row.continuity_context)
      ? row.continuity_context.map((c) => {
          const item = asRecord(c);
          return {
            context_key: String(item.context_key ?? ""),
            context_type: String(item.context_type ?? ""),
            title: String(item.title ?? ""),
            status: String(item.status ?? "active"),
            last_activity_at: item.last_activity_at ? String(item.last_activity_at) : null,
          };
        })
      : [],
    resume_experience: parseSummary(row.resume_experience),
    since_last_session: parseSummary(row.since_last_session),
    pending_priorities: Array.isArray(row.pending_priorities)
      ? row.pending_priorities.map((p) => {
          const item = asRecord(p);
          return {
            key: String(item.key ?? item.context_key ?? ""),
            title: String(item.title ?? ""),
            urgency: String(item.urgency ?? "standard"),
          };
        })
      : [],
    active_initiatives: Array.isArray(row.active_initiatives)
      ? row.active_initiatives.map((c) => {
          const item = asRecord(c);
          return {
            context_key: String(item.context_key ?? ""),
            context_type: String(item.context_type ?? "initiative"),
            title: String(item.title ?? ""),
            status: String(item.status ?? "active"),
            last_activity_at: item.last_activity_at ? String(item.last_activity_at) : null,
          };
        })
      : [],
    presence_insights: Array.isArray(row.presence_insights)
      ? row.presence_insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            insight_type: String(item.insight_type ?? ""),
            status: String(item.status ?? "active"),
          };
        })
      : [],
    executive_widgets: row.executive_widgets ? asRecord(row.executive_widgets) : null,
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
