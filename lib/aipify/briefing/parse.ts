import type {
  BriefingCard,
  BriefingEvent,
  BriefingFull,
  BriefingSettings,
  BriefingSummary,
  BriefKeyItem,
  CompanionContextBriefing,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseKeyItems(raw: unknown): BriefKeyItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = asRecord(item);
    return {
      id: r.id ? String(r.id) : undefined,
      title: String(r.title ?? ""),
      summary: r.summary ? String(r.summary) : null,
      severity: String(r.severity ?? "info"),
      requires_action: r.requires_action !== undefined ? Boolean(r.requires_action) : undefined,
      action_url: r.action_url ? String(r.action_url) : null,
      source_module: r.source_module ? String(r.source_module) : undefined,
      icon: r.icon ? String(r.icon) : undefined,
    };
  });
}

export function parseBriefingCard(raw: unknown): BriefingCard {
  if (!raw || typeof raw !== "object") return { has_customer: false };
  const r = raw as Record<string, unknown>;
  const metrics = asRecord(r.metrics);
  return {
    has_customer: Boolean(r.has_customer),
    enabled: r.enabled !== undefined ? Boolean(r.enabled) : undefined,
    greeting: r.greeting ? String(r.greeting) : undefined,
    summary: r.summary ? String(r.summary) : undefined,
    key_items: parseKeyItems(r.key_items),
    recommended_next_step: r.recommended_next_step ? String(r.recommended_next_step) : undefined,
    metrics: Object.keys(metrics).length
      ? Object.fromEntries(Object.entries(metrics).map(([k, v]) => [k, Number(v)]))
      : undefined,
    period_start: r.period_start ? String(r.period_start) : undefined,
    summary_id: r.summary_id ? String(r.summary_id) : undefined,
    privacy_note: r.privacy_note ? String(r.privacy_note) : undefined,
  };
}

export function parseBriefingFull(raw: unknown): BriefingFull {
  const card = parseBriefingCard(raw);
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    ...card,
    has_customer: card.has_customer,
    key_items: card.key_items ?? [],
    recommended_actions: parseKeyItems(r.recommended_actions),
  };
}

export function parseBriefingSummaries(raw: unknown): BriefingSummary[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = asRecord(item);
    return {
      id: String(r.id ?? ""),
      brief_type: String(r.brief_type ?? ""),
      title: String(r.title ?? ""),
      summary: String(r.summary ?? ""),
      greeting: r.greeting ? String(r.greeting) : null,
      status: String(r.status ?? "generated"),
      generated_at: String(r.generated_at ?? ""),
    };
  });
}

export function parseBriefingEvents(raw: unknown): BriefingEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = asRecord(item);
    return {
      id: String(r.id ?? ""),
      source_module: String(r.source_module ?? ""),
      source_type: String(r.source_type ?? ""),
      title: String(r.title ?? ""),
      summary: r.summary ? String(r.summary) : null,
      severity: String(r.severity ?? "info"),
      requires_action: Boolean(r.requires_action),
      action_url: r.action_url ? String(r.action_url) : null,
      occurred_at: String(r.occurred_at ?? ""),
    };
  });
}

export function parseCompanionContextBriefing(raw: unknown): CompanionContextBriefing {
  if (!raw || typeof raw !== "object") return { has_customer: false };
  const r = raw as Record<string, unknown>;
  const metrics = asRecord(r.metrics);
  return {
    has_customer: Boolean(r.has_customer),
    enabled: r.enabled !== undefined ? Boolean(r.enabled) : undefined,
    context: r.context ? String(r.context) : undefined,
    summary: r.summary ? String(r.summary) : undefined,
    key_items: parseKeyItems(r.key_items),
    metrics: Object.keys(metrics).length
      ? Object.fromEntries(
          Object.entries(metrics).map(([k, v]) => [
            k,
            typeof v === "number" ? v : String(v),
          ])
        )
      : undefined,
    companion_note: r.companion_note ? String(r.companion_note) : undefined,
    privacy_note: r.privacy_note ? String(r.privacy_note) : undefined,
  };
}

export function parseBriefingSettings(raw: unknown): BriefingSettings {
  const r = asRecord(raw);
  return {
    enabled: Boolean(r.enabled ?? true),
    since_last_login_enabled: Boolean(r.since_last_login_enabled ?? true),
    daily_brief_enabled: Boolean(r.daily_brief_enabled ?? true),
    executive_brief_enabled: Boolean(r.executive_brief_enabled ?? true),
    operational_brief_enabled: Boolean(r.operational_brief_enabled ?? true),
    default_daily_time: String(r.default_daily_time ?? "08:00"),
    default_timezone: String(r.default_timezone ?? "Europe/Oslo"),
    max_default_items: Number(r.max_default_items ?? 7),
    include_quality: Boolean(r.include_quality ?? true),
    include_support: Boolean(r.include_support ?? true),
    include_knowledge: Boolean(r.include_knowledge ?? true),
    include_governance: Boolean(r.include_governance ?? true),
    include_automation: Boolean(r.include_automation ?? true),
    include_insights: Boolean(r.include_insights ?? true),
    include_integrations: Boolean(r.include_integrations ?? true),
    include_memory: Boolean(r.include_memory ?? true),
  };
}
