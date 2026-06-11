import type {
  DesktopChatMessage,
  DesktopCompanionCard,
  DesktopMode,
  DesktopNotification,
  DesktopPreferences,
  DesktopReminder,
} from "./types";

export function parseDesktopCompanionCard(data: unknown): DesktopCompanionCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: d.enabled as boolean | undefined,
    mode_key: d.mode_key as string | undefined,
    mode_name: d.mode_name as string | undefined,
    unread_count: d.unread_count as number | undefined,
    upcoming_reminders: d.upcoming_reminders as number | undefined,
    notifications: parseDesktopNotifications(d.notifications),
    briefing_summary: d.briefing_summary as string | undefined,
    briefing_greeting: d.briefing_greeting as string | undefined,
    mini_chat_enabled: d.mini_chat_enabled as boolean | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseDesktopNotifications(data: unknown): DesktopNotification[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const n = row as Record<string, unknown>;
    return {
      id: String(n.id),
      title: String(n.title ?? ""),
      body: n.body as string | null | undefined,
      severity: String(n.severity ?? "info"),
      status: n.status as string | undefined,
      source_module: String(n.source_module ?? ""),
      category: n.category as string | undefined,
      action_url: n.action_url as string | null | undefined,
      recommendation: n.recommendation as string | null | undefined,
      explanation: n.explanation as string | null | undefined,
      created_at: String(n.created_at ?? ""),
    };
  });
}

export function parseDesktopReminders(data: unknown): DesktopReminder[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id),
      reminder_type: String(r.reminder_type ?? "personal"),
      title: String(r.title ?? ""),
      body: r.body as string | null | undefined,
      due_at: String(r.due_at ?? ""),
      recurrence_rule: r.recurrence_rule as string | null | undefined,
      status: String(r.status ?? "scheduled"),
      action_url: r.action_url as string | null | undefined,
      created_at: String(r.created_at ?? ""),
    };
  });
}

export function parseDesktopChatHistory(data: unknown): DesktopChatMessage[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const c = row as Record<string, unknown>;
    return {
      id: String(c.id),
      role: (c.role as DesktopChatMessage["role"]) ?? "assistant",
      content: String(c.content ?? ""),
      intent: c.intent as string | null | undefined,
      action_href: c.action_href as string | null | undefined,
      created_at: String(c.created_at ?? ""),
    };
  });
}

export function parseDesktopModes(data: unknown): DesktopMode[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const m = row as Record<string, unknown>;
    return {
      mode_key: String(m.mode_key ?? ""),
      name: String(m.name ?? ""),
      description: String(m.description ?? ""),
      min_severity: String(m.min_severity ?? "medium"),
      include_daily_brief: Boolean(m.include_daily_brief),
      include_mini_chat: Boolean(m.include_mini_chat),
      include_suggestions: Boolean(m.include_suggestions),
      include_reminders: Boolean(m.include_reminders),
    };
  });
}

export function parseDesktopPreferences(data: unknown): DesktopPreferences {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled ?? true),
    mode_key: String(d.mode_key ?? "balanced"),
    focus_categories: Array.isArray(d.focus_categories)
      ? (d.focus_categories as string[])
      : [],
    quiet_hours: (d.quiet_hours as Record<string, unknown>) ?? {},
    timezone: String(d.timezone ?? "Europe/Oslo"),
    include_briefing: Boolean(d.include_briefing ?? true),
    include_governance: Boolean(d.include_governance ?? true),
    include_quality: Boolean(d.include_quality ?? true),
    include_support: Boolean(d.include_support ?? true),
    include_knowledge: Boolean(d.include_knowledge ?? true),
    include_integrations: Boolean(d.include_integrations ?? true),
    include_security: Boolean(d.include_security ?? true),
    max_notifications_per_day: Number(d.max_notifications_per_day ?? 25),
    dedupe_window_minutes: Number(d.dedupe_window_minutes ?? 60),
  };
}
