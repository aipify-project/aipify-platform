import type {
  BlueprintLabeledItem,
  BlueprintSuccessCriterion,
  DesktopChatMessage,
  DesktopCompanionCard,
  DesktopCompanionEngineDashboard,
  DesktopEngagementSummary,
  DesktopMode,
  DesktopNotification,
  DesktopPreferences,
  DesktopReminder,
  ImplementationBlueprintMeta,
  SinceLastTimeSummary,
} from "./types";

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (!data || typeof data !== "object") return undefined;
  const d = data as Record<string, unknown>;
  return {
    phase: d.phase as string | undefined,
    doc: d.doc as string | undefined,
    engine_phase: d.engine_phase as string | undefined,
    route: d.route as string | undefined,
    mapping_note: d.mapping_note as string | undefined,
  };
}

function parseEngagementSummary(data: unknown): DesktopEngagementSummary | undefined {
  if (!data || typeof data !== "object") return undefined;
  const d = data as Record<string, unknown>;
  return {
    preferences_configured: d.preferences_configured as boolean | undefined,
    companion_enabled: d.companion_enabled as boolean | undefined,
    mode_key: d.mode_key as string | undefined,
    mode_name: d.mode_name as string | undefined,
    available_modes: d.available_modes as number | undefined,
    unread_notifications: d.unread_notifications as number | undefined,
    notifications_last_24h: d.notifications_last_24h as number | undefined,
    notifications_delivered_today: d.notifications_delivered_today as number | undefined,
    max_notifications_per_day: d.max_notifications_per_day as number | undefined,
    dedupe_window_minutes: d.dedupe_window_minutes as number | undefined,
    quiet_hours_enabled: d.quiet_hours_enabled as boolean | undefined,
    reminders_scheduled: d.reminders_scheduled as number | undefined,
    reminders_due_24h: d.reminders_due_24h as number | undefined,
    include_briefing: d.include_briefing as boolean | undefined,
    mini_chat_enabled: d.mini_chat_enabled as boolean | undefined,
  };
}

function parseLabeledItems(data: unknown): BlueprintLabeledItem[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const item = row as Record<string, unknown>;
    return {
      key: item.key as string | undefined,
      label: item.label as string | undefined,
      description: item.description as string | undefined,
      emoji: item.emoji as string | undefined,
      scenario: item.scenario as string | undefined,
      example: item.example as string | undefined,
      route: item.route as string | undefined,
      note: item.note as string | undefined,
    };
  });
}

function parseSuccessCriteria(data: unknown): BlueprintSuccessCriterion[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const item = row as Record<string, unknown>;
    return {
      key: item.key as string | undefined,
      label: item.label as string | undefined,
      met: item.met as boolean | undefined,
      note: item.note as string | null | undefined,
    };
  });
}

function parseSinceLastTime(data: unknown): SinceLastTimeSummary | null | undefined {
  if (data == null) return null;
  if (typeof data !== "object") return undefined;
  const d = data as Record<string, unknown>;
  return {
    since: d.since as string | undefined,
    since_source: d.since_source as string | undefined,
    assumption_note: d.assumption_note as string | undefined,
    support_cases_resolved: d.support_cases_resolved as number | undefined,
    kc_articles_updated: d.kc_articles_updated as number | undefined,
    high_priority_tasks_completed: d.high_priority_tasks_completed as number | undefined,
    bottlenecks_open: d.bottlenecks_open as number | undefined,
    bell_moments: d.bell_moments as number | undefined,
    recognition_moments: d.recognition_moments as number | undefined,
    trend_summary: d.trend_summary as string | undefined,
  };
}

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
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    abos_principle: d.abos_principle as string | undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: d.blueprint_note as string | undefined,
  };
}

export function parseDesktopCompanionEngineDashboard(data: unknown): DesktopCompanionEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    mission: d.mission as string | undefined,
    philosophy: d.philosophy as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    vision: d.vision as string | undefined,
    desktop_companion_engine_note: d.desktop_companion_engine_note as string | undefined,
    distinction_note: d.distinction_note as string | undefined,
    companion_objectives: parseLabeledItems(d.companion_objectives),
    companion_experiences: parseLabeledItems(d.companion_experiences),
    mini_panel_capabilities: parseLabeledItems(d.mini_panel_capabilities),
    notification_principles: (d.notification_principles as Record<string, unknown>) ?? undefined,
    self_love_connection: (d.self_love_connection as Record<string, unknown>) ?? undefined,
    self_love_note: d.self_love_note as string | undefined,
    trust_connection: (d.trust_connection as Record<string, unknown>) ?? undefined,
    configuration_options: (d.configuration_options as Record<string, unknown>) ?? undefined,
    dogfooding: (d.dogfooding as Record<string, unknown>) ?? undefined,
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : [],
    integration_links: parseLabeledItems(d.integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    since_last_time: parseSinceLastTime(d.since_last_time),
    preferences: (d.preferences as Record<string, unknown>) ?? undefined,
    modes: parseDesktopModes(d.modes),
    safety_note: d.safety_note as string | undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : [],
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
